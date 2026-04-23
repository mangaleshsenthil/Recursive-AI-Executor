# backend/app/models.py
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Core Data Models ---

class ExecutionLog(BaseModel):
    """Stores the result of a single code execution attempt."""
    attempt: int
    prompt_used: str
    code_generated: str
    status: str  # e.g., "SUCCESS", "FAILURE", "TIMEOUT"
    stdout: str
    stderr: str
    time_taken: float

class ExecutionRequest(BaseModel):
    """Input from the Frontend."""
    prompt: str = Field(..., example="Generate code to calculate the 10th Fibonacci number.")

class ExecutionResponse(BaseModel):
    """Output sent back to the Frontend."""
    final_status: str
    final_code: str
    final_output: str
    total_attempts: int
    log_history: List[ExecutionLog]