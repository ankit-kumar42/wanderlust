const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(upload.single("listing[image]"),ListingController.createListing);
  

router.get("/new", isLoggedIn, ListingController.renderNewForm);

router
  .route("/:id")
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),ListingController.updateListing)
  .delete(isLoggedIn, isOwner, ListingController.deleteListing)
  .get(ListingController.showListing);

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, ListingController.renderEditForm);

module.exports = router;
