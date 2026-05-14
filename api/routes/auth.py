from flask import Blueprint, request
from flask_jwt_extended import create_access_token

import bcrypt
import secrets

from api.models.user_model import User
from api.extensions import db
from api.models.history_model import AnalyzeHistory
from flask_mail import Message
from api.extensions import mail

auth_bp = Blueprint(
    "auth",
    __name__
)
reset_token = secrets.token_urlsafe(32)

# =========================
# Register
# =========================

@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:

        return {
            "error": "Email đã tồn tại"
        }, 400

    hashed_pw = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        username=username,
        email=email,
        password=hashed_pw
    )

    db.session.add(new_user)
    db.session.commit()

    return {
        "message": "Đăng ký thành công"
    }

# =========================
# Login
# =========================

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return {
            "error": "Không tìm thấy người dùng"
        }, 401

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):

        return {
            "error": "Sai mật khẩu"
        }, 401

    token = create_access_token(
        identity=email
    )

    return {

    "token": token,

    "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar
    }
}

# =========================
# Google Login
# =========================

@auth_bp.route(
    "/google-login",
    methods=["POST"]
)
def google_login():

    data = request.get_json()

    email = data.get("email")
    name = data.get("name")
    avatar = data.get("avatar")
    google_id = data.get("google_id")
    
    username = data.get("name")

    user = User.query.filter_by(
        email=email
    ).first()

    # Nếu chưa có thì tạo mới

    if not user:

        user = User(
            username=name,
            email=email,
            google_id=google_id,
            avatar=avatar
        )

        db.session.add(user)
        db.session.commit()

    # =========================
    # Nếu đã có thì update avatar
    # =========================

    else:

        user.avatar = avatar

        user.username = username

        db.session.commit()

    token = create_access_token(
        identity=email
    )

    return {

        "token": token,

        "user": {

            "id": user.id,

            "username":
                user.username,

            "email":
                user.email,

            "avatar":
                user.avatar
        }
    }

@auth_bp.route(
    "/history/<email>",
    methods=["GET"]
)
def get_history(email):

    histories = AnalyzeHistory.query.filter_by(
        user_email=email
    ).order_by(
        AnalyzeHistory.created_at.desc()
    ).all()

    result = []

    for item in histories:

        result.append({

            "id": item.id,

            "url": item.url,

            "performance_score":
                item.performance_score,

            "co2": item.co2,

            "green_label":
                item.green_label,

           "created_at":
                item.created_at.isoformat()
                    })

    return result

@auth_bp.route(
    "/forgot-password",
    methods=["POST"]
)
def forgot_password():

    data = request.get_json()

    email = data.get("email")

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:

        return {
            "error": "Email không tồn tại"
        }, 404

    reset_token = secrets.token_urlsafe(32)

    user.reset_token = reset_token

    db.session.commit()

    reset_link = (
        f"http://localhost:5173/reset-password/{reset_token}"
    )

    msg = Message(

        subject="Reset Password",

        sender="yourgmail@gmail.com",

        recipients=[email]
    )

    msg.body = f"""
Xin chào,

Click link bên dưới để đặt lại mật khẩu:

{reset_link}

Green Web Analyzer
"""

    mail.send(msg)

    return {
        "message": "Đã gửi email reset password"
    }

@auth_bp.route(
    "/reset-password",
    methods=["POST"]
)
def reset_password():

    data = request.get_json()

    token = data.get("token")

    password = data.get("password")

    user = User.query.filter_by(
        reset_token=token
    ).first()

    if not user:

        return {
            "error": "Token không hợp lệ"
        }, 400

    hashed_pw = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user.password = hashed_pw

    user.reset_token = None

    db.session.commit()

    return {
        "message": "Đổi mật khẩu thành công"
    }