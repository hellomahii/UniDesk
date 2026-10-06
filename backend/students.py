from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/students")
def get_students():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from students")
    students = cursor.fetchall()

    cursor.close()
    db.close()

    return students


@router.post("/students")
def add_student(student: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into students
        (
            enrollment_number,
            name,
            email,
            phone,
            department,
            year_sem,
            batch,
            accommodation
        )
        values (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        student["enrollment_number"],
        student["name"],
        student["email"],
        student["phone"],
        student["department"],
        student["year_sem"],
        student["batch"],
        student["accommodation"]
    )

    cursor.execute(query, values)
    db.commit()

    student_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "student added",
        "id": student_id
    }


@router.put("/students/{student_id}")
def update_student(
    student_id: int,
    student: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update students
        set enrollment_number = %s,
            name = %s,
            email = %s,
            phone = %s,
            department = %s,
            year_sem = %s,
            batch = %s,
            accommodation = %s
        where id = %s
    """

    values = (
        student["enrollment_number"],
        student["name"],
        student["email"],
        student["phone"],
        student["department"],
        student["year_sem"],
        student["batch"],
        student["accommodation"],
        student_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "student updated"
    }


@router.delete("/students/{student_id}")
def delete_student(student_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from students where id = %s",
        (student_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "student deleted"
    }