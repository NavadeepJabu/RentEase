import { useEffect, useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import {
  useParams,
} from "react-router-dom";

import { getProductById } from "../../services/productService";

import {
  addToCart,
  getCart,
  removeFromCart,
} from "../../services/cartService";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import { placeOrder } from "../../services/orderService";

import {
  checkServiceAvailability,
} from "../../services/serviceAreaService";

import "./ProductDetails.css";

// ==========================================
// GET TOMORROW'S DATE
// ==========================================

const getTomorrowDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() + 1
  );

  return date.toISOString().split("T")[0];
};

// ==========================================
// PRODUCT DETAILS
// ==========================================

function ProductDetails() {

  const { id } = useParams();

  // ==========================================
  // PRODUCT
  // ==========================================

  const [product, setProduct] =
    useState(null);

  // ==========================================
  // RENTAL
  // ==========================================

  const [months, setMonths] =
    useState(3);

  const [quantity, setQuantity] =
    useState(1);

  // ==========================================
  // DELIVERY
  // ==========================================

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [deliveryDate, setDeliveryDate] =
    useState(getTomorrowDate());

  const [deliverySlot, setDeliverySlot] =
    useState(
      "9:00 AM - 12:00 PM"
    );

  // ==========================================
  // SERVICE AREA
  // ==========================================

  const [serviceChecking, setServiceChecking] =
    useState(false);

  const [serviceAvailable, setServiceAvailable] =
    useState(false);

  const [serviceArea, setServiceArea] =
    useState(null);

  const [serviceMessage, setServiceMessage] =
    useState("");

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [ordering, setOrdering] =
    useState(false);

  // ==========================================
  // CART
  // ==========================================

  const [isInCart, setIsInCart] =
    useState(false);

  const [cartItemId, setCartItemId] =
    useState(null);

  const [cartLoading, setCartLoading] =
    useState(false);

  // ==========================================
  // WISHLIST
  // ==========================================

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [wishlistItemId, setWishlistItemId] =
    useState(null);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    loadProduct();
  }, [id]);

  // ==========================================
  // LOAD CART STATUS
  // ==========================================

  useEffect(() => {
    loadCartStatus();
  }, [id]);

  // ==========================================
  // LOAD WISHLIST STATUS
  // ==========================================

  useEffect(() => {
    loadWishlistStatus();
  }, [id]);

  // ==========================================
  // GET PRODUCT
  // ==========================================

  const loadProduct = async () => {

    try {

      setLoading(true);

      const data =
        await getProductById(id);

      setProduct(data.product);

      // If backend gives rental tenure,
      // select first available option

      if (
        data.product.rentalTenure &&
        data.product.rentalTenure.length > 0
      ) {

        setMonths(
          Number(
            data.product.rentalTenure[0]
          )
        );

      }

      setQuantity(1);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // LOAD CART STATUS
  // ==========================================

  const loadCartStatus = async () => {

    try {

      const token =
        localStorage.getItem("token");

      // Customer not logged in

      if (!token) {

        setIsInCart(false);

        setCartItemId(null);

        return;
      }

      const data =
        await getCart();

      const cart =
        data.cart || [];

      // Find current product in cart

      const existingItem =
        cart.find(
          (item) =>
            item.product?._id?.toString() ===
            id?.toString()
        );

      if (existingItem) {

        setIsInCart(true);

        setCartItemId(
          existingItem._id
        );

      } else {

        setIsInCart(false);

        setCartItemId(null);

      }

    } catch (error) {

      console.log(
        "Unable to load cart status:",
        error
      );

      setIsInCart(false);

      setCartItemId(null);
    }
  };

  // ==========================================
  // CART TOGGLE
  // ==========================================

  const handleCartToggle = async () => {

    if (cartLoading) {
      return;
    }

    // ========================================
    // CHECK LOGIN
    // ========================================

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Please login to manage your cart."
      );

      return;
    }

    try {

      setCartLoading(true);

      // ======================================
      // REMOVE FROM CART
      // ======================================

      if (
        isInCart &&
        cartItemId
      ) {

        const data =
          await removeFromCart(
            cartItemId
          );

        // Update UI immediately

        setIsInCart(false);

        setCartItemId(null);

        alert(
          data.message ||
            "Product removed from cart"
        );

        return;
      }

      // ======================================
      // ADD TO CART
      // ======================================

      const data =
        await addToCart(
          product._id
        );

      // Backend returns created cart item

      if (data.cartItem?._id) {

        setCartItemId(
          data.cartItem._id
        );

      } else {

        // If backend doesn't return
        // cart item ID, reload cart

        await loadCartStatus();

      }

      setIsInCart(true);

      alert(
        data.message ||
          "Product added to cart"
      );

    } catch (error) {

      console.log(
        "CART ERROR:",
        error
      );

      // If product was already in cart,
      // reload actual cart state

      if (
        error.response?.data?.message ===
        "Product already in cart"
      ) {

        await loadCartStatus();

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update cart"
      );

    } finally {

      setCartLoading(false);

    }
  };

  // ==========================================
  // CHECK WHETHER PRODUCT IS WISHLISTED
  // ==========================================

  const loadWishlistStatus = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        setIsWishlisted(false);

        setWishlistItemId(null);

        return;
      }

      const data =
        await getWishlist();

      const wishlist =
        data.wishlist || [];

      const existingItem =
        wishlist.find(
          (item) =>
            item.product?._id?.toString() ===
            id?.toString()
        );

      if (existingItem) {

        setIsWishlisted(true);

        setWishlistItemId(
          existingItem._id
        );

      } else {

        setIsWishlisted(false);

        setWishlistItemId(null);

      }

    } catch (error) {

      console.log(
        "Unable to load wishlist status:",
        error
      );

      setIsWishlisted(false);

      setWishlistItemId(null);
    }
  };

  // ==========================================
  // CHECK SERVICE AVAILABILITY
  // ==========================================

  const handleCheckAvailability =
    async () => {

      const cleanPincode =
        pincode.trim();

      if (!cleanPincode) {

        setServiceAvailable(false);

        setServiceArea(null);

        setServiceMessage(
          "Please enter your PIN code."
        );

        return;
      }

      // Basic Indian PIN validation

      if (
        !/^[1-9][0-9]{5}$/.test(
          cleanPincode
        )
      ) {

        setServiceAvailable(false);

        setServiceArea(null);

        setServiceMessage(
          "Please enter a valid 6-digit PIN code."
        );

        return;
      }

      try {

        setServiceChecking(true);

        setServiceAvailable(false);

        setServiceArea(null);

        setServiceMessage("");

        const data =
          await checkServiceAvailability(
            cleanPincode
          );

        if (data.available) {

          setServiceAvailable(true);

          setServiceArea(
            data.serviceArea || null
          );

          setServiceMessage(
            data.message ||
              "Great! We deliver to your location."
          );

        } else {

          setServiceAvailable(false);

          setServiceArea(null);

          setServiceMessage(
            data.message ||
              "Sorry, delivery is currently unavailable in this pincode."
          );

        }

      } catch (error) {

        console.log(error);

        setServiceAvailable(false);

        setServiceArea(null);

        setServiceMessage(
          error.response?.data?.message ||
            "Unable to check service availability. Please try again."
        );

      } finally {

        setServiceChecking(false);

      }
    };

  // ==========================================
  // PIN CODE CHANGE
  // ==========================================

  const handlePincodeChange = (e) => {

    const value =
      e.target.value;

    setPincode(value);

    setServiceAvailable(false);

    setServiceArea(null);

    setServiceMessage("");
  };

  // ==========================================
  // WISHLIST TOGGLE
  // ==========================================

  const handleWishlist = async () => {

    if (wishlistLoading) {
      return;
    }

    // ========================================
    // CHECK LOGIN
    // ========================================

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Please login to manage your wishlist."
      );

      return;
    }

    try {

      setWishlistLoading(true);

      // ======================================
      // REMOVE FROM WISHLIST
      // ======================================

      if (
        isWishlisted &&
        wishlistItemId
      ) {

        const data =
          await removeFromWishlist(
            wishlistItemId
          );

        setIsWishlisted(false);

        setWishlistItemId(null);

        alert(
          data.message ||
            "Product removed from wishlist"
        );

        return;
      }

      // ======================================
      // ADD TO WISHLIST
      // ======================================

      const data =
        await addToWishlist(
          product._id
        );

      if (data.wishlist?._id) {

        setWishlistItemId(
          data.wishlist._id
        );

      } else {

        await loadWishlistStatus();

      }

      setIsWishlisted(true);

      alert(
        data.message ||
          "Product added to wishlist"
      );

    } catch (error) {

      console.log(
        "WISHLIST ERROR:",
        error
      );

      if (
        error.response?.data?.message ===
        "Product already in wishlist"
      ) {

        await loadWishlistStatus();

        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update wishlist"
      );

    } finally {

      setWishlistLoading(false);

    }
  };

  // ==========================================
  // RENT NOW
  // ==========================================

  const handleRentNow = async () => {

    if (!deliveryAddress.trim()) {

      return alert(
        "Please enter your delivery address."
      );
    }

    if (!pincode.trim()) {

      return alert(
        "Please enter your delivery PIN code."
      );
    }

    if (!serviceAvailable) {

      return alert(
        "Please check delivery availability for your PIN code before placing the rental."
      );
    }

    if (!deliveryDate) {

      return alert(
        "Please select a delivery date."
      );
    }

    if (!deliverySlot) {

      return alert(
        "Please select a delivery time slot."
      );
    }

    if (
      quantity < 1 ||
      quantity > product.quantity
    ) {

      return alert(
        "Please select a valid quantity."
      );
    }

    try {

      setOrdering(true);

      const data =
        await placeOrder({

          product:
            product._id,

          months,

          quantity,

          deliveryAddress,

          pincode:
            pincode.trim(),

          deliveryDate,

          deliverySlot,

        });

      alert(
        data.message
      );

      setDeliveryAddress("");

      setPincode("");

      setServiceAvailable(false);

      setServiceArea(null);

      setServiceMessage("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );

    } finally {

      setOrdering(false);

    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="product-details-loading">

        <div className="product-details-spinner"></div>

        <p>
          Loading product...
        </p>

      </div>

    );
  }

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {

    return (

      <div className="product-not-found">

        <div>
          📦
        </div>

        <h2>
          Product Not Found
        </h2>

        <p>
          The product you're looking for is unavailable.
        </p>

      </div>

    );
  }

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const productImage =
  product.images?.length > 0
    ? getImageUrl(product.images[0])
    : null;

  // ==========================================
  // RENT CALCULATIONS
  // ==========================================

  const totalRent =
    Number(product.monthlyRent) *
    Number(months) *
    Number(quantity);

  const totalWithDeposit =
    totalRent +
    Number(product.securityDeposit) *
      Number(quantity);

  // ==========================================
  // RETURN UI
  // ==========================================

  return (

    <div className="product-details-page">

      {/* Background decoration */}

      <div className="details-glow details-glow-one"></div>

      <div className="details-glow details-glow-two"></div>

      <div className="product-details-container">

        {/* ==========================================
            PRODUCT IMAGE
        ========================================== */}

        <div className="product-details-image-section">

          <div className="product-details-image-card">

            {productImage ? (

              <img
                src={productImage}
                alt={product.name}
                className="product-details-image"
              />

            ) : (

              <div className="product-image-empty">

                <span>
                  📦
                </span>

              </div>

            )}

            <div className="availability-badge">

              <span></span>

              Available for Rent

            </div>

          </div>

        </div>

        {/* ==========================================
            PRODUCT INFORMATION
        ========================================== */}

        <div className="product-details-info">

          <p className="details-category">

            {product.category ||
              "PRODUCT"}

          </p>

          <h1>
            {product.name}
          </h1>

          <p className="details-brand">

            {product.brand}

          </p>

          <div className="details-rating">

            <span>
              ★★★★★
            </span>

            <small>
              Premium rental product
            </small>

          </div>

          <div className="details-price">

            <strong>
              ₹{product.monthlyRent}
            </strong>

            <span>
              / month
            </span>

          </div>

          <p className="details-description">

            {product.description}

          </p>

          {/* ==========================================
              PRODUCT INFORMATION
          ========================================== */}

          <div className="product-info-grid">

            <div className="product-info-item">

              <span>
                Security Deposit
              </span>

              <strong>
                ₹{product.securityDeposit}
              </strong>

            </div>

            <div className="product-info-item">

              <span>
                Available Quantity
              </span>

              <strong>
                {product.quantity}
              </strong>

            </div>

            <div className="product-info-item">

              <span>
                Category
              </span>

              <strong>
                {product.category}
              </strong>

            </div>

            <div className="product-info-item">

              <span>
                Sub Category
              </span>

              <strong>
                {product.subCategory}
              </strong>

            </div>

          </div>

          {/* ==========================================
              ACTIONS
          ========================================== */}

          <div className="product-actions">

            {/* ========================================
                CART BUTTON
            ======================================== */}

            <button
              className={`add-cart-btn ${
                isInCart
                  ? "added-to-cart"
                  : ""
              }`}
              onClick={handleCartToggle}
              disabled={cartLoading}
            >

              {cartLoading ? (

                "Updating..."

              ) : isInCart ? (

                <>
                  ✓ Added to Cart
                </>

              ) : (

                <>
                  🛒 Add to Cart
                </>

              )}

            </button>

            {/* ========================================
                WISHLIST BUTTON
            ======================================== */}

            <button
              className={`wishlist-btn ${
                isWishlisted
                  ? "active"
                  : ""
              }`}
              onClick={handleWishlist}
              disabled={wishlistLoading}
            >

              {wishlistLoading ? (

                "Updating..."

              ) : isWishlisted ? (

                <>
                  <span className="wishlist-heart-icon">
                    ♥
                  </span>

                  Wishlisted
                </>

              ) : (

                <>
                  <span className="wishlist-heart-icon">
                    ♡
                  </span>

                  Wishlist
                </>

              )}

            </button>

          </div>

          {/* ==========================================
              RENTAL SECTION
          ========================================== */}

          <div className="rental-section">

            <div className="rental-section-header">

              <div>

                <p>
                  RENTAL DETAILS
                </p>

                <h2>
                  Customize your rental
                </h2>

              </div>

              <span>
                🔑
              </span>

            </div>

            {/* ==========================================
                RENTAL DURATION
            ========================================== */}

            <div className="rental-field">

              <label>
                Rental Duration
              </label>

              <select
                value={months}
                onChange={(e) =>
                  setMonths(
                    Number(
                      e.target.value
                    )
                  )
                }
              >

                {product.rentalTenure?.map(
                  (month) => (

                    <option
                      key={month}
                      value={month}
                    >
                      {month} Months
                    </option>

                  )
                )}

              </select>

            </div>

            {/* ==========================================
                QUANTITY
            ========================================== */}

            <div className="rental-field">

              <label>
                Quantity
              </label>

              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(
                        1,
                        quantity - 1
                      )
                    )
                  }
                >
                  −
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.quantity,
                        quantity + 1
                      )
                    )
                  }
                >
                  +
                </button>

              </div>

            </div>

            {/* ==========================================
                DELIVERY ADDRESS
            ========================================== */}

            <div className="rental-field">

              <label>
                Delivery Address
              </label>

              <textarea
                rows="4"
                value={deliveryAddress}
                onChange={(e) =>
                  setDeliveryAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your complete delivery address"
              />

            </div>

            {/* ==========================================
                PIN CODE
            ========================================== */}

            <div className="rental-field">

              <label>
                📍 Delivery PIN Code
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "stretch",
                }}
              >

                <input
                  type="text"
                  value={pincode}
                  onChange={
                    handlePincodeChange
                  }
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter 6-digit PIN code"
                  style={{
                    flex: 1,
                  }}
                />

                <button
                  type="button"
                  onClick={
                    handleCheckAvailability
                  }
                  disabled={
                    serviceChecking
                  }
                  style={{
                    border: "none",
                    borderRadius: "12px",
                    padding: "0 18px",
                    background:
                      "linear-gradient(135deg, #625cff, #e85baa)",
                    color: "#fff",
                    fontWeight: "700",
                    cursor:
                      serviceChecking
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      serviceChecking
                        ? 0.7
                        : 1,
                    whiteSpace:
                      "nowrap",
                  }}
                >

                  {serviceChecking
                    ? "Checking..."
                    : "Check Availability"}

                </button>

              </div>

              {/* Service result */}

              {serviceMessage && (

                <div
                  style={{
                    marginTop: "12px",
                    padding: "13px 15px",
                    borderRadius: "12px",
                    background:
                      serviceAvailable
                        ? "#eafaf1"
                        : "#fff1f2",
                    border:
                      serviceAvailable
                        ? "1px solid #bbebd0"
                        : "1px solid #fecdd3",
                    color:
                      serviceAvailable
                        ? "#16834d"
                        : "#be123c",
                    fontSize: "13px",
                    fontWeight: "600",
                    lineHeight: "1.5",
                  }}
                >

                  {serviceAvailable
                    ? "✓ "
                    : "✕ "}

                  {serviceMessage}

                  {serviceAvailable &&
                    serviceArea && (

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >

                        📍{" "}
                        {serviceArea.area},{" "}
                        {serviceArea.city}

                      </div>

                    )}

                </div>

              )}

            </div>

            {/* ==========================================
                DELIVERY DATE
            ========================================== */}

            <div className="rental-field">

              <label>
                📅 Delivery Date
              </label>

              <input
                type="date"
                value={deliveryDate}
                min={getTomorrowDate()}
                onChange={(e) =>
                  setDeliveryDate(
                    e.target.value
                  )
                }
              />

              <small
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: "#64748b",
                }}
              >
                Select when you would like your
                rental delivered.
              </small>

            </div>

            {/* ==========================================
                DELIVERY SLOT
            ========================================== */}

            <div className="rental-field">

              <label>
                🕐 Delivery Time Slot
              </label>

              <select
                value={deliverySlot}
                onChange={(e) =>
                  setDeliverySlot(
                    e.target.value
                  )
                }
              >

                <option value="9:00 AM - 12:00 PM">
                  9:00 AM - 12:00 PM
                </option>

                <option value="12:00 PM - 3:00 PM">
                  12:00 PM - 3:00 PM
                </option>

                <option value="3:00 PM - 6:00 PM">
                  3:00 PM - 6:00 PM
                </option>

                <option value="6:00 PM - 9:00 PM">
                  6:00 PM - 9:00 PM
                </option>

              </select>

            </div>

            {/* ==========================================
                DELIVERY SUMMARY
            ========================================== */}

            <div
              className="delivery-summary"
              style={{
                marginTop: "20px",
                padding: "16px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #eef2ff, #fdf2f8)",
                border:
                  "1px solid rgba(99,102,241,0.12)",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                  marginBottom: "8px",
                }}
              >

                <span>
                  📅 Delivery Date
                </span>

                <strong>

                  {deliveryDate
                    ? new Date(
                        `${deliveryDate}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Not selected"}

                </strong>

              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "15px",
                }}
              >

                <span>
                  🕐 Time Slot
                </span>

                <strong>
                  {deliverySlot}
                </strong>

              </div>

            </div>

            {/* ==========================================
                RENTAL SUMMARY
            ========================================== */}

            <div className="rental-summary">

              <div>

                <span>
                  Rental
                </span>

                <strong>
                  ₹{totalRent}
                </strong>

              </div>

              <div>

                <span>
                  Security Deposit
                </span>

                <strong>
                  ₹
                  {Number(
                    product.securityDeposit
                  ) *
                    Number(quantity)}
                </strong>

              </div>

              <div className="summary-total">

                <span>
                  Estimated Total
                </span>

                <strong>
                  ₹{totalWithDeposit}
                </strong>

              </div>

            </div>

            {/* ==========================================
                RENT BUTTON
            ========================================== */}

            <button
              className="rent-now-btn"
              onClick={handleRentNow}
              disabled={
                ordering ||
                serviceChecking ||
                !serviceAvailable
              }
              style={{
                opacity:
                  ordering ||
                  serviceChecking ||
                  !serviceAvailable
                    ? 0.6
                    : 1,

                cursor:
                  ordering ||
                  serviceChecking ||
                  !serviceAvailable
                    ? "not-allowed"
                    : "pointer",
              }}
            >

              {ordering
                ? "Placing Order..."
                : serviceChecking
                ? "Checking Service..."
                : !serviceAvailable
                ? "Check Delivery Availability"
                : "Rent Now"}

              {!ordering &&
                serviceAvailable && (

                  <span>
                    →
                  </span>

                )}

            </button>

            {!serviceAvailable && (

              <p
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Please verify your delivery PIN code
                before renting.
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;