const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};


 module.exports.createListing = wrapAsync(async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
     const listing = new Listing(req.body.listing);
     listing.owner = req.user._id;
     listing.image={url,filename};
     await listing.save();
     req.flash("success", "New Listing Added!");
     res.redirect("/listings");
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  if (!listing) {
    req.flash("error", "Listing Does Not Exists");
    res.redirect("/listings");
  }

  res.render("./listings/edit.ejs", { listing,originalImageUrl});
});

module.exports.updateListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
  }
  listing.save();
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
