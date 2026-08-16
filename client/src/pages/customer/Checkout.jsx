import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart } from "../../services/cartService";
import { placeOrder } from "../../services/orderService";

import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);

      const data = await getCart();

      setCart(data.cart || []);
    } catch (error) {
      console.error("Failed to load cart:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const getProductPrice = (item) => {
    return Number(
      item.product?.monthlyRent ||
        item.product?.rentPerMonth ||
        item.product?.price ||
        0
    );
  };

  const calculateItemRent = (item) => {
    const monthlyRent = getProductPrice(item);

    const months = Number(item.months || 1);

    const quantity = Number(item.quantity || 1);

    return monthlyRent * months * quantity;
  };

  const calculateSecurityDeposit = (item) => {
    const product = item.product;

    const deposit = Number(
      product?.securityDeposit ||
        product?.deposit ||
        0
    );

    const quantity = Number(item.quantity || 1);

    return deposit * quantity;
  };

  const totalRent = cart.reduce(
    (total, item) =>
      total + calculateItemRent(item),
    0
  );

  const totalSecurityDeposit = cart.reduce(
    (total, item) =>
      total + calculateSecurityDeposit(item),
    0
  );

  const grandTotal =
    totalRent + totalSecurityDeposit;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (!deliveryDate) {
      alert("Please select a delivery date.");
      return;
    }

    if (!deliverySlot) {
      alert("Please select a delivery time slot.");
      return;
    }

    try {
      setPlacingOrder(true);

      /*
       * IMPORTANT:
       * For now we send the complete cart to the backend.
       *
       * The backend will create one Order record
       * for each cart item while connecting them
       * through a common payment group.
       */

      const orderData = {
        items: cart.map((item) => ({
          product: item.product?._id,
          months: Number(item.months || 1),
          quantity: Number(item.quantity || 1),
        })),

        deliveryAddress:
          deliveryAddress.trim(),

        deliveryDate,

        deliverySlot,
      };

      console.log(
        "CHECKOUT ORDER DATA:",
        orderData
      );

      const response =
        await placeOrder(orderData);

      console.log(
        "PLACE ORDER RESPONSE:",
        response
      );

      /*
       * Backend will return the payment group
       * / order information.
       *
       * We'll connect Cashfree in the next step.
       */

      if (response?.success) {
        navigate("/orders");
      } else {
        alert(
          response?.message ||
            "Failed to place order"
        );
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">
          Loading checkout...
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add some rental products before
            continuing to checkout.
          </p>

          <button
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="checkout-header">

        <button
          className="checkout-back-btn"
          onClick={() => navigate("/cart")}
        >
          ← Back to Cart
        </button>

        <div>
          <p>RENTEASE</p>

          <h1>Checkout</h1>

          <span>
            Complete your rental details
          </span>
        </div>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <form
        className="checkout-layout"
        onSubmit={handlePlaceOrder}
      >

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="checkout-left">

          {/* DELIVERY INFORMATION */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                1
              </div>

              <div>
                <h2>
                  Delivery Information
                </h2>

                <p>
                  Where and when should we
                  deliver your rental?
                </p>
              </div>

            </div>


            {/* ADDRESS */}

            <div className="checkout-field">

              <label>
                Delivery Address
              </label>

              <textarea
                value={deliveryAddress}
                onChange={(e) =>
                  setDeliveryAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your complete delivery address"
                rows="4"
              />

            </div>


            {/* DATE */}

            <div className="checkout-two-columns">

              <div className="checkout-field">

                <label>
                  Delivery Date
                </label>

                <input
                  type="date"
                  value={deliveryDate}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(e) =>
                    setDeliveryDate(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* SLOT */}

              <div className="checkout-field">

                <label>
                  Delivery Time Slot
                </label>

                <select
                  value={deliverySlot}
                  onChange={(e) =>
                    setDeliverySlot(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select time slot
                  </option>

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

            </div>

          </section>


          {/* =========================
              CART PRODUCTS
          ========================= */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                2
              </div>

              <div>
                <h2>
                  Rental Products
                </h2>

                <p>
                  Review your selected
                  products
                </p>
              </div>

            </div>


            <div className="checkout-products">

              {cart.map((item) => {

                const product =
                  item.product;

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const months =
                  Number(
                    item.months || 1
                  );

                const monthlyRent =
                  getProductPrice(item);

                const itemRent =
                  calculateItemRent(
                    item
                  );

                const deposit =
                  calculateSecurityDeposit(
                    item
                  );

                return (
                  <div
                    className="checkout-product"
                    key={item._id}
                  >

                    <div className="checkout-product-image">

                      {product?.images?.[0] ? (
                        <img
                          src={
                            product.images[0]
                          }
                          alt={
                            product.name
                          }
                        />
                      ) : (
                        <span>
                          📦
                        </span>
                      )}

                    </div>


                    <div className="checkout-product-info">

                      <h3>
                        {product?.name ||
                          "Rental Product"}
                      </h3>

                      <p>
                        {product?.brand ||
                          ""}
                      </p>

                      <div className="checkout-product-meta">

                        <span>
                          ₹
                          {monthlyRent}
                          /month
                        </span>

                        <span>
                          {months}{" "}
                          month
                          {months > 1
                            ? "s"
                            : ""}
                        </span>

                        <span>
                          Qty: {quantity}
                        </span>

                      </div>

                    </div>


                    <div className="checkout-product-price">

                      <strong>
                        ₹
                        {itemRent.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <small>
                        + ₹
                        {deposit.toLocaleString(
                          "en-IN"
                        )} deposit
                      </small>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

        </div>


        {/* =========================
            RIGHT SIDE SUMMARY
        ========================= */}

        <aside className="checkout-right">

          <div className="checkout-summary">

            <div className="checkout-summary-header">

              <p>
                ORDER SUMMARY
              </p>

              <h2>
                Your Rental
              </h2>

            </div>


            <div className="checkout-summary-row">

              <span>
                Products
              </span>

              <strong>
                {cart.length}
              </strong>

            </div>


            <div className="checkout-summary-row">

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


            <div className="checkout-summary-divider" />


            <div className="checkout-summary-row">

              <span>
                Rental Charges
              </span>

              <strong>
                ₹
                {totalRent.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="checkout-summary-row">

              <span>
                Security Deposit
              </span>

              <strong>
                ₹
                {totalSecurityDeposit.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="checkout-summary-divider" />


            <div className="checkout-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {grandTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="checkout-security-note">

              <span>
                🔒
              </span>

              <p>
                Your payment will be
                securely processed through
                Cashfree.
              </p>

            </div>


            <button
              type="submit"
              className="checkout-place-btn"
              disabled={placingOrder}
            >

              {placingOrder
                ? "Creating Rental..."
                : "Place Rental Order"}

              {!placingOrder && (
                <span>→</span>
              )}

            </button>


            <button
              type="button"
              className="checkout-cancel-btn"
              onClick={() =>
                navigate("/cart")
              }
              disabled={placingOrder}
            >
              Back to Cart
            </button>

          </div>

        </aside>

      </form>

    </div>
  );
};

export default Checkout;