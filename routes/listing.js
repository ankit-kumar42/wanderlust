const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

//INDEX ROUTE
router.get("/", wrapAsync(ListingController.index));

//NEW ROUTE
router.get("/new", isLoggedIn, ListingController.renderNewForm);

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
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.renderEditForm);

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, ListingController.updateListing);

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, ListingController.deleteListing);

//SHOW ROUTE
router.get("/:id", ListingController.showListing);

module.exports = router;
