from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/fees")
def get_fees():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from fees")
    fees = cursor.fetchall()

    cursor.close()
    db.close()

    return fees


@router.post("/fees")
def add_fee(fee: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into fees
        (
            enrollment_number,
            name,
            email,
            phone,
            department,
            year_sem,
            batch,
            accommodation,
            total_fee,
            paid_amount,
            pending_dues,
            payment_status,
            due_date
        )
        values
        (
            %s, %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s
        )
    """

    values = (
        fee["enrollment_number"],
        fee["name"],
        fee["email"],
        fee["phone"],
        fee["department"],
        fee["year_sem"],
        fee["batch"],
        fee["accommodation"],
        fee["total_fee"],
        fee["paid_amount"],
        fee["pending_dues"],
        fee["payment_status"],
        fee["due_date"]
    )

    cursor.execute(query, values)
    db.commit()

    fee_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "fee record added",
        "id": fee_id
    }


@router.put("/fees/{fee_id}")
def update_fee(
    fee_id: int,
    fee: dict
):
    db = get_db()
    cursor = db.cursor()

    query = """
        update fees
        set enrollment_number = %s,
            name = %s,
            email = %s,
            phone = %s,
            department = %s,
            year_sem = %s,
            batch = %s,
            accommodation = %s,
            total_fee = %s,
            paid_amount = %s,
            pending_dues = %s,
            payment_status = %s,
            due_date = %s
        where id = %s
    """

    values = (
        fee["enrollment_number"],
        fee["name"],
        fee["email"],
        fee["phone"],
        fee["department"],
        fee["year_sem"],
        fee["batch"],
        fee["accommodation"],
        fee["total_fee"],
        fee["paid_amount"],
        fee["pending_dues"],
        fee["payment_status"],
        fee["due_date"],
        fee_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "fee record updated"
    }


@router.delete("/fees/{fee_id}")
def delete_fee(fee_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from fees where id = %s",
        (fee_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "fee record deleted"
    }