const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const{validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

//ADD REVIEW
router.post("", isLoggedIn,validateReview,ReviewController.addReview);

//DELETE REVIEW
router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor,ReviewController.destroyReview);

module.exports = router;