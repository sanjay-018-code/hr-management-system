from fastapi import HTTPException
from bson import ObjectId

from models.leave import LeaveCreate, LeaveResponse,LeaveUpdate
from app.database import leave_collection

def create_leave_services(leave:LeaveCreate):
    data = leave.model_dump()
    data["start_date"] = str(data["start_date"])
    data["end_date"] = str(data["end_date"])
    data["status"] = "pending"

    result = leave_collection.insert_one(data)
    
    return LeaveResponse(
        id=str(result.inserted_id),
        **data
    )

def get_all_leaves_services():
    result = leave_collection.find()

    leave = []

    for record in result:
        leave.append(
            LeaveResponse(
                id=str(record["_id"]),
                employee_id=record["employee_id"],
                leave_type=record["leave_type"],
                start_date=record["start_date"],
                end_date=record["end_date"],
                reason = record["reason"],
                status=record["status"]
            )
        )

    return leave

def update_leave_services(leave_id,leave:LeaveUpdate):
    updates = leave.model_dump(exclude_none=True)

    result=leave_collection.update_one({
        "_id":ObjectId(leave_id)
    },{
        "$set": updates
    })

    if result.matched_count == 0: raise HTTPException(404, "Leave Not Found")

    updated = leave_collection.find_one({"_id":ObjectId(leave_id)})
    if not updated: raise HTTPException(404, "Leave not Found")

    return LeaveResponse(
        id= str(updated["_id"]),
        employee_id=updated["employee_id"],
        leave_type=updated["leave_type"],
        start_date=updated["start_date"],
        end_date=updated["end_date"],
        reason=updated["reason"],
        status=updated["status"]
    )

def get_approved_leaves_for_date(date_str):
    from datetime import datetime
    
    target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    
    query = {
        "status": "approved",
        "start_date": {"$lte": date_str},
        "end_date": {"$gte": date_str}
    }
    
    result = leave_collection.find(query)
    
    leaves = []
    for record in result:
        leaves.append(
            LeaveResponse(
                id=str(record["_id"]),
                employee_id=record["employee_id"],
                leave_type=record["leave_type"],
                start_date=record["start_date"],
                end_date=record["end_date"],
                reason=record.get("reason"),
                status=record["status"]
            )
        )
    
    return leaves