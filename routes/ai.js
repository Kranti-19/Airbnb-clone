const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// AI CHAT ROUTE
router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // get all listings
    const listings = await Listing.find();
    console.log("RAW listings from DB:", listings);

    // simplify data
    const simpleListings = listings.map(l => ({
      title: l.title,
      price: l.price,
      location: l.location,
      category: l.category
    }));

    // 🎯 extract price
    const match = userMessage.match(/\d+/);
    const maxPrice = match ? parseInt(match[0]) : Infinity;

    // 🎯 detect category
    let category = null;

    if (/mountain/i.test(userMessage)) category = "Mountains";
    else if (/farm/i.test(userMessage)) category = "Farms";
    else if (/castle/i.test(userMessage)) category = "Castles";
    else if (/pool/i.test(userMessage)) category = "Pools";
    else if (/camp/i.test(userMessage)) category = "Camping";

    // ✅ DEBUG LOGS
    console.log("User message:", userMessage);
    console.log("Detected category:", category);
    console.log("Max price:", maxPrice);
    console.log("Total listings:", simpleListings.length);

    // 🎯 FILTER LOGIC (ONLY ONCE)
    let filtered = simpleListings;

    // price filter
    if (maxPrice !== Infinity) {
      filtered = filtered.filter(l => l.price <= maxPrice);
    }

    // category filter (flexible match)
    if (category) {
      filtered = filtered.filter(l => 
        l.category &&
        l.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    console.log("Filtered listings:", filtered.length);

    // no result
    if (filtered.length === 0) {
      return res.json({
        reply: "😔 No matching listings found."
      });
    }

    // format reply
    const reply = filtered
      .map(l => `🏠 ${l.title}\n💰 ₹${l.price}\n📍 ${l.location}`)
      .join("\n\n");

    // send response
    res.json({ reply });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.json({ reply: "⚠️ Error fetching data" });
  }
});

module.exports = router;