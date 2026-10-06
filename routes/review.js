const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");




const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};


router.post("/",isLoggedIn, validateReview, wrapAsync(async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    if(!listing){
        throw new ExpressError(404, "Cannot find that listing!");
    }
    let newReview = new Review({
        ...req.body.review,
        author: req.user._id,
    });

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect(`/listings/${listing._id}`);
}));

router.put("/:reviewID",isLoggedIn, isReviewAuthor, validateReview, wrapAsync(async(req,res) =>{
    const {id, reviewID} = req.params;
    const review = await Review.findByIdAndUpdate(
        reviewID,
        {$set: req.body.review},
        {runValidators: true}
    );
    if(!review){
        throw new ExpressError(404, "Cannot find that review!");
    }
    req.flash("success", "Review updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:reviewID",isLoggedIn, isReviewAuthor, wrapAsync(async(req,res) =>{
    let {id,reviewID}= req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
}));


module.exports = router;
