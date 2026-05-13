# 🌟 InstaMetrics: The Ultimate Social Media DSS

**InstaMetrics** is a premium, AI-driven **Decision Support System (DSS)** designed to transform how content creators and digital marketers plan their social media presence. By shifting the focus from *post-publication analytics* to *pre-publication optimization*, InstaMetrics empowers users to predict viral potential and maximize engagement before they ever hit "Post."

---

## 🚀 The Core Mission
Most social media tools tell you how your post *did*. **InstaMetrics tells you how your post *will do*.** Our platform bridges the gap between creative intuition and data science, providing a simulated environment to test, refine, and perfect your content strategy.

---

## ✨ Key Features & Functionalities

### 1. 🧠 Optimization Advisor (AI A/B Testing)
The crown jewel of InstaMetrics. It acts as a software-based consultant that performs real-time A/B testing on your post drafts.
- **Dynamic Simulation**: Compare your "Original Draft" against an "AI Optimized Strategy."
- **Parameter Tuning**: Test different media types (Reels, Images, Carousels), posting hours (0-23), and niches (Technology, Fashion, etc.).
- **Pulse Score**: A 0-100 probability metric indicating the likelihood of high engagement or viral success.

### 2. 🪄 AI Magic Wand (Caption Refinement)
Powered by the **Groq Llama 3 API**, this feature provides professional-grade copywriting on demand.
- **The Hook**: Generates high-impact first lines to stop the scroll.
- **The Story**: Crafts narrative-driven captions that build community.
- **The Pro**: Clean, professional variations for brand-focused content.

### 🤖 InstaMetrics AI Assistant
A context-aware support agent integrated directly into the platform.
- **Platform Expert**: Trained on the InstaMetrics manual to help users understand ML logic and features.
- **Content Consultant**: Provides real-time advice on Instagram growth strategies.
- **Strict Boundaries**: Ensures a professional focus by strictly adhering to social media optimization topics.

### 3. 📊 Interactive Analytics Dashboard
A high-performance visual command center that provides:
- **Weekly Engagement Trends**: Track predicted performance across the week.
- **Hourly Heatmaps**: Identify the "Golden Hour" for your specific niche.
- **Niche Leaderboard**: Real-time stats on which categories are currently trending.

### 4. 🎭 Social Media Clone Simulation
To demonstrate its predictions in action, InstaMetrics includes a fully integrated social media "clone."
- **Mock Feed**: View your optimized posts in a realistic UI.
- **Engagement Simulation**: Mimics likes, comments, and reach based on AI predictions.
- **Sandbox Environment**: A safe space to experiment with radical content shifts without risking real-world brand equity.

---

## 🛠️ Technical Architecture & Implementation

### 🧠 The AI Brain (ML Pipeline)
InstaMetrics uses a multi-model ensemble approach implemented in Python with **Scikit-Learn**:
- **Random Forest Classifier**: The primary engine for predicting the `Pulse Score`. It analyzes thousands of historical data points to identify success patterns.
- **K-Nearest Neighbors (K-NN)**: Used to find the "Baseline" performance by identifying the 5 most similar historical posts to your draft.
- **Isolation Forest**: Our **Viral Anomaly Detector**. It identifies if a post setup is an "outlier" (anomalous) which often correlates with explosive viral potential.
- **TextBlob NLP**: Performs sentiment analysis on captions to ensure the tone matches the intended audience engagement.

### 🏗️ Backend Infrastructure
- **FastAPI**: A high-performance, asynchronous Python framework for handling API requests with minimal latency.
- **SQLAlchemy (Async)**: Modern ORM for interacting with our **SQLite** database (chosen for portability and local performance).
- **JWT Security**: Industrial-grade authentication using JSON Web Tokens to ensure user data isolation and security.

### 🎨 Frontend Excellence
- **React 18 + Vite**: For a blazing-fast, reactive user experience.
- **Tailwind CSS**: A utility-first CSS framework used to build a custom **Glassmorphism** design system.
- **Framer Motion**: Powers the platform's premium micro-animations and fluid page transitions.
- **Lucide Icons**: A sleek, consistent icon set for intuitive navigation.

---

## 📂 Detailed Project Structure

```text
├── backend/                # FastAPI Core
│   ├── app/
│   │   ├── routes/         # API Endpoints (Auth, ML, Chatbot)
│   │   ├── models/         # Database Schemas
│   │   ├── utils/          # Security & Dependency Injection
│   │   └── config.py       # Environment Settings
│   └── .env                # API Keys & Secrets
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI (Chatbot, Sidebar, Layout)
│   │   ├── pages/          # View Logic (Dashboard, Feed, Auth)
│   │   └── services/       # API Integration Layer
├── ml_model/               # Machine Learning Logic
│   ├── InstaMetrics.py     # Core ML Pipeline & Data Processing
│   └── Instagram_Analytics.csv # Historical Training Dataset
└── docs/                   # Official SRS & Project Proposals
```

---

## 🚦 Installation & Setup

### 1. Prerequisites
- Python 3.9+
- Node.js 18+

### 2. Quick Start
1. **Clone & Setup Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. **Configure Environment**:
   Update `backend/.env` with your `GROQ_API_KEY`.
3. **Launch Backend**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
4. **Launch Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🤝 Authors & Contributors
- **Syed Hasan Nawaz** (23i-0703)
- **Muhammad Zain** (23L-0712)
- **Rabia** (23F-0812)
- **Mahad Bin Atif** (22L-4951)
- **Saim** (21L-1897)

*Developed as part of the Social Media Content Optimization & Analytics System project at FAST NUCES.*

---

**InstaMetrics — Optimize your pulse, capture the world.**
