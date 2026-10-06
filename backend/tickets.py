from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/tickets")
def get_tickets():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from tickets")
    tickets = cursor.fetchall()

    cursor.close()
    db.close()

    return tickets


@router.post("/tickets")
def add_ticket(ticket: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into tickets
        (ticket_no, raised_by, subject, category, assigned_to, status, note, department)
        values (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        ticket["ticket_no"],
        ticket["raised_by"],
        ticket["subject"],
        ticket.get("category"),
        ticket.get("assigned_to"),
        ticket.get("status", "open"),
        ticket.get("note"),
        ticket.get("department", "general")
    )

    cursor.execute(query, values)
    db.commit()

    ticket_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {"message": "ticket added", "id": ticket_id}


@router.put("/tickets/{ticket_id}")
def update_ticket(ticket_id: int, ticket: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        update tickets
        set ticket_no = %s,
            raised_by = %s,
            subject = %s,
            category = %s,
            assigned_to = %s,
            status = %s,
            note = %s,
            department = %s
        where id = %s
    """

    values = (
        ticket["ticket_no"],
        ticket["raised_by"],
        ticket["subject"],
        ticket.get("category"),
        ticket.get("assigned_to"),
        ticket.get("status", "open"),
        ticket.get("note"),
        ticket.get("department", "general"),
        ticket_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {"message": "ticket updated"}


@router.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from tickets where id = %s",
        (ticket_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {"message": "ticket deleted"}