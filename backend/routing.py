from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/routing")
def get_routing():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from routing")
    records = cursor.fetchall()

    cursor.close()
    db.close()

    return records


@router.post("/routing")
def add_routing(record: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into routing
        (
            student_request,
            detected_intent,
            department,
            routing_decision
        )
        values (%s, %s, %s, %s)
    """

    values = (
        record["student_request"],
        record["detected_intent"],
        record["department"],
        record["routing_decision"]
    )

    cursor.execute(query, values)
    db.commit()

    record_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "routing record added",
        "id": record_id
    }


@router.put("/routing/{routing_id}")
def update_routing(
    routing_id: int,
    record: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update routing
        set student_request = %s,
            detected_intent = %s,
            department = %s,
            routing_decision = %s
        where id = %s
    """

    values = (
        record["student_request"],
        record["detected_intent"],
        record["department"],
        record["routing_decision"],
        routing_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "routing record updated"
    }


@router.delete("/routing/{routing_id}")
def delete_routing(routing_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from routing where id = %s",
        (routing_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "routing record deleted"
    }