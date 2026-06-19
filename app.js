const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.listen(8080, () => {
  console.log("Server Running on port 8080");
});

app.get("/", (req, res) => {
  res.cookie("main", "wanderlust", { signed: true });

  console.dir(req.signedCookies);
  let { main = "unknown" } = req.signedCookies;
  res.send(`Root of ${main}`);
});

//LISTINGS ROUTES
app.use("/listings", listings);
//REVIEW ROUTES
app.use("/listings/:id/review", reviews);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("./Errors/error.ejs", { message });
});
