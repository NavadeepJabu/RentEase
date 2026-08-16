import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Furniture", "Appliance"],
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    rentalTenure: [
      {
        type: Number,
      },
    ],

    quantity: {
      type: Number,
      default: 1,
    },

    available: {
      type: Boolean,
      default: true,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);