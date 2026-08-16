import ServiceArea from "../models/ServiceArea.js";
import asyncHandler from "../utils/asyncHandler.js";

// ==========================================
// CUSTOMER - CHECK SERVICE AVAILABILITY
// ==========================================

export const checkServiceAvailability = asyncHandler(
  async (req, res) => {
    const { pincode } = req.query;

    if (!pincode || !pincode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    const cleanPincode = pincode.trim();

    const serviceArea = await ServiceArea.findOne({
      pincode: cleanPincode,
      status: "Active",
      deliveryAvailable: true,
    });

    if (!serviceArea) {
      return res.status(200).json({
        success: true,
        available: false,
        message:
          "Sorry, delivery is currently unavailable in this pincode.",
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message:
        "Great! We deliver to your location.",
      serviceArea,
    });
  }
);

// ==========================================
// GET ALL SERVICE AREAS
// ==========================================

export const getServiceAreas = asyncHandler(
  async (req, res) => {
    const serviceAreas = await ServiceArea.find().sort({
      city: 1,
      area: 1,
    });

    return res.status(200).json({
      success: true,
      count: serviceAreas.length,
      serviceAreas,
    });
  }
);

// ==========================================
// CREATE SERVICE AREA
// ==========================================

export const createServiceArea = asyncHandler(
  async (req, res) => {
    const {
      city,
      area,
      pincode,
      deliveryAvailable,
      maintenanceAvailable,
      status,
    } = req.body;

    if (!city || !area || !pincode) {
      return res.status(400).json({
        success: false,
        message:
          "City, area and pincode are required",
      });
    }

    const existingArea =
      await ServiceArea.findOne({
        city: city.trim(),
        area: area.trim(),
        pincode: pincode.trim(),
      });

    if (existingArea) {
      return res.status(400).json({
        success: false,
        message:
          "This service area already exists",
      });
    }

    const serviceArea =
      await ServiceArea.create({
        city: city.trim(),
        area: area.trim(),
        pincode: pincode.trim(),
        deliveryAvailable:
          deliveryAvailable !== undefined
            ? deliveryAvailable
            : true,
        maintenanceAvailable:
          maintenanceAvailable !== undefined
            ? maintenanceAvailable
            : true,
        status: status || "Active",
      });

    return res.status(201).json({
      success: true,
      message:
        "Service area added successfully",
      serviceArea,
    });
  }
);

// ==========================================
// UPDATE SERVICE AREA
// ==========================================

export const updateServiceArea =
  asyncHandler(async (req, res) => {
    const serviceArea =
      await ServiceArea.findById(
        req.params.id
      );

    if (!serviceArea) {
      return res.status(404).json({
        success: false,
        message: "Service area not found",
      });
    }

    const {
      city,
      area,
      pincode,
      deliveryAvailable,
      maintenanceAvailable,
      status,
    } = req.body;

    if (city !== undefined)
      serviceArea.city = city.trim();

    if (area !== undefined)
      serviceArea.area = area.trim();

    if (pincode !== undefined)
      serviceArea.pincode = pincode.trim();

    if (
      deliveryAvailable !== undefined
    ) {
      serviceArea.deliveryAvailable =
        deliveryAvailable;
    }

    if (
      maintenanceAvailable !== undefined
    ) {
      serviceArea.maintenanceAvailable =
        maintenanceAvailable;
    }

    if (status !== undefined)
      serviceArea.status = status;

    await serviceArea.save();

    return res.status(200).json({
      success: true,
      message:
        "Service area updated successfully",
      serviceArea,
    });
  });

// ==========================================
// DELETE SERVICE AREA
// ==========================================

export const deleteServiceArea =
  asyncHandler(async (req, res) => {
    const serviceArea =
      await ServiceArea.findById(
        req.params.id
      );

    if (!serviceArea) {
      return res.status(404).json({
        success: false,
        message: "Service area not found",
      });
    }

    await serviceArea.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Service area deleted successfully",
    });
  });