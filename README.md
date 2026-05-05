# InstaPulse - Social Media Content Optimization Platform

InstaPulse is a web application designed to help content creators optimize their social media presence using AI-driven insights and a modular backend architecture.

## 🚀 Features
- **Modular Backend**: Built with FastAPI for high performance and scalability.
- **JWT Authentication**: Secure login and signup system with session management.
- **Integrated Frontend**: Modern UI using Tailwind CSS and Vanilla JavaScript.
- **AI-Ready**: Dedicated module for Machine Learning models and data preprocessing.

---

## 🛠️ Installation & Setup

Follow these steps to run the project on your local machine.

### 1. Prerequisites
- **Python 3.9+**
- **PostgreSQL** (running locally)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/SyedHasanNawaz/InstaPulse.git
cd InstaPulse
```

### 3. Backend Setup
Navigate to the backend directory and set up your environment:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env` file in the `backend/` directory and add your configuration:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/instapulse_db
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Run the Server
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`. You can view the interactive documentation at `http://127.0.0.1:8000/docs`.

---

## 🎨 Frontend Setup
The frontend is built with static HTML and Vanilla JS, so no heavy installation is required.

1. Open a new terminal in the root folder.
2. Run a simple HTTP server (optional but recommended):
   ```bash
   python -m http.server 3000
   ```
3. Open your browser and go to `http://localhost:3000/frontend/login.html`.

---

## 📂 Project Structure
- `backend/`: FastAPI application, routes, services, and models.
- `frontend/`: HTML, CSS, and JS files for the user interface.
- `ml_model/`: Python scripts for data preprocessing and ML model logic.
- `docs/`: Project documentation and requirement specifications.
