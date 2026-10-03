const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/register", (req,res) =>{
    res.render("users/register.ejs");
});

router.post("/register", wrapasync(async(req,res) =>{
    try{
         let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
   
}));


router.get("/login", (req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async(req,res) =>{
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
});

module.exports = router;