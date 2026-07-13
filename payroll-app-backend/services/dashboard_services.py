from fastapi import HTTPException
from datetime import date

from models.dashboard import DashboardResponse
from app.database import employees_collection
from app.database import department_collection
from app.database import attendance_collection
from app.database import leave_collection

def get_dashboard_details():

    total_employees = employees_collection.count_documents({"is_deleted":False})


    total_departments = department_collection.count_documents({"is_deleted":False})

    today = str(date.today())
    present_today = attendance_collection.count_documents({
        "date":today,
        "status": "present"
    })

    absent_today = attendance_collection.count_documents({
        "date":today,
        "status": "absent"
    })

    pending_leaves = leave_collection.count_documents({
        "status":"pending",
        "end_date":{"$gte":today}
    })


    return DashboardResponse(
        total_employees = total_employees,
        total_departments=total_departments,
        present_today=present_today,
        absent_today=absent_today,
        pending_leaves=pending_leaves,
    )

def get_attendance_chart_service():
    today = str(date.today())
    present = attendance_collection.count_documents({
        "date":today,
        "status": "present"
    })

    absent = attendance_collection.count_documents({
        "date":today,
        "status": "absent"
    })

    leave = attendance_collection.count_documents({
        "status":"leave",
        "date": today
    })

    return {
        "present":present,
        "absent":absent,
        "leave":leave
    }