if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() =>{
        console.log("connected to DB");
        app.listen(8080, ()=>{
            console.log("server is running to port 8080");
        });
    })
    .catch((err) =>{
        console.error("Failed to connect to MongoDB:", err);
        for (const [address, server] of err.reason?.servers ?? []) {
            console.error(`${address}:`, server.error ?? server.type);
        }
        process.exitCode = 1;
    })

async function main() {
    if (!dbUrl) {
        throw new Error("ATLASDB_URL is not set. Add your MongoDB Atlas connection string to .env.");
    }
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600, 
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) =>{
//     let FakeUser = new User({username: "DemoUser", email: "Demouser@gmail.com"});
//     let registeredUser = await User.register(FakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);                                       
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("/*splat", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) =>{
    let {statusCode=500, message="Someting Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});
