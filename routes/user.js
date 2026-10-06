const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/register", (req,res) =>{
    res.render("users/register.ejs");
});

router.post("/register", wrapasync(async(req,res) =>{
    try{
         let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
   
}));


router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async(req,res) =>{
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});


router.get("/logout", (req,res,next) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        } {
            req.flash("success", "You have been logged out.");
        }
        res.redirect("/listings");
    });
});

module.exports = router;