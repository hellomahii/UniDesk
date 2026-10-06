from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/timetables")
def get_timetables():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from timetables")
    timetables = cursor.fetchall()

    cursor.close()
    db.close()

    return timetables


@router.post("/timetables")
def add_timetable(timetable: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into timetables
        (
            year,
            batch,
            department,
            sub_department,
            section,
            day,
            time,
            subject,
            faculty,
            room
        )
        values
        (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s
        )
    """

    values = (
        timetable["year"],
        timetable["batch"],
        timetable["department"],
        timetable["sub_department"],
        timetable["section"],
        timetable["day"],
        timetable["time"],
        timetable["subject"],
        timetable["faculty"],
        timetable["room"]
    )

    cursor.execute(query, values)
    db.commit()

    timetable_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "timetable added",
        "id": timetable_id
    }


@router.put("/timetables/{timetable_id}")
def update_timetable(
    timetable_id: int,
    timetable: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update timetables
        set year = %s,
            batch = %s,
            department = %s,
            sub_department = %s,
            section = %s,
            day = %s,
            time = %s,
            subject = %s,
            faculty = %s,
            room = %s
        where id = %s
    """

    values = (
        timetable["year"],
        timetable["batch"],
        timetable["department"],
        timetable["sub_department"],
        timetable["section"],
        timetable["day"],
        timetable["time"],
        timetable["subject"],
        timetable["faculty"],
        timetable["room"],
        timetable_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "timetable updated"
    }


@router.delete("/timetables/{timetable_id}")
def delete_timetable(timetable_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from timetables where id = %s",
        (timetable_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "timetable deleted"
    }