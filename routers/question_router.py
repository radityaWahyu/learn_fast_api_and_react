from fastapi import APIRouter, Response, HTTPException,Depends
from fastapi.responses import JSONResponse
from starlette import status
import models
from database import db_depedency
from schema import QuestionBase
from models import User
from auth import get_current_user

router = APIRouter(prefix="/api/v1/questions", tags=["questions"],)

@router.get("/")
async def list_question(db:db_depedency, response: Response, current_user:User=Depends(get_current_user)):
    result = db.query(models.Questions).all()
    response.status_code = status.HTTP_200_OK

    if not result:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return {
        'message':"success",
        'data': result
    }


@router.get("/{question_id}")
async def read_question(question_id: int,response: Response,db: db_depedency):
    result = db.query(models.Questions).get(question_id)

    response.status_code = status.HTTP_200_OK
    if not result:
        raise HTTPException(status_code=404, detail="Question not found")
    
    return {
        'message':"success",
        'data': result
    }

@router.post("/")
async def create_questions(question:QuestionBase,response: Response, db: db_depedency):
    db_question = models.Questions(question_text = question.question_text, question_category= question.question_category, author=question.author)
    db.add(db_question)
    db.commit()
    response.status_code = status.HTTP_200_OK
    

    return {
        'message': "success",
        
    }
    # for choice in question.choice:
    #     db_choice = models.Choices(choice_text = choice.choice_text, is_correct=choice.is_correct, question_id=db_question.id)
    #     db.add(db_choice)
    # db.commit()

@router.delete("/{id}")
async def delete_question(id:int,response:Response,db:db_depedency):
    question = db.query(models.Questions).filter(models.Questions.id == id).first()

    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    
    db.delete(question)
    db.commit()

    response.status_code = status.HTTP_200_OK

    return {
        'message': "success"
    }