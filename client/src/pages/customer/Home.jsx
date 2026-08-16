import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  const categories = [
    {
      icon: "🏠",
      title: "Furniture",
      text: "Comfortable furniture for your home",
    },
    {
      icon: "💻",
      title: "Electronics",
      text: "Modern electronics without the high cost",
    },
    {
      icon: "📺",
      title: "Appliances",
      text: "Essential appliances available for rent",
    },
    {
      icon: "🛋️",
      title: "Home Essentials",
      text: "Everything you need for everyday living",
    },
  ];

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-orb hero-orb-one"></div>
        <div className="hero-orb hero-orb-two"></div>
        <div className="hero-orb hero-orb-three"></div>

        <div className="hero-content">

          <div className="hero-badge">
            ✨ Smart Renting Made Simple
          </div>

          <h1>
            Rent What You Need.
            <br />
            <span>Live Without Limits.</span>
          </h1>

          <p>
            Discover quality furniture, electronics and
            appliances without the commitment of buying.
          </p>

          <div className="hero-buttons">

            <Link
              to="/products"
              className="hero-primary-button"
            >
              Explore Products
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="hero-secondary-button"
            >
              How It Works
            </a>

          </div>

          <div className="hero-stats">

            <div>
              <strong>100+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>500+</strong>
              <span>Happy Customers</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>

          </div>

        </div>

        {/* Floating Product Visual */}

        <div className="hero-visual">

          <div className="floating-card card-one">
            <span>🏠</span>
            <div>
              <strong>Home Essentials</strong>
              <small>Ready to rent</small>
            </div>
          </div>

          <div className="hero-main-card">

            <div className="hero-card-glow"></div>

            <div className="hero-house-icon">
              🏡
            </div>

            <h3>Everything You Need</h3>

            <p>
              Delivered right to your doorstep.
            </p>

            <div className="hero-card-line"></div>

            <div className="hero-card-bottom">
              <span>Flexible Plans</span>
              <span>✓ Verified</span>
            </div>

          </div>

          <div className="floating-card card-two">
            <span>⚡</span>
            <div>
              <strong>Fast Delivery</strong>
              <small>At your doorstep</small>
            </div>
          </div>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="section categories-section">

        <div className="section-heading">
          <span>EXPLORE</span>
          <h2>Rent by Category</h2>
          <p>
            Find everything you need for your lifestyle,
            all in one place.
          </p>
        </div>

        <div className="category-grid">

          {categories.map((category, index) => (
            <Link
              to="/products"
              className="category-card"
              key={category.title}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <p>{category.text}</p>

              <span className="category-arrow">
                Explore →
              </span>

            </Link>
          ))}

        </div>

      </section>

      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="section featured-section">

        <div className="section-heading featured-heading">

          <div>
            <span>POPULAR PICKS</span>
            <h2>Featured Products</h2>
            <p>
              Quality products. Flexible rentals.
              No long-term commitment.
            </p>
          </div>

          <Link
            to="/products"
            className="view-all-button"
          >
            View All Products →
          </Link>

        </div>

        <div className="featured-grid">

          {products.slice(0, 4).map((product) => (

            <Link
              to={`/products/${product._id}`}
              className="featured-card"
              key={product._id}
            >

              <div className="featured-image">

                {product.images?.length > 0 && (
                  <img
                    src={`http://localhost:8000${product.images[0]}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {!product.images?.length && (
                  <div className="product-icon">
                    📦
                  </div>
                )}

                <span className="rent-badge">
                  RENT
                </span>

              </div>

              <div className="featured-info">

                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p>{product.brand}</p>

                <div className="product-price">
                  <strong>
                    ₹{product.monthlyRent}
                  </strong>

                  <span>/ month</span>
                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

      {/* ================= WHY RENTEASE ================= */}

      <section className="why-section">

        <div className="section-heading light-heading">

          <span>WHY RENTEASE?</span>

          <h2>
            Renting Made
            <br />
            <span>Simple & Stress-Free.</span>
          </h2>

          <p>
            We make renting easy, transparent and
            convenient from start to finish.
          </p>

        </div>

        <div className="benefits-grid">

          <div className="benefit-card">
            <div>💰</div>
            <h3>Save More</h3>
            <p>
              Get premium products without
              spending thousands upfront.
            </p>
          </div>

          <div className="benefit-card">
            <div>🔄</div>
            <h3>Stay Flexible</h3>
            <p>
              Choose rental periods that work
              for your lifestyle.
            </p>
          </div>

          <div className="benefit-card">
            <div>🚚</div>
            <h3>Easy Delivery</h3>
            <p>
              Get your rented products delivered
              directly to your doorstep.
            </p>
          </div>

          <div className="benefit-card">
            <div>🛡️</div>
            <h3>Trusted Service</h3>
            <p>
              Transparent pricing and reliable
              customer support.
            </p>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        className="section how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Rent in 3 Simple Steps
          </h2>

          <p>
            Getting what you need has never
            been easier.
          </p>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🔎
            </div>

            <h3>Choose a Product</h3>

            <p>
              Browse our collection and find
              something that fits your needs.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🛒
            </div>

            <h3>Place Your Order</h3>

            <p>
              Select your rental duration and
              complete your order.
            </p>

          </div>

          <div className="step-line"></div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              🚚
            </div>

            <h3>Enjoy Your Rental</h3>

            <p>
              Sit back and enjoy your product
              delivered to your doorstep.
            </p>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta-section">

        <div className="cta-glow"></div>

        <div className="cta-content">

          <span>READY TO GET STARTED?</span>

          <h2>
            Your Next Rental
            <br />
            Is Just a Click Away.
          </h2>

          <p>
            Explore our collection and find
            something you'll love.
          </p>

          <Link
            to="/products"
            className="cta-button"
          >
            Start Renting →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;