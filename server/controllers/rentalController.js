import Rental from "../models/Rental.js";
import Product from "../models/Product.js";

// Create Rental
export const createRental = async (req, res) => {
  try {
    const {
      product,
      startDate,
      endDate,
      months,
      deliveryAddress,
    } = req.body;

    const selectedProduct = await Product.findById(product);

    if (!selectedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const totalAmount =
      selectedProduct.monthlyRent * months +
      selectedProduct.securityDeposit;

    const rental = await Rental.create({
      customer: req.user.id,
      product,
      startDate,
      endDate,
      months,
      monthlyRent: selectedProduct.monthlyRent,
      securityDeposit: selectedProduct.securityDeposit,
      totalAmount,
      deliveryAddress,
    });

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      rental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      customer: req.user.id,
    }).populate("product");

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};