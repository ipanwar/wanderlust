const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
};


module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({path: "reviews", populate: {path: "author"}});
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing, mapToken: process.env.MAP_TOKEN});
};


module.exports.createListing = async (req,res, next) =>{

    const { secure_url, public_id } = req.file;
    const listing = req.body.listing;
    
    const newListing = new Listing({
        ...listing,
        image: {
            filename: public_id,
            url: secure_url,
        },
    });

  
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
 
};


module.exports.renderEditForm = (req,res) =>{
    const {listing} = res.locals;
    res.render("listings/edit.ejs", {listing});
};


module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    const updatedListing = {...req.body.listing};

    if(typeof req.file !== "undefined") {
        const { secure_url, public_id } = req.file;
        updatedListing.image = {
            filename: public_id,
            url: secure_url,
        };
    
    await Listing.findByIdAndUpdate(id, updatedListing);
    await Listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};