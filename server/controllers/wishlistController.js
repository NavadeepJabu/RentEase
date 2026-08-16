import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("product");

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: req.user.id,
      product,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      product,
    });

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    if (wishlistItem.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await wishlistItem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};