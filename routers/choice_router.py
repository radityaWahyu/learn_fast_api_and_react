from fastapi import APIRouter, Response, HTTPException
import models
from database import db_depedency


router = APIRouter(prefix="/api/v1/choices", tags=["choices"],)

@router.get("/choices/{question_id}")
async def read_choice(question_id: int, db: db_depedency):
    result = db.query(models.Choices).filter(models.Choices.question_id == question_id).all()

    if not result:
        raise HTTPException(status_code=404, detail="Choice not found")
    
    return result

