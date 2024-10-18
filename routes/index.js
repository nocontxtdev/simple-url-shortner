import express from "express";
import Url from "../models/url.js";

const router = express.Router();

/**
 * Helper function to fetch paginated URLs and total pages.
 */
async function getPaginatedUrls(page) {
  const perPage = 5; // Number of URLs to show per page
  const totalUrls = await Url.countDocuments({});
  const urls = await Url.find({})
    .skip(perPage * page - perPage) // Skip the previous pages' URLs
    .limit(perPage); // Limit to the number of URLs per page

  const totalPages = Math.ceil(totalUrls / perPage);
  return { urls, totalPages };
}

// GET homepage
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the current page, default to 1 if not provided

    // Use the helper function to get paginated URLs
    const { urls, totalPages } = await getPaginatedUrls(page);

    // Render the index page with pagination
    res.render("index", {
      shortUrl: null,
      urls,
      currentPage: page,
      totalPages,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST route to shorten a URL
router.post("/shorten", async (req, res) => {
  const longUrl = req.body.longUrl;
  let expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;

  // Validate the expiration date
  if (expiresAt && isNaN(expiresAt.getTime())) {
    expiresAt = null; // If an invalid date is given, set it to null
  }

  // Check if the expiration date is in the past
  if (expiresAt && expiresAt < new Date()) {
    const page = parseInt(req.query.page) || 1; // Get the current page, default to 1 if not provided

    // Use the helper function to get paginated URLs
    const { urls, totalPages } = await getPaginatedUrls(page);

    return res.render("index", {
      shortUrl: null,
      urls,
      currentPage: page,
      totalPages,
      error: "The expiration date cannot be in the past.",
    });
  }

  try {
    // Check if the URL with the same longUrl and expiresAt already exists
    const existingUrl = await Url.findOne({
      longUrl,
      expiresAt: expiresAt || { $exists: false }, // Match both null and no expiration date
    });

    if (existingUrl) {
      // Case 2: URL exists with the same expiration date, return the existing one
      const shortUrl = `${req.protocol}://${req.get("host")}/${
        existingUrl.shortUrl
      }`;

      const page = parseInt(req.query.page) || 1; // Get the current page, default to 1 if not provided

      // Use the helper function to get paginated URLs
      const { urls, totalPages } = await getPaginatedUrls(page);

      return res.render("index", {
        shortUrl,
        urls,
        currentPage: page,
        totalPages,
        error: null,
      });
    }

    // Case 1 & 3: Create a new shortened URL since it's either a new URL or different expiration
    const url = new Url({ longUrl, expiresAt });
    await url.save();

    const shortUrl = `${req.protocol}://${req.get("host")}/${url.shortUrl}`;

    // Pagination variables

    const page = req.query.page || 1;
    const { urls, totalPages } = await getPaginatedUrls(page);

    res.render("index", {
      shortUrl,
      urls,
      currentPage: page,
      totalPages,
      error: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Redirect to the original URL if not expired
router.get("/:shortUrl", async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });

    if (url) {
      // Check if the URL has expired
      if (url.expiresAt && new Date() > url.expiresAt) {
        return res.status(410).send("This shortened URL has expired");
      }

      // Increment the click count and save
      url.clicks++;
      await url.save();

      // Redirect to the original long URL
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).send("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
