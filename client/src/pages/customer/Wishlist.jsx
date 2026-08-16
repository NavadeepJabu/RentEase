import { useEffect, useState } from "react";
import {
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const data = await removeFromWishlist(id);

      alert(data.message);

      loadWishlist();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to remove"
      );
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="wishlist-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <div className="wishlist-glow wishlist-glow-one"></div>
      <div className="wishlist-glow wishlist-glow-two"></div>

      <div className="wishlist-container">

        {/* Header */}
        <div className="wishlist-header">

          <div>
            <p className="wishlist-label">
              RENT EASE
            </p>

            <h1>My Wishlist ❤️</h1>

            <p>
              Your favourite rental products,
              all in one place.
            </p>
          </div>

          <div className="wishlist-count">
            <span>♥</span>
            <strong>{wishlist.length}</strong>
            <small>
              {wishlist.length === 1
                ? "Item"
                : "Items"}
            </small>
          </div>

        </div>


        {wishlist.length === 0 ? (

          /* Empty Wishlist */
          <div className="empty-wishlist">

            <div className="empty-wishlist-icon">
              ♡
            </div>

            <h2>Your wishlist is empty</h2>

            <p>
              Save products you love and
              find them here later.
            </p>

            <button
              onClick={() =>
                (window.location.href =
                  "/products")
              }
            >
              Explore Products →
            </button>

          </div>

        ) : (

          <div className="wishlist-grid">

            {wishlist.map((item) => {

              const product = item.product;

              const productImage =
                product?.images?.length > 0
                  ? `http://localhost:8000${product.images[0]}`
                  : null;

              return (
                <div
                  className="wishlist-card"
                  key={item._id}
                >

                  {/* Image */}
                  <div className="wishlist-image">

                    {productImage ? (
                      <img
                        src={productImage}
                        alt={
                          product?.name ||
                          "Product"
                        }
                      />
                    ) : (
                      <span>📦</span>
                    )}

                    <div className="wishlist-heart">
                      ♥
                    </div>

                  </div>


                  {/* Information */}
                  <div className="wishlist-info">

                    <p className="wishlist-category">
                      {product?.category ||
                        "RENTAL PRODUCT"}
                    </p>

                    <h2>
                      {product?.name ||
                        "Product unavailable"}
                    </h2>

                    <p className="wishlist-brand">
                      {product?.brand ||
                        "Brand unavailable"}
                    </p>


                    <div className="wishlist-price">
                      <strong>
                        ₹
                        {product?.monthlyRent ||
                          0}
                      </strong>

                      <span>
                        / month
                      </span>
                    </div>


                    <div className="wishlist-actions">

                      <button
                        className="wishlist-view-btn"
                        onClick={() =>
                          (window.location.href =
                            `/products/${product?._id}`)
                        }
                      >
                        View Product →
                      </button>

                      <button
                        className="wishlist-remove-btn"
                        onClick={() =>
                          handleRemove(item._id)
                        }
                        title="Remove from wishlist"
                      >
                        🗑
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Wishlist;