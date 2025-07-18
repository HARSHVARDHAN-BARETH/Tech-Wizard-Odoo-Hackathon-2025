# ReWear – Community Clothing Exchange

A submission for **Tech-Wizard Odoo Hackathon 2025**  
**Problem Statement 03 – Sustainable Fashion Platform**

## 👨‍💻 Team Members

- **Harshvardhan Bareth** – [barethharshvardhan@gmail.com](mailto:barethharshvardhan@gmail.com)  
- **Rahul Patel** – [rahulpateldz098@gmail.com](mailto:rahulpateldz098@gmail.com)  
- **Ankit Dhanawat** – [ankitd0811@gmail.com](mailto:ankitd0811@gmail.com)

---

## 🌍 Overview

**ReWear** is a community-driven web platform that promotes sustainable fashion by allowing users to exchange unused clothes through either **direct swaps** or a **point-based redemption system**. Our goal is to reduce textile waste and inspire eco-conscious behavior through clothing reuse.

---

## 🚀 Key Features

### 🧾 User Authentication
- Secure email/password-based login and signup
- JSON Web Token (JWT) based session management

### 🏠 Landing Page
- Platform introduction with clean UI
- Calls to Action:  
  - `Start Swapping`  
  - `Browse Items`  
  - `List an Item`
- Carousel for trending or featured items

### 📊 User Dashboard
- View profile information and points balance
- Manage uploaded items
- Track swap history (ongoing & completed)

### 📦 Item Detail Page
- Multiple image gallery
- Detailed descriptions
- Information about uploader
- Swap or redeem options (if item is eligible)
- Status: Available / Swapped

### ➕ Add New Item
- Upload multiple images
- Fill out fields:
  - Title, Description
  - Category, Type, Size
  - Condition, Tags
- Submit form to list item

### 🛠️ Admin Panel
- Lightweight moderation dashboard
- Approve or reject listings
- Remove spam or inappropriate content

---

## 🧰 Tech Stack

| Layer       | Technology               |
|-------------|---------------------------|
| Frontend    | React.js, HTML, CSS, JS   |
| Backend     | Node.js, Express.js       |
| Database    | MongoDB                   |
| Auth        | JWT (JSON Web Tokens)     |
| Deployment  | Vercel                    |

---

🎥 Demo Video
https://youtu.be/_1VFJLXyMJU?si=z0rS7QTnIbgQHCOR

### ✅ Prerequisites

- Node.js v14.x or later
- npm or yarn
- MongoDB (local or cloud)

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/rewear.git
cd rewear

# Install frontend dependencies
npm install

# Setup environment variables
touch .env
