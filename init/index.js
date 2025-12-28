const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old data cleared."); // Add this
  initData.data = initData.data.map((obj)=>({
...obj,
owner: "694cc27e68c0a6a8e42fb27e",
}));
await Listing.insertMany (initData.data);
  await Listing.insertMany(initData.data);
  console.log("New data from data.js inserted."); // Add this
};

initDB();
