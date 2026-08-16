# 🏠 RentEase

### AI-Ready Rental Management Platform

RentEase is a full-stack rental management platform that allows customers to discover rental products, add products to their wishlist and cart, place rental orders, make online payments, track rentals, request maintenance, request returns, and manage rental extensions.

The platform also provides an Admin Panel for managing products, orders, customers, maintenance requests, technicians/staff assignments, returns, rental extensions, and notifications.

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Customer Features](#-customer-features)
- [Admin Features](#-admin-features)
- [Rental Workflow](#-rental-workflow)
- [Payment Workflow](#-payment-workflow)
- [Maintenance Workflow](#-maintenance-workflow)
- [Notification System](#-notification-system)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Overview](#-api-overview)
- [Database](#-database)
- [Authentication](#-authentication)
- [Payment Integration](#-payment-integration)
- [Image Uploads](#-image-uploads)
- [Admin Panel](#-admin-panel)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [License](#-license)

---

# 🚀 Project Overview

RentEase is designed to simplify the complete rental lifecycle.

Instead of managing rental products, customers, payments, returns, maintenance, and extensions separately, RentEase provides a centralized platform.

### The complete flow is:

Customer

↓

Browse Products

↓

View Product Details

↓

Add to Wishlist / Cart

↓

Select Rental Duration & Quantity

↓

Place Order

↓

Online Payment

↓

Payment Verification

↓

Order Approval

↓

Shipping

↓

Delivery

↓

Active Rental

↓

Maintenance / Extension / Return

↓

Rental Completion

---

# ✨ Features

## 👤 Customer

- User registration and login
- JWT-based authentication
- Browse rental products
- Product search
- Category filtering
- Brand filtering
- Rent range filtering
- Product details page
- Wishlist management
- Add/remove wishlist products
- Cart management
- Add/remove cart products
- Multiple products in cart
- Rental duration selection
- Quantity selection
- Multi-product ordering
- Delivery address
- Delivery date
- Delivery time slot
- Online payment
- Payment verification
- Order tracking
- Active rental tracking
- Rental extension requests
- Return requests
- Maintenance requests
- Maintenance status tracking
- Notification system
- Profile management

---

# 🛠️ Admin

The Admin Panel provides centralized management of the rental platform.

### Product Management

- Add products
- Edit products
- Delete products
- Update monthly rent
- Update security deposit
- Update quantity
- Update product description
- Manage product categories
- Manage product brands
- Upload product images

### Order Management

- View all orders
- View customer information
- View rental information
- Approve orders
- Update order status
- Track order lifecycle
- Manage cancellations

### Maintenance Management

- View all maintenance requests
- Search maintenance requests
- Filter by status
- Filter by priority
- View customer information
- View product information
- Assign staff/technicians
- Update maintenance status
- Update priority
- Add admin notes
- Add resolution notes
- Track resolution date
- View maintenance statistics

### Return Management

- View return requests
- Approve returns
- Reject returns
- Update return status
- Manage damage information
- Manage damage charges

### Rental Extension Management

- View extension requests
- Approve extension
- Reject extension
- Track extension duration
- Track extension amount

### Notifications

- Customer notifications
- Payment notifications
- Order notifications
- Maintenance notifications
- Return notifications
- Extension notifications

---

# 👥 User Roles

RentEase currently supports three user roles:

```text
Customer
Vendor
Admin