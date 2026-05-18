from api.extensions import db

class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.String(100)
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255)
    )

    google_id = db.Column(
        db.String(255)
    )

    avatar = db.Column(
        db.String(500)
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
    reset_token = db.Column(
    db.String(255)
    )

    reset_token_expire = db.Column(
        db.DateTime
    )
