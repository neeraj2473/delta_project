const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js");

// Import the controller
const reviewController = require("../controllers/reviews.js");

// POST Review Route
router.post("/", 
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview)
);

// DELETE Review Route
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;