# Complete Project Setup Guide

Welcome to the **Civic Rights Navigator** project! Follow these instructions step-by-step to get the application fully up and running on your local machine after cloning the repository.

---

## Prerequisites

Before you start, make sure you have the following installed on your system:
- **Python 3.9+** (for the FastAPI backend)
- **Node.js 18+** & **npm** (for the Next.js frontend)
- **Git** (to clone the repo)

---

## 1. Backend Setup (FastAPI)

The backend powers the AI, MongoDB database connections, and authentication.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment:**
   This ensures dependencies don't conflict with your global Python installation.
   ```bash
   # Create a virtual environment named '.venv'
   python -m venv .venv
   ```

3. **Activate the Virtual Environment:**
   - **Windows:**
     ```powershell
     .\.venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source .venv/bin/activate
     ```

4. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: This might take a minute as it installs libraries like FastAPI, Motor for MongoDB, and Chromadb).*

5. **Set up Environment Variables:**
   Create a new file named `.env` in the `backend` directory (`backend/.env`). Add the following keys to it and fill in the values:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_secure_random_hex_string
   MONGODB_URI=your_mongodb_connection_string
   ```
   *(To generate a secure `JWT_SECRET`, you can run `python -c "import secrets; print(secrets.token_hex(32))"` in your terminal).*
   *⚠️ **Important MongoDB Note**: Ensure that your current IP address is whitelisted in your MongoDB Atlas network access settings, otherwise the backend will fail to connect during startup!*

6. **Start the Backend Server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend should now be running at `http://localhost:8000`. Leave this terminal window running.

---

## 2. Frontend Setup (Next.js)

The frontend contains the modern, dark/light themed chat interface and dashboard.

1. **Open a new terminal window** (keep the backend terminal running!) and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration (Optional):**
   By default, the frontend is configured to talk to the backend at `http://localhost:8000`. If you need to change this, you can create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

---

## 3. Launch the Application!

1. Open your web browser and navigate to **`http://localhost:3000`**.
2. You should see the homepage. Click on **Register** to create a new test account.
3. Once logged in, navigate to the **Platform** to test out the dark-themed Civic Rights Navigator chat!

### Troubleshooting

- **Backend crashes on startup or endpoints hang indefinitely?** Double-check that your IP address is whitelisted in MongoDB Atlas. 
- **`passlib` or `bcrypt` errors on register?** We recently replaced `passlib` with raw `bcrypt` to fix a compatibility crash. Make sure you pulled the latest `backend/app/auth/utils.py` and ran `pip install -r requirements.txt`.
- **"Event loop is closed" during tests?** This is a known Starlette `TestClient` quirk. The actual server (`uvicorn`) handles this flawlessly.
