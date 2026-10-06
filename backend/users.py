from fastapi import APIRouter
from database import get_db

router = APIRouter()


@router.get("/users")
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("select * from users")
    users = cursor.fetchall()

    cursor.close()
    db.close()

    return users


@router.post("/users")
def add_user(user: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        insert into users
        (user_email, password_hash, department, role)
        values (%s, %s, %s, %s)
    """

    values = (
        user["user_email"],
        user["password_hash"],
        user.get("department"),
        user.get("role")
    )

    cursor.execute(query, values)
    db.commit()

    user_id = cursor.lastrowid

    cursor.close()
    db.close()

    return {
        "message": "user added",
        "id": user_id
    }


@router.put("/users/{user_id}")
def update_user(user_id: int, user: dict):
    db = get_db()
    cursor = db.cursor()

    query = """
        update users
        set user_email = %s,
            password_hash = %s,
            department = %s,
            role = %s
        where id = %s
    """

    values = (
        user["user_email"],
        user["password_hash"],
        user.get("department"),
        user.get("role"),
        user_id
    )

    cursor.execute(query, values)
    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "user updated"
    }


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "delete from users where id = %s",
        (user_id,)
    )

    db.commit()

    cursor.close()
    db.close()

    return {
        "message": "user deleted"
    }