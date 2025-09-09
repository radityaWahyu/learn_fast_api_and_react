from time import strftime
from pydantic import BaseModel, Field
from typing import Optional


class ChoiceBase(BaseModel):
    choice_text: str
    is_correct: bool

class QuestionBase(BaseModel):
    question_text: str = Field(min_length=1)
    question_category: str = Field(...,min_length=1)
    author: str = Field(...,min_length=1)

    class Config:
        error_msg_templates = {
            'value_error.string_too_short': '{limit_value} harus diisi',
        }



class TokenData(BaseModel):
    username:str | None = None

class UserCreate(BaseModel):
    name: str
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
    grant_type: Optional[str] = "password"
    scope: Optional[str] = ""
    client_id: Optional[str] = None
    client_secret: Optional[str] = None

class UserResponse(BaseModel):
    name: str
    username: str
    role: str

class UserInDB(UserResponse):
    password: str

class Token(BaseModel):
    access_token:str
    token_type:str = "bearer"
    user:dict