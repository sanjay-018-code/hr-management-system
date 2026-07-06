from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME =str(os.getenv("DB_NAME"))

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

employees_collection = db["employees"]
users_collection = db["users"]
attendance_collection = db["attendance"]
leave_collection = db["leaves"]
payroll_collection = db["payroll"]
department_collection = db["department"]