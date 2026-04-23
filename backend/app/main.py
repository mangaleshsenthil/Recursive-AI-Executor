# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
from typing import List # <--- FIX: Added missing import

from .models import ExecutionRequest, ExecutionResponse, ExecutionLog
from .ai_agent import generate_code
from .executor import execute_code

# --- Setup ---
app = FastAPI(title="Recursive AI Executor")

# Setup CORS for frontend communication (assuming frontend runs on port 5173 or 3000)
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite/React default
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_ATTEMPTS = 5 # (Requirement 7 - Reliability)

@app.post("/execute", response_model=ExecutionResponse)
async def execute_recursive_ai(request: ExecutionRequest):
    """
    Handles the recursive code generation and execution loop.
    """
    initial_prompt = request.prompt
    current_prompt = initial_prompt
    log_history: List[ExecutionLog] = [] # List is now correctly defined
    
    final_status = "FAILURE" # Default
    final_code = ""
    final_output = "No successful execution."
    
    for attempt in range(1, MAX_ATTEMPTS + 1):
        # 1. AI Code Generation
        start_time = time.time()
        print(f"--- Attempt {attempt}: Generating code...")
        code_generated = generate_code(current_prompt)
        
        if code_generated.startswith("# ERROR:"):
             # Stop if AI API failed (e.g., Gemini Client failed)
            log_history.append(ExecutionLog(
                attempt=attempt, prompt_used=current_prompt, code_generated=code_generated,
                status="API_ERROR", stdout="", stderr=code_generated, time_taken=0.0
            ))
            final_status = "API_ERROR"
            break

        # 2. Code Execution
        status, stdout, stderr, exec_time = execute_code(code_generated)
        
        # 3. Log the Attempt
        attempt_log = ExecutionLog(
            attempt=attempt, prompt_used=current_prompt, code_generated=code_generated,
            status=status, stdout=stdout, stderr=stderr, time_taken=exec_time
        )
        log_history.append(attempt_log)

        # 4. Check for Success
        if status == "SUCCESS":
            final_status = "SUCCESS"
            final_code = code_generated
            final_output = stdout
            print(f"--- Success on Attempt {attempt} ---")
            break
        
        # 5. Recursive Retry (Refine Prompt)
        print(f"--- Failure on Attempt {attempt}. Retrying...")
        
        # Append error output to prompt for refinement
        error_info = f"\n\nCRITICAL ERROR/OUTPUT FROM PREVIOUS ATTEMPT ({status}):\n"
        if stderr:
            error_info += f"STDERR:\n{stderr}"
        elif stdout: # Sometimes the program runs but the output indicates failure
            error_info += f"STDOUT:\n{stdout}"
        
        current_prompt = initial_prompt + error_info
        
    return ExecutionResponse(
        final_status=final_status,
        final_code=final_code,
        final_output=final_output,
        total_attempts=len(log_history),
        log_history=log_history
    )