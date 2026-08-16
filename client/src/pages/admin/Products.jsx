import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteProduct(id);

      alert(data.message);

      loadProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="admin-products-page">

      {/* Header */}
      <div className="admin-products-header">
        <div>
          <p className="admin-products-label">
            ADMIN PANEL
          </p>

          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  }}
>
  <h1>Manage Products</h1>

  <button
    onClick={() => navigate("/admin/products/add")}
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "10px",
      background:
        "linear-gradient(135deg, #625cff, #a14bce)",
      color: "white",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    + Add New Product
  </button>
</div>

          <p className="admin-products-subtitle">
            Add, edit and manage all rental products from one place.
          </p>
        </div>

        <div className="product-count">
          <span>{products.length}</span>
          <small>Products</small>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">📦</div>

          <h2>No Products Found</h2>

          <p>
            There are currently no products available.
          </p>
        </div>
      ) : (
        <div className="admin-products-grid">

          {products.map((product) => (
            <div
              className="admin-product-card"
              key={product._id}
            >

              {/* Image */}
              {product.images?.length > 0 && (
                <div className="admin-product-image-container">
                  <img
                    src={`http://localhost:8000${product.images[0]}`}
                    alt={product.name}
                    className="admin-product-image"
                  />

                  <div className="rent-badge">
                    RENT
                  </div>
                </div>
              )}

              {/* Product Information */}
              <div className="admin-product-content">

                <div className="product-category">
                  {product.category || "PRODUCT"}
                </div>

                <h2>{product.name}</h2>

                <p className="product-brand">
                  {product.brand}
                </p>

                <div className="product-price">
                  <span>
                    ₹{product.monthlyRent}
                  </span>

                  <small>
                    / month
                  </small>
                </div>

                {product.securityDeposit && (
                  <p className="security-deposit">
                    Security deposit: ₹
                    {product.securityDeposit}
                  </p>
                )}

                {/* Buttons */}
                <div className="admin-product-actions">

                  <button
                    className="edit-product-btn"
                    onClick={() =>
                      navigate(
                        `/admin/products/edit/${product._id}`
                      )
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-product-btn"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default AdminProducts;