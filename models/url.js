import mongoose from "mongoose";
import { nanoid } from "nanoid";

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: () => nanoid(6),
  },
  clicks: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date, // Store the expiration date
    default: null,
  },
});

const Url = mongoose.model("Url", urlSchema);

export default Url;
