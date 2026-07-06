from pydantic import BaseModel

class DepartmentCreate(BaseModel):
    name : str

class DepartmentResponse(DepartmentCreate):
    id : str
    name : str
    is_deleted : bool = False