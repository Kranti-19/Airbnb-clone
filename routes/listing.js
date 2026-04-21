const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// ================= INDEX (SMART SEARCH) =================
router.get("/", async (req, res, next) => {
  try {
    const { search, category } = req.query;

    let query = {};
    let selectedCategory = null;

    if (category) {
      query.category = category;
      selectedCategory = category;
    }

    if (search) {
      const text = search.toLowerCase();

      const match = text.match(/\d+/);
      const maxPrice = match ? parseInt(match[0]) : null;

      let searchCategory = null;

      if (/room|rooms/i.test(text)) searchCategory = "Rooms";
      else if (/mountain/i.test(text)) searchCategory = "Mountains";
      else if (/farm/i.test(text)) searchCategory = "Farms";
      else if (/castle/i.test(text)) searchCategory = "Castles";
      else if (/pool/i.test(text)) searchCategory = "Pools";
      else if (/camp/i.test(text)) searchCategory = "Camping";

      const words = text.split(" ");
      let location = null;

      for (let word of words) {
        if (word !== "under" && word !== "in" && isNaN(word)) {
          location = word;
          break;
        }
      }

      if (location) {
        query.location = new RegExp(location, "i");
      }

      if (searchCategory) {
        query.category = searchCategory;
        selectedCategory = searchCategory;
      }

      if (maxPrice) {
        query.price = { $lte: maxPrice };
      }
    }

    const listings = await Listing.find(query);

    res.render("listings/index", {
      allListings: listings,
      selectedCategory,
      search
    });

  } catch (err) {
    next(err);
  }
});


// ================= NEW =================
router.get("/new", isLoggedIn, listingController.renderNewForm);


// ================= SHOW =================
router.get("/:id", wrapAsync(listingController.showListing));


// ================= UPDATE =================
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(listingController.updateListing)
);


// ================= DELETE =================
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);


// ================= EDIT =================
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


// ✅ EXPORT AT VERY END
module.exports = router;