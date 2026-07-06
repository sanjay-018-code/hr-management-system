from pydantic import BaseModel, Field

class UserRegister(BaseModel):
    username:str
    password : str = Field(min_length=8, max_length=72)
    role: str

class UserLogin(BaseModel):
    username: str
    password: str