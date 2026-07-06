from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    name: str
    department: str
    salary: int

class EmployeeResponse(BaseModel):
    id:str
    name:str
    department:str
    salary:int
    is_deleted: bool=False

class EmployeeListResponse(BaseModel):
    employees: list[EmployeeResponse]
    page: int
    limit: int
    total: int
    has_more : bool

class EmployeeUpdate(BaseModel):
    name: Optional[str]= None
    department: Optional[str]= None
    salary: Optional[int]= None