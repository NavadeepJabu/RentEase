import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",
    monthlyRent: "",
    securityDeposit: "",
    quantity: "",
  });

  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      const product = data.product;

      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        description: product.description || "",
        monthlyRent:
          product.monthlyRent !== undefined
            ? product.monthlyRent
            : "",
        securityDeposit:
          product.securityDeposit !== undefined
            ? product.securityDeposit
            : "",
        quantity:
          product.quantity !== undefined
            ? product.quantity
            : "",
      });

      setCurrentImages(product.images || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert("You can select maximum 5 images.");
      return;
    }

    setNewImages(files);
  };

  const removeSelectedImage = (index) => {
    setNewImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append(
        "subCategory",
        formData.subCategory
      );
      data.append(
        "description",
        formData.description
      );
      data.append(
        "monthlyRent",
        formData.monthlyRent
      );
      data.append(
        "securityDeposit",
        formData.securityDeposit
      );
      data.append(
        "quantity",
        formData.quantity
      );

      newImages.forEach((file) => {
        data.append("images", file);
      });

      await API.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Updated Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-loading">
        <div className="edit-product-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="edit-product-page">

      <div className="edit-glow edit-glow-one"></div>
      <div className="edit-glow edit-glow-two"></div>

      <div className="edit-product-header">

        <div>
          <p className="edit-product-label">
            ADMIN PANEL
          </p>

          <h1>Edit Product</h1>

          <p>
            Update the product information and rental
            details.
          </p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          ← Back to Products
        </button>

      </div>

      <div className="edit-product-card">

        <div className="form-card-header">

          <div className="form-product-icon">
            ✏️
          </div>

          <div>
            <h2>Product Information</h2>

            <p>
              Update the details below and save your
              changes.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* BASIC INFORMATION */}

          <div className="form-section">

            <div className="form-section-title">
              <span>01</span>
              Basic Information
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Product Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sub Category</label>

                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  placeholder="Enter sub category"
                  required
                />
              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="form-section">

            <div className="form-section-title">
              <span>02</span>
              Description
            </div>

            <div className="form-group">

              <label>
                Product Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the product..."
                required
              />

            </div>

          </div>

          {/* RENTAL INFORMATION */}

          <div className="form-section">

            <div className="form-section-title">
              <span>03</span>
              Rental Information
            </div>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Monthly Rent (₹)
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    min="0"
                    placeholder="799"
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Security Deposit (₹)
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    type="number"
                    name="securityDeposit"
                    value={
                      formData.securityDeposit
                    }
                    onChange={handleChange}
                    min="0"
                    placeholder="3000"
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Available Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="10"
                  required
                />

              </div>

            </div>

          </div>

          {/* PRODUCT IMAGE */}

          <div className="form-section">

            <div className="form-section-title">
              <span>04</span>
              Product Image
            </div>

            {currentImages.length > 0 && (
              <div className="current-product-images">

                {currentImages.map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Product ${index + 1}`}
                    />
                  )
                )}

              </div>
            )}

            <div className="form-group">

              <label>
                Change Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <small className="image-help-text">
                Select up to 5 images. Selecting new
                images will replace the existing product
                images.
              </small>

            </div>

            {newImages.length > 0 && (
              <div className="selected-image-list">

                {newImages.map(
                  (file, index) => (
                    <div
                      className="selected-image-item"
                      key={`${file.name}-${index}`}
                    >

                      <span>
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedImage(index)
                        }
                      >
                        ✕
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* PREVIEW */}

          <div className="edit-preview">

            <div className="preview-icon">
              📦
            </div>

            <div>

              <span>PREVIEW</span>

              <h3>
                {formData.name ||
                  "Product Name"}
              </h3>

              <p>
                {formData.brand ||
                  "Brand"}{" "}
                ·{" "}
                {formData.category ||
                  "Category"}
              </p>

            </div>

            <div className="preview-price">

              <strong>
                ₹
                {formData.monthlyRent ||
                  "0"}
              </strong>

              <small>
                / month
              </small>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="edit-product-actions">

            <button
              type="button"
              className="cancel-edit-btn"
              onClick={() =>
                navigate("/admin/products")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-product-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  ✓ Save Changes
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;