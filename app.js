if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
console.log("Cloud Name:", process.env.CLOUD_NAME);

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js")
const listings=require("./routes/listings.js");
const review=require("./routes/review.js");
const users=require("./routes/users.js");
const session=require('express-session');
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer');
const dbURL=process.env.ATLAS_DB;
const MongoStore=require("connect-mongo");
const port = 9593;

// --- Settings ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
const store = MongoStore.create({
mongoUrl:dbURL,
crypto: {
secret: process.env.SECRET,
},
touchAfter: 24 * 3600, //for Lazy Update
});
store.on('error',()=>{
    console.log("db error:",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, // FIXED: Was 'saveUninstialized' (missing 'i')
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use("/list",listings);
app.use("/list/:id/reviews",review)
app.use("/",users);
// app.get("/demouser", wrapAsync(async (req, res) => {
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "student" // username is added automatically by the plugin
//     });

//     let registeredUser = await User.register(fakeuser, "password123");
//     res.send(registeredUser);
// }));

// --- Database Connection ---
async function main() {
    await mongoose.connect(dbURL);
}

main()
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");
        // Start server only after DB connection
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}/list`);
        });
    })
    .catch(err => console.log("❌ DB Connection Error:", err));

// --- Routes ---

// Root Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong!" } = err;
    res.status(statuscode).render("error.ejs",{ message });
});
// app.get('/listing',async(req,res)=>{
//   let list=new Listing({
//     title:"Beautiful Beach House",
//     Image:"https://unsplash.com/photos/crescent-moon-over-silhouetted-mountains-at-sunset-H90m9lW3SGw",
//     description:"A lovely beach house with stunning ocean views.",
//     price:250,
//     location:"Malibu, California",
//     country:"USA",
//   });
//  list.save().then(()=>console.log("Listing saved")).catch(err=>console.log(err));
//   res.send("working");
// });
