# 🌟 InstaPulse

### The Future of Social Media Content Optimization

InstaPulse is a premium, AI-driven platform designed to empower content creators with data-backed insights. By leveraging advanced machine learning models and a sleek, high-performance architecture, InstaPulse helps you predict viral potential, optimize engagement, and manage your social presence with style.

---

## ✨ Key Features

### 🧠 AI-Powered Analytics
- **Pulse Score**: Get a real-time "health check" for your content before you post.
- **Viral Prediction**: AI models analyze your drafts to predict reach and engagement potential.
- **Optimization Advisor**: Get actionable tips on the best times to post, hashtag strategy, and visual improvements.

### 🎨 Premium UI/UX
- **Modern Aesthetics**: A stunning "Glassmorphism" design with deep purple accents and vibrant gradients.
- **Dynamic Animations**: Powered by **Framer Motion** for a fluid, premium feel.
- **Dark Mode Optimized**: Native dark mode support for a comfortable creator experience.
- **Interactive Dashboard**: Real-time data visualization of your social performance.

### 🛡️ Secure & Scalable
- **JWT Authentication**: Industrial-grade security for user accounts.
- **Security Guard**: Auto-session management and secure password hashing.
- **Profile Management**: Real-time updates for usernames, emails, and security settings.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite** for blazing-fast development.
- **Tailwind CSS** & Vanilla CSS for highly customized, responsive layouts.
- **Framer Motion** for world-class micro-interactions and transitions.
- **Lucide Icons** for a clean, consistent visual language.

### Backend
- **FastAPI** (Python) for a high-performance, asynchronous API.
- **SQLAlchemy** with **PostgreSQL** for robust data persistence.
- **Scikit-Learn** for the core Machine Learning intelligence.

---

## 🚀 Getting Started

Follow these steps to launch InstaPulse on your local machine.

### 1. Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (running locally)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # OR
   venv\Scripts\activate     # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *The API will be live at `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## 📂 Project Structure

```text
├── backend/            # FastAPI Application
│   ├── app/            # Core logic (Routes, Services, Models)
│   ├── uploads/        # User-uploaded content
│   └── requirements.txt
├── frontend/           # React + Vite Application
│   ├── src/            # Components, Pages, Context, Services
│   └── public/         # Static assets
├── ml_model/           # AI Architecture & Preprocessing
└── docs/               # Technical documentation
```

---

## 🤝 Contributing

We welcome contributions from the community! Feel free to open an issue or submit a pull request to help make InstaPulse even better.

**InstaPulse — Optimize your pulse, capture the world.**
