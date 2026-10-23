
const User = require("../models/user.js");

module.exports.renderRegisterForm = (req,res) =>{
    res.render("users/register.ejs");
};

module.exports.registerUser = async(req,res,next) =>{
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
   
};

module.exports.renderLoginForm =  (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.loginUser = async(req,res) =>{
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res,next) =>{
    req.logout((err) =>{
        if(err){
            next(err);
        } {
            req.flash("success", "You have been logged out.");
        }
        res.redirect("/listings");
    });
};