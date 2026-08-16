import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    description: "",
    monthlyRent: "",
    securityDeposit: "",
    quantity: 1,
    rentalTenure: [3, 6, 12],
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTenureChange = (month) => {
    setFormData((previous) => {
      const exists = previous.rentalTenure.includes(month);

      return {
        ...previous,
        rentalTenure: exists
          ? previous.rentalTenure.filter(
              (item) => item !== month
            )
          : [...previous.rentalTenure, month].sort(
              (a, b) => a - b
            ),
      };
    });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not a supported image format.`
        );
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(
          `${file.name} is larger than 5MB.`
        );
        return false;
      }

      return true;
    });

    setImages((previous) => [
      ...previous,
      ...validFiles,
    ]);

    const newPreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((previous) => [
      ...previous,
      ...newPreviews,
    ]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);

    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setPreviews((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rentalTenure.length === 0) {
      alert("Please select at least one rental tenure.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("brand", formData.brand);
      data.append("description", formData.description);
      data.append(
        "monthlyRent",
        formData.monthlyRent
      );
      data.append(
        "securityDeposit",
        formData.securityDeposit
      );
      data.append("quantity", formData.quantity);

      formData.rentalTenure.forEach((month) => {
        data.append("rentalTenure", month);
      });

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await API.post(
        "/products",
        data
      );

      alert(
        response.data.message ||
          "Product added successfully"
      );

      navigate("/admin/products");
    } catch (error) {
      console.log(error);

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors?.length) {
        alert(
          validationErrors
            .map((item) => item.msg)
            .join("\n")
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to add product"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">

      <div className="add-product-container">

        {/* Header */}

        <div className="add-product-header">

          <div>
            <p className="add-product-label">
              ADMIN PANEL
            </p>

            <h1>
              Add New Product
            </h1>

            <p>
              Add a rental product to your RentEase
              marketplace.
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


        <form
          onSubmit={handleSubmit}
          className="add-product-form"
        >

          {/* Product Information */}

          <section className="product-section">

            <div className="section-heading">

              <div className="section-icon">
                🏷️
              </div>

              <div>
                <h2>
                  Product Information
                </h2>

                <p>
                  Basic information about the
                  product.
                </p>
              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: LG Washing Machine"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  placeholder="Example: LG"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Furniture">
                    Furniture
                  </option>

                  <option value="Appliance">
                    Appliance
                  </option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Sub Category
                </label>

                <input
                  type="text"
                  name="subCategory"
                  placeholder="Example: Washing Machine"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe the product..."
                value={formData.description}
                onChange={handleChange}
                required
              />

              <span className="field-hint">
                Minimum 10 characters
              </span>

            </div>

          </section>


          {/* Pricing */}

          <section className="product-section">

            <div className="section-heading">

              <div className="section-icon">
                💰
              </div>

              <div>
                <h2>
                  Pricing & Inventory
                </h2>

                <p>
                  Set rental pricing and
                  availability.
                </p>
              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Monthly Rent (₹)
                </label>

                <div className="price-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="monthlyRent"
                    min="1"
                    placeholder="799"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              <div className="form-group">

                <label>
                  Security Deposit (₹)
                </label>

                <div className="price-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="securityDeposit"
                    min="0"
                    placeholder="3000"
                    value={
                      formData.securityDeposit
                    }
                    onChange={handleChange}
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
                  min="1"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Rental Tenure */}

            <div className="form-group tenure-group">

              <label>
                Rental Tenure
              </label>

              <p className="field-hint">
                Select the rental durations
                available for customers.
              </p>

              <div className="tenure-options">

                {[3, 6, 12, 18, 24].map(
                  (month) => (
                    <label
                      key={month}
                      className={`tenure-option ${
                        formData.rentalTenure.includes(
                          month
                        )
                          ? "selected"
                          : ""
                      }`}
                    >

                      <input
                        type="checkbox"
                        checked={formData.rentalTenure.includes(
                          month
                        )}
                        onChange={() =>
                          handleTenureChange(
                            month
                          )
                        }
                      />

                      <span>
                        {month} Months
                      </span>

                    </label>
                  )
                )}

              </div>

            </div>

          </section>


          {/* Images */}

          <section className="product-section">

            <div className="section-heading">

              <div className="section-icon">
                🖼️
              </div>

              <div>
                <h2>
                  Product Images
                </h2>

                <p>
                  Upload up to 5 images.
                </p>
              </div>

            </div>


            <label className="image-upload-area">

              <div className="upload-icon">
                ☁️
              </div>

              <h3>
                Upload Product Images
              </h3>

              <p>
                Click here to choose images
              </p>

              <span>
                JPG, JPEG, PNG or WEBP · Max 5MB
                each
              </span>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
              />

            </label>


            {/* Image previews */}

            {previews.length > 0 && (
              <div className="image-preview-grid">

                {previews.map(
                  (preview, index) => (
                    <div
                      className="image-preview"
                      key={preview}
                    >

                      <img
                        src={preview}
                        alt={`Preview ${
                          index + 1
                        }`}
                      />

                      {index === 0 && (
                        <span className="primary-image">
                          Main Image
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        className="remove-image"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>
            )}

          </section>


          {/* Submit */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="add-product-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Adding Product...
                </>
              ) : (
                <>
                  Add Product
                  <span>→</span>
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;