# Recursive AI Executor

An autonomous, full-stack application that leverages AI to generate, execute, and incrementally fix Python code. 

When provided with a task, the Recursive AI Executor uses Google's Gemini 2.5 Flash model to write Python code. It then executes the code locally in a controlled environment. If the code fails or throws an error, the system automatically feeds the error output back into the AI to correct itself, recursively attempting to solve the problem until successful (up to a predefined limit).

## ✨ Features

- **Autonomous Code Generation & Execution:** Describe a task, and the AI will write the Python script and run it.
- **Recursive Self-Correction:** If the code fails, the error (STDOUT/STDERR) is captured and parsed back to the AI for debugging and refactoring, up to 5 times.
- **Full Execution Logging:** The frontend displays a complete history of the system's attempts, including the varying prompts, generated code iterations, and terminal outputs.
- **Modern UI:** Built with React and Tailwind CSS, featuring a sleek, dark-themed interface with gold accents.

## 🛠️ Tech Stack

**Backend:**
- Python 3
- FastAPI
- Uvicorn
- Google GenAI SDK (Gemini 2.5 Flash)
- Pydantic

**Frontend:**
- React (Vite)
- Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm
- A Google Gemini API Key

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Create a file named `.env.txt` strictly in the `backend` root folder (alongside `requirements.txt`) and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

## 💻 Usage
1. Open the frontend URL in your browser.
2. Enter a programming task in the input box (e.g., `"Write a Python script to fetch the latest Bitcoin price and print it"`).
3. Click **"RUN AI EXECUTOR"**.
4. Watch the AI generate, run, and (if necessary) fix the code in real time until it succeeds!

## ⚠️ Disclaimer
This application executes AI-generated code on your local machine. While execution timeouts exist, the code is executed in your system environment. Be cautious with prompts that modify file systems or interact with sensitive system settings.
