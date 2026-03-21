# 🚀 Marketplace.ai

---

## 🌐 Live Demo
Experience the power of the platform here:  
**[👉 Live Link: marketPlace.ai.vercel.app](https://market-place-ai-frontend.vercel.app/)**

> **Note:** Since this is hosted on a **free tier**, the backend may take 30-60 seconds to "wake up" on the first request. Please be patient while the server initializes! 🚀

---

### AI-Powered B2B Lead Generation & Wholesaler Matching

Marketplace.ai is a next-generation platform that connects buyers with wholesalers using **AI-driven vector search**. Instead of manual browsing, buyers describe what they need, and our AI matches the request with the most relevant suppliers, notifying them instantly via WhatsApp.

---

## 🌟 Key Features

* **AI Smart Matching:** Uses vector embeddings to match natural language buyer requests with wholesaler business descriptions.
* **WhatsApp Command Center:** Instant lead notifications sent to sellers with "Reply to Accept" functionality.
* **Role-Based Dashboards:** Distinct, high-performance interfaces for **Buyers** (to track requests) and **Sellers** (to manage leads).
* **Dual Authentication:** Secure JWT-based auth system supporting both individual buyers and business entities.
* **Real-time Analytics:** Seller dashboard featuring lead acceptance rates and AI search visibility scores.

---

## 🛠️ Tech Stack

**Frontend:**
* Next.js 14 (App Router)
* Zustand (State Management with Persistence)
* Tailwind CSS & Framer Motion (UI/UX)
* Lucide React (Icons)

**Backend:**
* Node.js & Express
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for Auth
* Axios for API communication

**Integrations:**
* **Meta WhatsApp Business API:** For automated notifications.
* **Vector Search/Embeddings:** For intelligent supplier matching.

---

## 📦 Installation & Setup

This project is split into two repositories: the **Frontend (Next.js)** and the **Backend (Node.js/Express)**.

### 1. Backend Setup (API & Database)
The core logic, AI matching engine, and WhatsApp integrations reside in the backend repository.
* **Go to the Backend Repository:** [https://github.com/yourusername/marketplace-ai-frontend.git]
* **Follow the instructions** in the backend `README.md` to set up your MongoDB, Environment Variables, and WhatsApp Webhooks.
* Ensure the server is running (usually on `http://localhost:5000`) before starting the frontend.

---

### 2. Frontend Setup (UI)
Once the backend is configured, follow these steps to set up the marketplace interface:

**Clone the Frontend repository:**
```bash
git clone [https://github.com/yourusername/marketplace-ai-frontend.git](https://github.com/yourusername/marketplace-ai-frontend.git)
cd marketplace-ai-frontend