import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // removes whitespace
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      // Ensure price is non-negative
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      // Array of Strings for image URLs
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.every((url) => typeof url === "string");
        },
        message: "Images must be an array of strings (URLs).",
      },
      required: false,
    },
    stockStatus: {
      // True for in-stock, false for out-of-stock
      type: Boolean,
      required: true,
      default: true,
    },
    category: {
      // Optional category field, will be created in the future
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
