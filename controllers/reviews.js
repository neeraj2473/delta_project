const Listing = require("../models/listing");
const Review = require("../models/reviews");

// Create Review Logic
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    req.flash("success", "Review created!");
    res.redirect(`/list/${listing._id}`);
};

// Delete Review Logic
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove review reference from Listing and delete the Review document
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review deleted!");
    res.redirect(`/list/${id}`);
};