const Listing = require('./models/listing.js');
const Review= require('./models/reviews.js');
const ExpressError=require("./utils/ExpressError.js")
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    // Safety check: if listing has no owner or doesn't exist
    if (!listing || !listing.owner) {
        req.flash("error", "Permission denied or Listing not found");
        return res.redirect(`/list`);
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/list/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    // Safety check: if review doesn't exist
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/list/${id}`);
    }

    // Check if current user is the author
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/list/${id}`);
    }
    next();
};
// Check if req.body exists to prevent "undefined" errors
module.exports.validateListing = (req, res, next) => {
    if (!req.body || !req.body.listing) {
        return next(new ExpressError(400, "Send valid data for listing"));
    }
    let { error } = listingSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    // Change .listing to .review
    if (!req.body || !req.body.review) {
        return next(new ExpressError(400, "Send valid data for review"));
    }
    
    // Validate against reviewSchema, not listingSchema
    let { error } = reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};