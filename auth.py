from datetime import datetime, timedelta,timezone
import jwt
from jwt import InvalidTokenError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schema import TokenData


SECRET_KEY = "6dc5a9d801ab3827726eec01359715a9d4b186ce25addcca5dcb0eafd761464e"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/user/token", auto_error=False)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, username: str):
    db_user = db.query(User).filter(User.username == username).first()
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)

    if not user:
        return False
    
    if not verify_password(password, user.password):
        return False
    
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Anda belum login",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        expiration_timestamp = payload.get("exp")
        expiration_date = datetime.fromtimestamp(expiration_timestamp)
        
        if username is None:
            raise credentials_exception

        if datetime.now() >= expiration_date:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Sesi anda telah habis, silahkan login kembali",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token_data = TokenData(username=username)

    except InvalidTokenError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == token_data.username).first()

    if user is None:
        raise credentials_exception
    
    return user