const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isListingOwner} = require("../middleware.js");



const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};



//Index route
router.get("/", wrapAsync(async (req,res) => {
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs", {alllistings})
    
}));

//New route
router.get("/new",isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({path: "reviews", populate: {path: "author"}});
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//create route
router.post("/",validateListing,isLoggedIn, wrapAsync(async (req,res, next) =>{

   
    const listing = req.body.listing;
    
    const newListing = new Listing({
        ...listing,
        image: {
            filename: "listingimage",
            url: listing.image,
        },
    });

  
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
 
}));

//edit route
router.get("/:id/edit",isLoggedIn, isListingOwner, (req,res) =>{
    const {listing} = res.locals;
    res.render("listings/edit.ejs", {listing});
});

//update route
router.put("/:id",isLoggedIn, isListingOwner, validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = req.body.listing;

    await Listing.findByIdAndUpdate(id,{
        ...listing,
        image:{
            filename:"listingimage",
            url: listing.image,
        },
    });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));


//delete route
router.delete("/:id",isLoggedIn, isListingOwner, wrapAsync(async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));


module.exports = router;