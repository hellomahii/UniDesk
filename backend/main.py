from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_db

from tickets import router as tickets_router
from users import router as users_router
from routing import router as routing_router
from students import router as students_router
from notices import router as notices_router
from fees import router as fees_router
from timetables import router as timetables_router
from exam_schedules import router as exam_schedules_router


app = FastAPI(title="UniDesk API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users_router)
app.include_router(tickets_router)
app.include_router(routing_router)
app.include_router(students_router)
app.include_router(notices_router)
app.include_router(fees_router)
app.include_router(timetables_router)
app.include_router(exam_schedules_router)


@app.get("/")
def home():
    return {
        "message": "UniDesk backend is running"
    }


@app.get("/test-db")
def test_db():
    db = get_db()
    cursor = db.cursor()

    cursor.execute("select database()")
    result = cursor.fetchone()

    cursor.close()
    db.close()

    return {
        "database": result[0]
    }