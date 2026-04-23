# backend/app/ai_agent.py
import os
from google import genai                 
from dotenv import load_dotenv
from pathlib import Path

# --- Configuration Setup ---

# Determine the path to the .env file (one directory up in 'backend')
# The file name is explicitly set to .env.txt to match your file system.
env_path = Path(__file__).resolve().parent.parent / '.env.txt' 

# Load environment variables (GEMINI_API_KEY). Note: This still relies on your .env.txt file.
load_dotenv(env_path)

# --- Initialize the Client ---
try:
    # Use os.getenv("GEMINI_API_KEY") (Ensure your .env.txt file uses this key name)
    client = genai.Client()
except Exception as e:
    print(f"Gemini Client Initialization Error: {e}")
    client = None

# Crucial system prompt instructing the AI to output ONLY runnable Python code
SYSTEM_INSTRUCTION = (
    "You are an expert Python developer. Your task is to generate ONLY a complete, "
    "runnable Python script to solve the user's request. Do not include any "
    "explanations, comments, or markdown formatting (e.g., ```python). "
    "The code must be ready to execute directly. "
    
    # --- ADDED RESTRICTION ---
    "**CRITICAL CONSTRAINT:** The code MUST NOT use any interactive functions "
    "(such as input(), raw_input(), or sys.stdin). All variables and inputs "
    "must be defined internally in the script before execution."
    # -------------------------
)

def generate_code(prompt: str) -> str:
    """
    Sends the user prompt and system instruction to the Gemini model to generate code.
    """
    if client is None:
        return "# ERROR: AI Generation failed because the Gemini Client could not initialize."
        
    try:
        # --- CHANGE 2: Use the Gemini API call structure ---
        response = client.models.generate_content(
            model='gemini-2.5-flash', # A fast and capable model for code generation
            contents=[prompt],
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.1,  # Keep temperature low for reliable code
            )
        )
        
        # Extract and clean the generated content (Gemini uses response.text)
        code = response.text.strip()
        return code
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"# ERROR: AI Generation failed due to API issue: {e}"