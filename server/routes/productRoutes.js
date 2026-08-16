import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/productUpload.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { validateProduct } from "../validators/productValidator.js";

const router = express.Router();

router
    .route("/")
    .post(
        protect,
        adminOnly,
        upload.array("images", 5),
        validateProduct,
        addProduct
    )
    .get(getProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(
    protect,
    adminOnly,
    upload.array("images", 5),
    updateProduct
  )
  .delete(
    protect,
    adminOnly,
    deleteProduct
  );
export default router;