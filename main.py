from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn
import models
from database import engine
from routers import question_router,choice_router, user_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ['http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials= True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(user_router.router, prefix="/api/v1/user")
app.include_router(question_router.router)
app.include_router(choice_router.router)

@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request, exc: RequestValidationError):
    custom_messages = []
    
    for error in exc.errors():
        field_name = ' -> '.join(str(loc) for loc in error['loc'][1:]) if len(error['loc']) > 1 else str(error['loc'][-1])
        error_type = error['type']
        
        # Custom message mapping
        if error_type == 'missing':
            message = f"{field_name} harus diisi"
        elif error_type == 'string_too_short':
            message = f"{field_name} harus diisi"
        elif error_type == 'type_error.integer':
            message = f"{field_name} must be a number"
        elif error_type == 'value_error.number.not_ge':
            message = f"{field_name} must be greater than or equal to {error['ctx']['limit_value']}"
        elif error_type == 'value_error.number.not_le':
            message = f"{field_name} must be less than or equal to {error['ctx']['limit_value']}"
        elif error_type == 'value_error.any_str.min_length':
            message = f"{field_name} must be at least {error['ctx']['limit_value']} characters long"
        elif error_type == 'value_error.any_str.max_length':
            message = f"{field_name} cannot exceed {error['ctx']['limit_value']} characters"
        elif error_type == 'value_error.str.regex':
            message = f"{field_name} format is invalid"
        else:
            message = f"{field_name}: {error['msg']} - {error['type']}"
        
        custom_messages.append({
            "field": field_name,
            "message": message,
            # "value": error.get('input', 'Not provided')
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "errors": custom_messages
        }
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)