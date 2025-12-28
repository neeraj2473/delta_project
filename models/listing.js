const mongoose = require('mongoose');
const Review = require('./reviews'); // Ensure this matches your filename
const User=require('./user');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
         url: {
            type: String,
            required: true,
            // default: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
            // set: (v) => v === "" ? "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60" : v
        },
        filename: {
            type: String,
            default: "listingimage"
        }
    },
    owner:{
type:Schema.Types.ObjectId,
ref:"User"
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
// geometry: {
//         type: {
//             type: String, 
//             enum: ['Point'], 
//             required: true
//         },
//         coordinates: {
//             type: [Number],
//             required: true
//         }
//     }
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete all reviews whose IDs are in the deleted listing's reviews array
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;