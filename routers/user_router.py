from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

from auth import authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user,get_user, get_password_hash
from database import get_db
from schema import Token, UserCreate
from models import User


router = APIRouter()

@router.get("/")
async def get_user_profile(current_user:User=Depends(get_current_user)):
    user=current_user

    return {"user":{"username":user.username,"name":user.name,"role":user.role}}



@router.post("/register")
def register_user(user:UserCreate, db:Session = Depends(get_db)):
    db_user = get_user(db, user.username)

    if db_user:
        raise HTTPException(status_code=400, detail=f"Username sudah terdaftar")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, password = hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

   
    return db_user

@router.post("/token")
async def login_user(form_data:OAuth2PasswordRequestForm = Depends(),db:Session = Depends(get_db))-> Token:
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Username dan password tidak ditemukan",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    
    print(user.username)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer", user={"username":user.username,"name":user.name,"role":user.role})


