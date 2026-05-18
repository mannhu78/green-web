from api.extensions import db

class AnalyzeHistory(db.Model):

    __tablename__ = "analyze_history"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_email = db.Column(
        db.String(120),
        nullable=False
    )

    url = db.Column(
        db.String(500),
        nullable=False
    )

    performance_score = db.Column(
        db.Integer
    )

    co2 = db.Column(
        db.Float
    )

    green_label = db.Column(
        db.String(50)
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )