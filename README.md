# ⚡ FlexDrip: Streetwear E-Commerce & AI Assistant Platform

FlexDrip is a premium, feature-rich streetwear e-commerce marketplace. The platform connects buyers and sellers, provides a dynamic flat Cartesian SKU matrix variants system, and features **Flexy**, a Retrieval-Augmented Generation (RAG) AI customer support chatbot that automatically handles order lookups, answers store policy questions, and files support tickets.

---

## 🚀 Key Features

### 👤 User Management & Profile Completion
* **Google OAuth & JWT Auth:** Secure user authentication using Passport.js Google Strategy and standard JWT credentials.
* **Dynamic Profile Completion:** Auto-detects uncompleted profile information (e.g., for new Google signups), requesting full names and phone numbers.
* **Role Locking:** Users can select between `buyer` and `seller` roles during setup, which is permanently locked once completed.

### 🛍️ Cart & Checkout Flow
* **Live Database Synced Cart:** Seamless shopping cart updates for buyers. All cart items populate product details dynamically from the database.
* **Guest User Gatekeeping:** Redirects guest users to login when trying to interact with cart operations.
* **Simulated Checkout:** Checkout validates profile completion, updates stock, clears the cart database entry, and generates an order log saved locally for the buyer.

### 🎨 Flat Cartesian SKU Matrix & Variants System
* **Dynamic Tag/Option Builder:** Sellers can define attributes (e.g., *Color*, *Size*, *Fabric*) to generate a Cartesian product matrix of variants.
* **Granular SKU Overrides:** Each variant SKU supports custom stock levels, individual price overrides, and color/variant-specific image galleries.
* **Index-Based Image Uploads:** Integrates Multer + ImageKit to map multiple uploaded files to specific variant combinations by index.
* **Interactive Buyer Selector:** Prevents purchasing invalid configurations through real-time combination checking and disabled state updates.

### 🎫 Support Ticket System
* **Automated Ticket Raising:** Buyers can raise support tickets for active orders (pending, paid, shipped) if they face delivery or payment issues.
* **Automatic Email Notifications:** Dispatches transactional emails (using Nodemailer) containing HTML ticket receipts to both the buyer and the seller.
* **Seller Ticket Workspace:** Sellers have a dedicated workspace to view, manage, and address customer tickets.

### 🤖 RAG-Powered AI Chatbot ("Flexy")
* **Low-Latency Agent Loop:** Powered by **Gemini 2.5 Flash** and **LangChain** tool calling.
* **Pinecone Vector Database:** Performs semantic search using **Mistral AI Embeddings** (`mistral-embed`) over the FlexDrip knowledge base.
* **Actionable Tools:** Flexy is equipped with secure tools to:
  * `get_active_orders`: Retrieve live status of ongoing buyer shipments.
  * `check_ticket_status`: Verify if a ticket has already been opened for an order.
  * `raise_ticket`: Create a support ticket and dispatch email updates.
  * `query_knowledge_base`: Retrieve store policies (returns, shipping, hours).

---

## 🛠️ Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router DOM v7, Axios, Lucide Icons |
| **Backend** | Node.js, Express, Mongoose (MongoDB), Passport.js (Google OAuth 2.0), JWT, Multer, Morgan |
| **Storage & Email**| ImageKit (Media Assets Storage), Nodemailer (Transactional Emails) |
| **AI / RAG** | LangChain JS, ChatGoogleGenerativeAI (Gemini 2.5 Flash), MistralAIEmbeddings, Pinecone DB |

---

## 📁 Repository Structure

```
FlexDrip2/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & environment configurations
│   │   ├── controller/   # API request controllers (auth, cart, order, product, etc.)
│   │   ├── html/         # HTML email templates
│   │   ├── middleware/   # JWT verification, error handling, validation
│   │   ├── models/       # Mongoose schemas (User, Product, Cart, Order, Ticket)
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # AI service, email agent, ImageKit, database helpers
│   │   └── app.js        # Express app initializer
│   ├── server.js         # Entry point for backend
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/          # Redux store configurations
│   │   ├── components/   # Global UI components (Navbar, ChatbotWidget, ProtectedRoute)
│   │   ├── features/     # Feature-focused slices, pages, and components
│   │   │   ├── auth/     # Registration, login, forgot password views
│   │   │   ├── buyer/    # Storefront home, cart, orders, profile views
│   │   │   └── seller/   # Product dashboard, variants creator, orders, support tickets
│   │   ├── main.jsx      # Entry point for frontend
│   │   └── index.css     # Global styles and tailwind config
│   ├── package.json
│   └── vite.config.js
└── docs/                 # Guides and knowledge base documents
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root of both directory components.

### 1. Backend (`backend/.env`)
```ini
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flexdrip
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Google OAuth Setup
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Nodemailer Email Configuration
NODEMAILER_EMAIL_USER=your_email@gmail.com
NODEMAILER_APP_PASSWORD=your_gmail_app_password

# Vector DB & LLM Keys
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=flexdrip
MISTRAL_API_KEY=your_mistral_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Frontend (`frontend/.env`)
```ini
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🏁 Getting Started

Follow these instructions to run the application in your local environment.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local database instance or Atlas connection URI)

### Step 1: Install Dependencies
Open two terminals or navigate to the subfolders:

**For Backend:**
```bash
cd backend
npm install
```

**For Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start the Backend Server
```bash
cd backend
npm run dev
```
The API server will run at `http://localhost:3000` and connect to your MongoDB cluster.

### Step 3: Start the Frontend Application
```bash
cd frontend
npm run dev
```
The React development server will start at `http://localhost:5173`. Open this URL in your web browser.

---

## 🧪 System Verification

To verify that all services are correctly running:
1. **Server Health:** Verify the API state by visiting `http://localhost:3000/health`. It should return `ok`.
2. **Interactive UI:** Navigate to `http://localhost:5173/`, create a new buyer or seller account, and complete your profile parameters.
3. **Chatbot Support:** Click on the chat bubble widget in the bottom-right corner and talk to **Flexy** (e.g. ask *"How long does shipping take?"* or *"What are my active orders?"*).
