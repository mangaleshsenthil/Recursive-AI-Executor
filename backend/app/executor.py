# backend/app/executor.py
import subprocess
import os
import time

# Define a temporary file path for the generated code
TEMP_FILE_PATH = "temp_exec.py"
MAX_EXECUTION_TIME = 5  # seconds (Requirement 7)

def execute_code(code: str):
    """
    Writes code to a temporary file and executes it in a sandboxed process.
    Returns status, stdout, stderr, and time_taken.
    """
    start_time = time.time()
    
    # 1. Write code to a temporary file
    try:
        with open(TEMP_FILE_PATH, "w") as f:
            f.write(code)
    except IOError as e:
        return "FAILURE", "", f"File write error: {e}", 0.0

    # 2. Execute the file using subprocess
    try:
        result = subprocess.run(
            ['python', TEMP_FILE_PATH],
            capture_output=True, # Captures stdout and stderr
            text=True,           # Decodes stdout/stderr as text
            timeout=MAX_EXECUTION_TIME,
            check=False          # Do not raise an exception on non-zero return code
        )
        
        # 3. Determine status and capture output
        if result.returncode == 0:
            status = "SUCCESS"
        else:
            status = "FAILURE"
            
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()
        
    except subprocess.TimeoutExpired:
        status = "TIMEOUT"
        stdout = ""
        stderr = f"Execution timed out after {MAX_EXECUTION_TIME} seconds."
        
    except Exception as e:
        status = "FAILURE"
        stdout = ""
        stderr = f"Unknown execution error: {e}"
    
    finally:
        # 4. Clean up the temporary file
        if os.path.exists(TEMP_FILE_PATH):
            os.remove(TEMP_FILE_PATH)
            
    end_time = time.time()
    return status, stdout, stderr, round(end_time - start_time, 2)