from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/exam-schedules")
def get_exam_schedules():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from exam_schedules")
    exams = cursor.fetchall()

    cursor.close()
    db.close()

    return exams


@router.post("/exam-schedules")
def add_exam_schedule(exam: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into exam_schedules
        (
            year,
            batch,
            department,
            sub_department,
            section,
            subject,
            subject_code,
            exam_date,
            day,
            time_window,
            assigned_hall,
            target_cohort,
            invigilator
        )
        values
        (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s
        )
    """

    values = (
        exam["year"],
        exam["batch"],
        exam["department"],
        exam["sub_department"],
        exam["section"],
        exam["subject"],
        exam["subject_code"],
        exam["exam_date"],
        exam["day"],
        exam["time_window"],
        exam["assigned_hall"],
        exam["target_cohort"],
        exam["invigilator"]
    )

    cursor.execute(query, values)
    db.commit()

    exam_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "exam schedule added",
        "id": exam_id
    }


@router.put("/exam-schedules/{exam_id}")
def update_exam_schedule(
    exam_id: int,
    exam: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update exam_schedules
        set year = %s,
            batch = %s,
            department = %s,
            sub_department = %s,
            section = %s,
            subject = %s,
            subject_code = %s,
            exam_date = %s,
            day = %s,
            time_window = %s,
            assigned_hall = %s,
            target_cohort = %s,
            invigilator = %s
        where id = %s
    """

    values = (
        exam["year"],
        exam["batch"],
        exam["department"],
        exam["sub_department"],
        exam["section"],
        exam["subject"],
        exam["subject_code"],
        exam["exam_date"],
        exam["day"],
        exam["time_window"],
        exam["assigned_hall"],
        exam["target_cohort"],
        exam["invigilator"],
        exam_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "exam schedule updated"
    }


@router.delete("/exam-schedules/{exam_id}")
def delete_exam_schedule(exam_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from exam_schedules where id = %s",
        (exam_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "exam schedule deleted"
    }