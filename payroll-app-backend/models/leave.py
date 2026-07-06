from pydantic import BaseModel
from datetime import date
from typing import Optional

class LeaveCreate(BaseModel):
    employee_id:str
    leave_type:str
    start_date:date
    end_date:date
    reason:Optional[str] = None

class LeaveResponse(BaseModel):
    id:str
    employee_id:str
    leave_type:str
    start_date:date
    end_date:date
    reason:Optional[str] = None
    status:str

class LeaveUpdate(BaseModel):
    status:Optional[str]=None