from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from database import Base
from enums import UserRole
from sqlalchemy.dialects.postgresql import ENUM


class Questions(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, index=True)
    question_category = Column(String)
    author = Column(String)

class Choices(Base):
    __tablename__ = 'choices'

    id = Column(Integer, primary_key= True, index=True)
    choice_text = Column(String, index=True)
    is_correct = Column(Boolean, default=False)
    question_id = Column(Integer, ForeignKey("questions.id"))

class User(Base):
    __tablename__= 'users'

    id = Column(Integer,primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True, index=True)
    email = Column(String,unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(ENUM(UserRole), default=UserRole.OPERATOR)