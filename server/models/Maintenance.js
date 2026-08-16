import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    // ==========================================
    // CUSTOMER
    // ==========================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // PRODUCT
    // ==========================================

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ==========================================
    // ISSUE
    // ==========================================

    issue: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // PRIORITY
    // ==========================================

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Resolved",
      ],
      default: "Pending",
    },

    // ==========================================
    // ASSIGNMENT
    // ==========================================

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ADMIN / TECHNICIAN NOTES
    // ==========================================

    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },

    resolutionNotes: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // RESOLUTION
    // ==========================================

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Maintenance",
  maintenanceSchema
);