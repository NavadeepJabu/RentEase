import express from "express";
import {
    getProfile,
    updateProfile,
    uploadProfileImage
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(protect, getProfile)
    .put(protect, updateProfile);
router.put(
    "/upload-image",
    protect,
    upload.single("profileImage"),
    uploadProfileImage
);
export default router;