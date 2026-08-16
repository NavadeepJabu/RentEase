import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import "./Products.css";
import { getImageUrl } from "../../utils/imageUrl";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const categoryList = products
      .map((product) => product.category)
      .filter(Boolean);

    return ["All", ...new Set(categoryList)];
  }, [products]);

  // Search + category filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        product.brand
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Finding the best rentals for you...</p>
      </div>
    );
  }

  return (
    <div className="products-page">

      {/* HERO */}
      <section className="products-hero">
        <div className="products-hero-glow glow-one"></div>
        <div className="products-hero-glow glow-two"></div>

        <div className="products-hero-content">
          <span className="products-badge">
            ✨ EXPLORE OUR COLLECTION
          </span>

          <h1>
            Find Something
            <span> You'll Love.</span>
          </h1>

          <p>
            Discover quality products at flexible rental prices.
            Rent what you need without the long-term commitment.
          </p>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section className="products-controls">

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products or brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

      </section>

      {/* PRODUCTS */}
      <section className="products-section">

        <div className="products-heading">
          <div>
            <span>OUR COLLECTION</span>
            <h2>Browse Products</h2>
          </div>

          <p>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}{" "}
            available
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>

            <h3>No products found</h3>

            <p>
              Try searching for something else or choose another category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">

            {filteredProducts.map((product, index) => (
              <div
                className="product-card"
                key={product._id}
                style={{
                  animationDelay: `${index * 0.08}s`,
                }}
              >

                {/* IMAGE */}
                <div className="product-image-container">

                  {product.images?.length > 0 ? (
                    <img
  src={getImageUrl(product.images[0])}
  alt={product.name}
  onError={(e) => {
    e.currentTarget.style.display = "none";
  }}
/>
                  ) : null}

                  <span className="rent-badge">
                    RENT
                  </span>

                </div>

                {/* DETAILS */}
                <div className="product-details">

                  <span className="product-category">
                    {product.category || "GENERAL"}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="product-brand">
                    {product.brand}
                  </p>

                  <div className="product-bottom">

                    <div className="price">
                      <strong>
                        ₹{product.monthlyRent}
                      </strong>
                      <span>/ month</span>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="view-product"
                    >
                      View
                      <span>→</span>
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* BOTTOM CTA */}
      <section className="products-cta">

        <div>
          <span>READY TO RENT?</span>

          <h2>
            Your Next Find
            <br />
            Is Just a Click Away.
          </h2>

          <p>
            Flexible rentals. Quality products. Zero stress.
          </p>

          <Link to="/products" className="cta-button">
            Explore Collection →
          </Link>
        </div>

      </section>

    </div>
  );
}

export default Products;