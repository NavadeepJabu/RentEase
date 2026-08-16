import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";


const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });
};


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
    console.log("FILES:", req.files?.length || 0);

    // ==========================================
    // UPLOAD PRODUCT IMAGES TO CLOUDINARY
    // ==========================================

    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "rentease/products"
        );

        images.push(result.secure_url);
      }
    }

    // ==========================================
    // CREATE PRODUCT
    // ==========================================

    const product = await Product.create({
      name,
      category,
      subCategory,
      brand,
      description,
      monthlyRent,
      securityDeposit,
      rentalTenure,
      quantity,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==========================================
    // UPDATE BASIC PRODUCT INFORMATION
    // ==========================================

    const {
      name,
      category,
      subCategory,
      brand,
      description,
      monthlyRent,
      securityDeposit,
      quantity,
      rentalTenure,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) {
      product.subCategory = subCategory;
    }
    if (brand !== undefined) product.brand = brand;
    if (description !== undefined) {
      product.description = description;
    }
    if (monthlyRent !== undefined) {
      product.monthlyRent = monthlyRent;
    }
    if (securityDeposit !== undefined) {
      product.securityDeposit = securityDeposit;
    }
    if (quantity !== undefined) {
      product.quantity = quantity;
    }
    if (rentalTenure !== undefined) {
      product.rentalTenure = rentalTenure;
    }

    // ==========================================
    // UPDATE PRODUCT IMAGES
    // ==========================================

    if (req.files && req.files.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "rentease/products"
        );

        newImages.push(result.secure_url);
      }

      // Replace existing images
      product.images = newImages;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

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

