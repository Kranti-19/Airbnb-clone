const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// AI CHAT ROUTE
router.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    const listings = await Listing.find();

    const simpleListings = listings.map(l => ({
      title: l.title,
      price: l.price,
      location: l.location,
      category: l.category
    }));

    // 🎯 Extract price
    const match = userMessage.match(/\d+/);
    const maxPrice = match ? parseInt(match[0]) : Infinity;

    // 🎯 Detect category (robust)
    let category = null;

    if (/room|rooms/i.test(userMessage)) category = "Rooms";
    else if (/mountain/i.test(userMessage)) category = "Mountains";
    else if (/farm/i.test(userMessage)) category = "Farms";
    else if (/castle/i.test(userMessage)) category = "Castles";
    else if (/pool/i.test(userMessage)) category = "Pools";
    else if (/camp/i.test(userMessage)) category = "Camping";

    console.log("User message:", userMessage);
    console.log("Detected category:", category);
    console.log("Max price:", maxPrice);

    // 🎯 FINAL FILTER (CORRECT LOGIC)
    const filtered = simpleListings.filter(l => {
      const matchesPrice = l.price <= maxPrice;

      const matchesCategory = category
        ? l.category &&
          l.category.toLowerCase() === category.toLowerCase()
        : true;

      return matchesPrice && matchesCategory;
    });

    if (filtered.length === 0) {
      return res.json({ reply: "No matching listings found." });
    }

    const reply = filtered
      .map(l => `${l.title} - ${l.price} - ${l.location}`)
      .join("\n");

    res.json({ reply });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.json({ reply: "⚠️ Error fetching data" });
  }
});

module.exports = router;