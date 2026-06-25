const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does Not Exists");
    res.redirect("/listings");
  }

  res.render("./listings/edit.ejs", { listing });
});

module.exports.updateListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
});

module.exports.showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  res.render("./listings/show.ejs", { listing });
});
