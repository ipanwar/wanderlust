const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controller/users.js");



router.route("/register").get( UserController.renderRegisterForm).post( wrapasync(UserController.registerUser));


router.route("/login").get(UserController.renderLoginForm).post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), UserController.loginUser);


// Handle user logout
router.get("/logout", UserController.logoutUser);



module.exports = router;