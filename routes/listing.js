const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
  }),
);

//NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  res.render("./listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
  }),
);

//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Does Not Exists");
      res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { listing });
  }),
);

//UPDATE ROUTE
router.put(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

//DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }),
);

//SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    res.render("./listings/show.ejs", { listing });
  }),
);

module.exports = router;
