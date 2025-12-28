const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require('../middlewares.js');
const multer = require('multer');
const { storage } = require("../cloudConfig.js"); // Ensure you have a cloudConfig file
const upload = multer({ storage });

// Import the controller
const listingController = require("../controllers/listings.js");

// Index and Create Routes
router.route("/")
    .get(wrapAsync(listingController.index))
 .post(isLoggedIn, upload.single('listing[image][filename]'),validateListing, wrapAsync(listingController.createListing));

// New Form Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show, Update, and Delete Routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image][filename]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Form Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
}));

module.exports = router;