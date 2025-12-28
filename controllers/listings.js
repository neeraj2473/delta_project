const Listing = require("../models/listing");
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);
 
// Index Route Logic
module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("index.ejs", { listings });
};

// Render New Form Logic
module.exports.renderNewForm = (req, res) => {
    res.render("new.ejs");
};

// Show Route Logic
module.exports.showListing = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/list");
    }
    res.render("show.ejs", { listing });
};

// Create Route Logic
module.exports.createListing = async (req, res) => {
    let url = req.file.path;        // Cloudinary URL
    let filename = req.file.filename; // Cloudinary Filename
    
    let response = await geocoder.geocode(req.body.listing.location);
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: req.file.path, filename: req.file.filename };

    // 3. Save Geometry
    newListing.geometry = {
        type: 'Point',
        coordinates: [response[0].longitude, response[0].latitude]
    };

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/list");
};

// Update Route Logic
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/list/${id}`);
};

// Delete Route Logic
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/list");
};