const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isListingOwner} = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};


router.route("/").get( wrapAsync(ListingController.index)).post(validateListing,isLoggedIn,upload.single("listing[image]"), wrapAsync(ListingController.createListing));


//New route
router.get("/new",isLoggedIn, ListingController.renderNewForm);


router.route("/:id").get(wrapAsync(ListingController.showListing)).put(isLoggedIn, isListingOwner,upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updateListing)).delete(isLoggedIn, isListingOwner, wrapAsync(ListingController.deleteListing));


//edit route
router.get("/:id/edit",isLoggedIn, isListingOwner, ListingController.renderEditForm);




module.exports = router;