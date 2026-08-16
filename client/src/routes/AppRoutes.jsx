import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Customer Pages
import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Wishlist from "../pages/customer/Wishlist";
import Orders from "../pages/customer/Orders";
import Profile from "../pages/customer/Profile";
import Maintenance from "../pages/customer/Maintenance";
import ActiveRentals from "../pages/customer/ActiveRentals";
import Rentals from "../pages/customer/Rentals";

// Common Components
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminOnly from "../components/common/AdminOnly";
import Navbar from "../components/common/Navbar";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Products";
import EditProduct from "../pages/admin/EditProduct";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminMaintenance from "../pages/admin/Maintenance";
import AddProduct from "../pages/admin/AddProduct";
import Returns from "../pages/admin/Returns";
import Extensions from "../pages/admin/Extensions";
import ServiceAreas from "../pages/admin/ServiceAreas";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import Checkout from "../pages/customer/Checkout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            CUSTOMER ROUTES
        ========================= */}

        <Route
  path="/checkout"
  element={<Checkout />}
/>

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
  path="/payment-success"
  element={<PaymentSuccess />}
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/active-rentals"
          element={
            <ProtectedRoute>
              <ActiveRentals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rentals"
          element={
            <ProtectedRoute>
              <Rentals />
            </ProtectedRoute>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        {/* Dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <Dashboard />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Products */}

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <AdminProducts />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <AddProduct />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <EditProduct />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Orders */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <AdminOrders />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Maintenance */}

        <Route
          path="/admin/maintenance"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <AdminMaintenance />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Returns */}

        <Route
          path="/admin/returns"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <Returns />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Extensions */}

        <Route
          path="/admin/extensions"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <Extensions />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

        {/* Service Areas */}

        <Route
          path="/admin/service-areas"
          element={
            <ProtectedRoute>
              <AdminOnly>
                <ServiceAreas />
              </AdminOnly>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;