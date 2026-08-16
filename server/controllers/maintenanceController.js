import Maintenance from "../models/Maintenance.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  createNotification,
} from "../services/notificationService.js";

// =====================================================
// CUSTOMER - CREATE MAINTENANCE REQUEST
// =====================================================

export const createMaintenanceRequest =
  asyncHandler(async (req, res) => {
    const {
      product,
      issue,
      description,
      priority,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      !product ||
      !issue ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product, issue and description are required",
      });
    }

    // -----------------------------------------------
    // CHECK PRODUCT
    // -----------------------------------------------

    const selectedProduct =
      await Product.findById(product);

    if (!selectedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------------
    // CREATE REQUEST
    // -----------------------------------------------

    const maintenance =
      await Maintenance.create({
        customer: req.user.id,
        product,
        issue: issue.trim(),
        description: description.trim(),
        priority:
          priority || "Medium",
      });

    // -----------------------------------------------
    // CUSTOMER NOTIFICATION
    // -----------------------------------------------

    await createNotification({
      userId: req.user.id,

      type: "maintenance",

      title:
        "Maintenance Request Submitted",

      message:
        `Your maintenance request for ${selectedProduct.name} has been submitted successfully.`,

      maintenanceId:
        maintenance._id,
    });

    return res.status(201).json({
      success: true,

      message:
        "Maintenance request created successfully",

      maintenance,
    });
  });

// =====================================================
// CUSTOMER - GET MY MAINTENANCE REQUESTS
// =====================================================

export const getMyMaintenanceRequests =
  asyncHandler(async (req, res) => {
    const requests =
      await Maintenance.find({
        customer: req.user.id,
      })
        .populate(
          "product",
          "name brand images"
        )
        .populate(
          "assignedTo",
          "fullName email phone"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  });

// =====================================================
// ADMIN - GET ALL MAINTENANCE REQUESTS
// =====================================================

export const getAllMaintenanceRequests =
  asyncHandler(async (req, res) => {
    const requests =
      await Maintenance.find()
        .populate(
          "customer",
          "fullName email phone"
        )
        .populate(
          "product",
          "name brand images"
        )
        .populate(
          "assignedTo",
          "fullName email phone"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  });

// =====================================================
// ADMIN - GET ASSIGNABLE STAFF
// =====================================================
// =====================================================
// ADMIN - GET ASSIGNABLE STAFF
// =====================================================

export const getAssignableStaff =
  asyncHandler(async (req, res) => {
    try {
      const staff = await User.find({
        role: {
          $in: ["admin", "vendor"],
        },
      })
        .select(
          "fullName email phone role"
        )
        .sort({
          fullName: 1,
        });

      return res.status(200).json({
        success: true,
        count: staff.length,
        staff,
      });
    } catch (error) {
      console.error(
        "GET ASSIGNABLE STAFF ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load assignable staff",
      });
    }
  });

// =====================================================
// ADMIN - UPDATE MAINTENANCE REQUEST
// =====================================================

export const updateMaintenanceRequest =
  asyncHandler(async (req, res) => {
    const {
      status,
      priority,
      assignedTo,
      adminNotes,
      resolutionNotes,
    } = req.body;

    // -----------------------------------------------
    // FIND REQUEST
    // -----------------------------------------------

    const request =
      await Maintenance.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Maintenance request not found",
      });
    }

    // -----------------------------------------------
    // STORE OLD VALUES
    // -----------------------------------------------

    const oldStatus =
      request.status;

    const oldPriority =
      request.priority;

    const oldAssignedTo =
      request.assignedTo
        ? request.assignedTo.toString()
        : null;

    const oldAdminNotes =
      request.adminNotes || "";

    const oldResolutionNotes =
      request.resolutionNotes || "";

    // -----------------------------------------------
    // GET PRODUCT
    // -----------------------------------------------

    const product =
      await Product.findById(
        request.product
      );

    const productName =
      product?.name ||
      "your rental product";

    // -----------------------------------------------
    // STATUS
    // -----------------------------------------------

    if (status !== undefined) {
      const allowedStatus = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (
        !allowedStatus.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid maintenance status",
        });
      }

      request.status = status;

      // Automatically set resolution date

      if (status === "Resolved") {
        request.resolvedAt =
          new Date();
      } else {
        request.resolvedAt = null;
      }
    }

    // -----------------------------------------------
    // PRIORITY
    // -----------------------------------------------

    if (priority !== undefined) {
      const allowedPriority = [
        "Low",
        "Medium",
        "High",
        "Urgent",
      ];

      if (
        !allowedPriority.includes(
          priority
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid maintenance priority",
        });
      }

      request.priority =
        priority;
    }

    // -----------------------------------------------
    // ASSIGN TECHNICIAN / STAFF
    // -----------------------------------------------

    if (assignedTo !== undefined) {
      if (
        assignedTo === null ||
        assignedTo === ""
      ) {
        request.assignedTo = null;
        request.assignedAt = null;
      } else {
        const assignedUser =
          await User.findById(
            assignedTo
          );

        if (!assignedUser) {
          return res.status(404).json({
            success: false,
            message:
              "Assigned user not found",
          });
        }

        request.assignedTo =
          assignedTo;

        request.assignedAt =
          new Date();

        // Automatically move pending
        // request to In Progress

        if (
          request.status ===
          "Pending"
        ) {
          request.status =
            "In Progress";
        }
      }
    }

    // -----------------------------------------------
    // ADMIN NOTES
    // -----------------------------------------------

    if (
      adminNotes !== undefined
    ) {
      request.adminNotes =
        adminNotes.trim();
    }

    // -----------------------------------------------
    // RESOLUTION NOTES
    // -----------------------------------------------

    if (
      resolutionNotes !== undefined
    ) {
      request.resolutionNotes =
        resolutionNotes.trim();
    }

    // -----------------------------------------------
    // SAVE
    // -----------------------------------------------

    await request.save();

    // =================================================
    // CREATE CUSTOMER NOTIFICATIONS
    // =================================================

    // -----------------------------------------------
    // 1. STATUS CHANGED
    // -----------------------------------------------

    if (
      status !== undefined &&
      oldStatus !== request.status
    ) {
      let title =
        "Maintenance Status Updated";

      let message =
        `The maintenance status for ${productName} has been changed to ${request.status}.`;

      if (
        request.status ===
        "In Progress"
      ) {
        title =
          "Maintenance In Progress";

        message =
          `Maintenance work for ${productName} is now in progress.`;
      }

      if (
        request.status ===
        "Resolved"
      ) {
        title =
          "Maintenance Resolved";

        message =
          `The maintenance issue for ${productName} has been resolved.`;
      }

      if (
        request.status ===
        "Pending"
      ) {
        title =
          "Maintenance Pending";

        message =
          `Your maintenance request for ${productName} is currently pending.`;
      }

      await createNotification({
        userId:
          request.customer,

        type:
          "maintenance",

        title,

        message,

        maintenanceId:
          request._id,
      });
    }

    // -----------------------------------------------
    // 2. AUTO STATUS CHANGE AFTER ASSIGNMENT
    // -----------------------------------------------

    if (
      assignedTo !== undefined &&
      oldAssignedTo !==
        (
          request.assignedTo
            ? request.assignedTo.toString()
            : null
        )
    ) {
      // ---------------------------------------------
      // Technician removed
      // ---------------------------------------------

      if (
        !request.assignedTo
      ) {
        await createNotification({
          userId:
            request.customer,

          type:
            "maintenance",

          title:
            "Technician Assignment Removed",

          message:
            `The technician assignment for ${productName} has been removed.`,

          maintenanceId:
            request._id,
        });
      }

      // ---------------------------------------------
      // Technician assigned
      // ---------------------------------------------

      else {
        const assignedUser =
          await User.findById(
            request.assignedTo
          );

        const technicianName =
          assignedUser?.fullName ||
          assignedUser?.email ||
          "a technician";

        await createNotification({
          userId:
            request.customer,

          type:
            "maintenance",

          title:
            "Technician Assigned",

          message:
            `${technicianName} has been assigned to handle the maintenance request for ${productName}.`,

          maintenanceId:
            request._id,
        });

        // -------------------------------------------
        // If assignment automatically changed
        // Pending -> In Progress
        // -------------------------------------------

        if (
          oldStatus ===
            "Pending" &&
          request.status ===
            "In Progress" &&
          status === undefined
        ) {
          await createNotification({
            userId:
              request.customer,

            type:
              "maintenance",

            title:
              "Maintenance In Progress",

            message:
              `Maintenance work for ${productName} has started.`,

            maintenanceId:
              request._id,
          });
        }
      }
    }

    // -----------------------------------------------
    // 3. PRIORITY CHANGED
    // -----------------------------------------------

    if (
      priority !== undefined &&
      oldPriority !==
        request.priority
    ) {
      await createNotification({
        userId:
          request.customer,

        type:
          "maintenance",

        title:
          "Maintenance Priority Updated",

        message:
          `The priority of your maintenance request for ${productName} has been changed to ${request.priority}.`,

        maintenanceId:
          request._id,
      });
    }

    // -----------------------------------------------
    // 4. ADMIN NOTES UPDATED
    // -----------------------------------------------

    if (
      adminNotes !== undefined &&
      oldAdminNotes !==
        request.adminNotes
    ) {
      await createNotification({
        userId:
          request.customer,

        type:
          "maintenance",

        title:
          "Maintenance Update",

        message:
          `RentEase has added an update to your maintenance request for ${productName}.`,

        maintenanceId:
          request._id,
      });
    }

    // -----------------------------------------------
    // 5. RESOLUTION NOTES UPDATED
    // -----------------------------------------------

    if (
      resolutionNotes !==
        undefined &&
      oldResolutionNotes !==
        request.resolutionNotes
    ) {
      await createNotification({
        userId:
          request.customer,

        type:
          "maintenance",

        title:
          "Maintenance Resolution Update",

        message:
          `New resolution details have been added to your maintenance request for ${productName}.`,

        maintenanceId:
          request._id,
      });
    }

    // -----------------------------------------------
    // GET UPDATED REQUEST
    // -----------------------------------------------

    const updatedRequest =
      await Maintenance.findById(
        request._id
      )
        .populate(
          "customer",
          "fullName email phone"
        )
        .populate(
          "product",
          "name brand images"
        )
        .populate(
          "assignedTo",
          "fullName email phone role"
        );

    return res.status(200).json({
      success: true,

      message:
        "Maintenance request updated successfully",

      request:
        updatedRequest,
    });
  });

// =====================================================
// ADMIN - GET MAINTENANCE STATISTICS
// =====================================================

export const getMaintenanceStats =
  asyncHandler(async (req, res) => {
    const total =
      await Maintenance.countDocuments();

    const pending =
      await Maintenance.countDocuments({
        status: "Pending",
      });

    const inProgress =
      await Maintenance.countDocuments({
        status: "In Progress",
      });

    const resolved =
      await Maintenance.countDocuments({
        status: "Resolved",
      });

    const urgent =
      await Maintenance.countDocuments({
        priority: "Urgent",
      });

    const high =
      await Maintenance.countDocuments({
        priority: "High",
      });

    return res.status(200).json({
      success: true,

      stats: {
        total,
        pending,
        inProgress,
        resolved,
        urgent,
        high,
      },
    });
  });