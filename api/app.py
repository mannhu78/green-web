from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from api.routes.analyze import analyze_bp
from api.routes.auth import auth_bp

from api.extensions import db, mail

from dotenv import load_dotenv

from flask import send_from_directory

import sys
import os

BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

load_dotenv()

sys.path.append(BASE_DIR)

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "http://localhost:5173"
        }
    }
)

# =========================
# Config MySQL
# =========================

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL")

app.config[
    "SQLALCHEMY_TRACK_MODIFICATIONS"
] = False

# =========================
# JWT
# =========================

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY"
)

# =========================
# Mail Config
# =========================

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv(
    "MAIL_USERNAME"
)

app.config["MAIL_PASSWORD"] = os.getenv(
    "MAIL_PASSWORD"
)

# =========================
# Init Extension
# =========================

db.init_app(app)
mail.init_app(app)

jwt = JWTManager(app)

# =========================
# Register Blueprint
# =========================

app.register_blueprint(auth_bp)
app.register_blueprint(analyze_bp)

@app.route("/")
def home():

    return {
        "message": "Green Web API Running"
    }

@app.route(
    "/screenshots/<filename>"
)
def screenshots(filename):

    return send_from_directory(
        "screenshots",
        filename
    )

# =========================
# Create Table
# =========================

with app.app_context():
    db.create_all()

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )