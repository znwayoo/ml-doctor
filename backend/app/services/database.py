from app import db

# Initialize database object

class Prediction(db.Model):
    """Table to store user predictions."""
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    user_input = db.Column(db.JSON, nullable=False)
    model_predictions = db.Column(db.JSON, nullable=False)

    def __init__(self, user_input, model_predictions):
        self.user_input = user_input
        self.model_predictions = model_predictions

    def save(self):
        """Save prediction to database."""
        db.session.add(self)
        db.session.commit()

