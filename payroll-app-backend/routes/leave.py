from fastapi import APIRouter, Depends

from services.role_dependency import allow_roles
from services.leave_services import create_leave_services, get_all_leaves_services, update_leave_services
from models.leave import LeaveCreate, LeaveResponse, LeaveUpdate

router = APIRouter()

@router.post("/", response_model=LeaveResponse)
def create_leave(leave:LeaveCreate,current_user = Depends(allow_roles(["employee","hr"]))):
    return create_leave_services(leave)

@router.get("/",response_model=list[LeaveResponse])
def get_all_leave():
    return get_all_leaves_services()

@router.patch("/{leave_id}", response_model=LeaveResponse)
def update_leave(leave_id:str,leave:LeaveUpdate,current_user=Depends(allow_roles(["hr","admin"]))):
    return update_leave_services(leave_id,leave)