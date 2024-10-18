const express = require("express");
const router = express.Router();

// GET homepage
router.get("/", (req, res) => {
  res.render("index", { shortUrl: null });
});

module.exports = router;
