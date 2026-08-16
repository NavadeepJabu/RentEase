import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      brand,
      description,
      monthlyRent,
      securityDeposit,
      rentalTenure,
      quantity,
    } = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !subCategory ||
      !brand ||
      !description ||
      !monthlyRent ||
      !securityDeposit
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const images = req.files
  ? req.files.map(file => `/uploads/products/${file.filename}`)
  : [];

    const product = await Product.create({
      name,
      category,
      subCategory,
      brand,
      images,
      description,
      monthlyRent,
      securityDeposit,
      rentalTenure,
      quantity,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/

export const getProducts = asyncHandler(async (req, res) => {

    const search = req.query.search || "";
    const filter = {};
    if (search) {
    filter.name = {
        $regex: search,
        $options: "i",
    };
}
const category = req.query.category;
const brand = req.query.brand;

if (brand) {
    filter.brand = brand;
}
const minRent = req.query.minRent;
const maxRent = req.query.maxRent;
if (minRent || maxRent) {
    filter.monthlyRent = {};

    if (minRent) {
        filter.monthlyRent.$gte = Number(minRent);
    }

    if (maxRent) {
        filter.monthlyRent.$lte = Number(maxRent);
    }
}
if (category) {
    filter.category = category;
}
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;
const skip = (page - 1) * limit;
const totalProducts = await Product.countDocuments(filter);
const sort = req.query.sort || "-createdAt";
const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

/*const products = await Product.find({
    name: {
        $regex: search,
        $options: "i",
    },
});*/

    return res.status(200).json({
    success: true,
    page,
    limit,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    count: products.length,
    products,
});

});

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product

export const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      subCategory,
      brand,
      description,
      monthlyRent,
      securityDeposit,
      rentalTenure,
      quantity,
    } = req.body;

    // ==========================================
    // UPDATE BASIC INFORMATION
    // ==========================================

    if (name !== undefined)
      product.name = name;

    if (category !== undefined)
      product.category = category;

    if (subCategory !== undefined)
      product.subCategory = subCategory;

    if (brand !== undefined)
      product.brand = brand;

    if (description !== undefined)
      product.description = description;

    // ==========================================
    // RENTAL INFORMATION
    // ==========================================

    if (monthlyRent !== undefined)
      product.monthlyRent =
        Number(monthlyRent);

    if (securityDeposit !== undefined)
      product.securityDeposit =
        Number(securityDeposit);

    if (quantity !== undefined)
      product.quantity =
        Number(quantity);

    if (rentalTenure !== undefined)
      product.rentalTenure =
        rentalTenure;

    // ==========================================
    // IMAGE UPDATE
    // ==========================================

    if (
      req.files &&
      req.files.length > 0
    ) {
      product.images =
        req.files.map(
          (file) =>
            `/uploads/products/${file.filename}`
        );
    }

    // ==========================================
    // AVAILABLE STATUS
    // ==========================================

    product.available =
      product.quantity > 0;

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

