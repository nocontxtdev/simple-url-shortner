import express from "express";
import Url from "../models/url.js";

const router = express.Router();

// GET homepage
router.get("/", (req, res) => {
  res.render("index", { shortUrl: null });
});

// POST route to shorten a URL
router.post("/shorten", async (req, res) => {
  const longUrl = req.body.longUrl;
  // console.log("longUrl:", longUrl);

  try {
    const url = new Url({ longUrl });
    await url.save();

    const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortUrl}`;

    res.render("index", { shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Redirect to the original URL
router.get("/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) return res.status(404).send("URL not found");

    url.clicks++;
    await url.save();

    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
