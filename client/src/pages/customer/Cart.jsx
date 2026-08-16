import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  removeFromCart,
} from "../../services/cartService";

import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  // =====================================================
  // LOAD CART
  // =====================================================

  const loadCart = async () => {
    try {
      const data = await getCart();

      setCart(data.cart || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const handleRemove = async (id) => {
    try {
      const data = await removeFromCart(id);

      alert(data.message);

      loadCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  // =====================================================
  // GO TO PRODUCT DETAILS
  // =====================================================

  const handleProductClick = (productId) => {
    if (!productId) {
      alert("Product details are not available");
      return;
    }

    navigate(`/products/${productId}`);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="cart-spinner"></div>

        <p>
          Loading your cart...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="cart-page">

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="cart-glow cart-glow-one"></div>

      <div className="cart-glow cart-glow-two"></div>

      <div className="cart-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="cart-header">

          <div>

            <p className="cart-label">
              RENT EASE
            </p>

            <h1>
              My Cart
            </h1>

            <p>
              Review the products you've
              selected for rental.
            </p>

          </div>

          <div className="cart-count">

            <span>
              🛒
            </span>

            <strong>
              {cart.length}
            </strong>

            <small>
              {cart.length === 1
                ? "Item"
                : "Items"}
            </small>

          </div>

        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cart.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Explore Products →
            </button>

          </div>

        ) : (

          <div className="cart-content">

            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div className="cart-items">

              {cart.map((item) => {

                const productId =
                  item.product?._id;

                const productImage =
                  item.product?.images?.length > 0
                    ? `http://localhost:8000${item.product.images[0]}`
                    : null;

                const itemTotal =
                  Number(
                    item.product?.monthlyRent || 0
                  ) *
                  Number(item.months || 0) *
                  Number(item.quantity || 1);

                return (

                  <div
                    className="cart-item"
                    key={item._id}
                  >

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div
                      className="cart-product-image"
                      onClick={() =>
                        handleProductClick(productId)
                      }
                      title="View product details"
                      style={{
                        cursor: productId
                          ? "pointer"
                          : "default",
                      }}
                    >

                      {productImage ? (

                        <img
                          src={productImage}
                          alt={
                            item.product?.name ||
                            "Product"
                          }
                        />

                      ) : (

                        <span>
                          📦
                        </span>

                      )}

                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="cart-product-info">

                      <p className="cart-product-category">

                        {item.product?.category ||
                          "RENTAL PRODUCT"}

                      </p>

                      {/* CLICKABLE PRODUCT NAME */}

                      <h2
                        onClick={() =>
                          handleProductClick(productId)
                        }
                        title="View product details"
                        style={{
                          cursor: productId
                            ? "pointer"
                            : "default",
                        }}
                      >

                        {item.product?.name ||
                          "Product unavailable"}

                      </h2>

                      <p className="cart-brand">

                        {item.product?.brand ||
                          "Brand unavailable"}

                      </p>

                      <div className="cart-details">

                        {/* Monthly Rent */}

                        <div>

                          <span>
                            Monthly Rent
                          </span>

                          <strong>
                            ₹
                            {item.product
                              ?.monthlyRent || 0}
                          </strong>

                        </div>

                        {/* Duration */}

                        <div>

                          <span>
                            Duration
                          </span>

                          <strong>

                            {item.months}
                            {" "}
                            Months

                          </strong>

                        </div>

                        {/* Quantity */}

                        <div>

                          <span>
                            Quantity
                          </span>

                          <strong>
                            {item.quantity}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="cart-item-right">

                      <div className="cart-item-total">

                        <small>
                          Estimated Rent
                        </small>

                        <strong>
                          ₹
                          {itemTotal}
                        </strong>

                      </div>

                      <button
                        className="remove-cart-btn"
                        onClick={() =>
                          handleRemove(item._id)
                        }
                      >
                        🗑 Remove
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <div className="cart-summary">

              <div className="summary-top">

                <p>
                  ORDER SUMMARY
                </p>

                <h2>
                  Your Rental
                </h2>

              </div>

              {/* Products */}

              <div className="summary-row">

                <span>
                  Products
                </span>

                <strong>
                  {cart.length}
                </strong>

              </div>

              {/* Rental Items */}

              <div className="summary-row">

                <span>
                  Rental items
                </span>

                <strong>

                  {cart.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.quantity || 1
                      ),
                    0
                  )}

                </strong>

              </div>

              {/* Summary Note */}

              <div className="summary-note">

                <span>
                  🔒
                </span>

                <p>
                  Final rental amount and
                  security deposit will be
                  calculated when you place
                  your order.
                </p>

              </div>

              {/* =================================================
                  CONTINUE TO RENTAL
              ================================================= */}

              <button
                className="checkout-btn"
                onClick={() =>
                  navigate("/checkout")
                }
              >

                Continue to Rental

                <span>
                  →
                </span>

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;