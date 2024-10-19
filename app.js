import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import cron from "node-cron";

const app = express();

// Database connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener",
  {}
);

cron.schedule("0 0 * * *", async () => {
  try {
    await Url.deleteMany({ expiresAt: { $lt: new Date() } });
    console.log("Expired URLs removed");
  } catch (err) {
    console.error("Error removing expired URLs", err);
  }
});

// Set the view engine and middleware
app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Use the routes
app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
