from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/notices")
def get_notices():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from notices")
    notices = cursor.fetchall()

    cursor.close()
    db.close()

    return notices


@router.post("/notices")
def add_notice(notice: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into notices
        (
            title,
            description,
            category,
            audience,
            published_date,
            expiry_date,
            status,
            department
        )
        values (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        notice["title"],
        notice["description"],
        notice["category"],
        notice["audience"],
        notice["published_date"],
        notice["expiry_date"],
        notice["status"],
        notice["department"]
    )

    cursor.execute(query, values)
    db.commit()

    notice_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "notice added",
        "id": notice_id
    }


@router.put("/notices/{notice_id}")
def update_notice(
    notice_id: int,
    notice: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update notices
        set title = %s,
            description = %s,
            category = %s,
            audience = %s,
            published_date = %s,
            expiry_date = %s,
            status = %s,
            department = %s
        where id = %s
    """

    values = (
        notice["title"],
        notice["description"],
        notice["category"],
        notice["audience"],
        notice["published_date"],
        notice["expiry_date"],
        notice["status"],
        notice["department"],
        notice_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "notice updated"
    }


@router.delete("/notices/{notice_id}")
def delete_notice(notice_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from notices where id = %s",
        (notice_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "notice deleted"
    }