const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async(req,res) =>{
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
};

module.exports.deleteReview = async(req,res) =>{
    let {id,reviewID}= req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${id}`);
};