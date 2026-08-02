# 🎨 Virtual-Art-Gallery

## Full-Stack Online Art Gallery with Authentication, Shopping Cart & Order Management

Virtual-Art-Gallery is a full-stack web application that allows users to explore a collection of paintings, create accounts, manage shopping carts, place orders, and securely access their profiles. The application also provides an administrative dashboard for managing the gallery.

---

# 📌 Overview

The project demonstrates the implementation of a complete web application using the MERN stack principles with authentication, user management, and e-commerce functionality.

It includes:

* User Authentication
* Artwork Browsing
* Shopping Cart
* Checkout System
* Order Management
* User Profiles
* Admin Dashboard
* MongoDB Database Integration

---

# ✨ Features

## 👤 User Authentication

* User Registration
* Secure Login
* Session Management
* Protected Routes

## 🎨 Artwork Gallery

* Browse available paintings
* View artwork details
* Responsive gallery layout

## 🛒 Shopping Cart

* Add paintings to cart
* Remove paintings
* View cart summary
* Update cart contents

## 💳 Checkout System

* Place orders
* Order confirmation
* Order summary

## 📦 Order Management

* View previous orders
* Order history
* User purchase tracking

## 👨‍💼 Admin Dashboard

* Manage gallery content
* Administrative controls
* User management support

---

# 🏗️ System Architecture

```text
                 User
                   │
                   │
            HTML / CSS / JS
                   │
                   │
          Express.js Backend
                   │
         ---------------------
         │                   │
 Passport Authentication   MongoDB
                   │
              Mongoose ODM
```

---

# 🛠️ Tech Stack

| Category           | Technology              |
| ------------------ | ----------------------- |
| Frontend           | HTML5, CSS3, JavaScript |
| Backend            | Node.js                 |
| Framework          | Express.js              |
| Database           | MongoDB                 |
| ODM                | Mongoose                |
| Authentication     | Passport.js             |
| Session Management | Express Session         |
| Password Hashing   | bcrypt                  |

---

# 📂 Project Structure

```text
Virtual-Art-Gallery/

├── config/
│   └── Passport configuration
│
├── models/
│   └── Database models
│
├── public/
│   ├── HTML pages
│   ├── CSS files
│   ├── JavaScript
│   └── Images
│
├── routes/
│   └── Application routes
│
├── server.js
├── package.json
└── README.md
```

---

# 📋 Prerequisites

Before running the project, ensure you have:

* Node.js
* npm
* MongoDB

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/ashithreddyp/Virtual-Art-Gallery.git
```

Move into the project directory:

```bash
cd Virtual-Art-Gallery
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure MongoDB

Ensure MongoDB is installed and running on your local machine.

If your project requires environment variables, create a `.env` file with the required configuration.

Example:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

---

## 4. Start the Application

```bash
npm start
```

Open your browser and visit:

```text
http://localhost:3000
```

---

# 🚀 Usage

1. Register a new account or log in with an existing account.
2. Browse the available artwork.
3. View painting details.
4. Add paintings to your shopping cart.
5. Proceed through the checkout process.
6. View your profile and order history.
7. Administrators can manage the gallery using the admin dashboard.

---

# 🔄 Application Workflow

1. Users register or log in securely.
2. Authentication is handled using Passport.js.
3. Users browse available artwork.
4. Selected paintings are added to the shopping cart.
5. Orders are processed through the checkout system.
6. Order information is stored in MongoDB.
7. Users can review previous purchases from their profile.

---

# 🚀 Future Improvements

* Online payment gateway integration
* Artwork search functionality
* Category-based filtering
* Wishlist support
* Reviews and ratings
* Responsive mobile optimization
* Artwork recommendations
* Inventory management

---

# 👨‍💻 Author

**Ashith Reddy**

* GitHub: https://github.com/ashithreddyp

---

# 📄 License

This project is intended for educational and demonstration purposes. Feel free to explore the codebase and use it as a learning resource.
