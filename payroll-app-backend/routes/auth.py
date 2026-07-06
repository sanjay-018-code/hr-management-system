from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from models.user import UserRegister, UserLogin
from services.password import hash_password
from services.password import verify_password
from services.jwt_handler import create_token
from app.database import users_collection

router = APIRouter()

@router.post("/register")
def register(user:UserRegister):
    data = user.model_dump()

    data["password"] = (hash_password(data["password"]))
    users_collection.insert_one(data)

    return {
        "message": "User Registered Successfully"
    }

@router.post("/login")
def login(form_data: UserLogin):
    username = form_data.username
    password = form_data.password

    db_user = users_collection.find_one({
        "username": username
    })
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Username"
        )
    
    valid = verify_password(password, db_user["password"])
    if not valid:
        raise HTTPException(
            status_code=401,
            detail="Wrong Password"
        )
    
    token = create_token({"username":db_user["username"], "role": db_user["role"] })

    return {
        "access_token" : token,
        "token_type": "bearer"
    }