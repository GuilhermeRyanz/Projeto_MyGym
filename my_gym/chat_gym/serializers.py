class questionSerializer:
    def __init__(self, question):
        self.question = question

    def serialize(self):
        return {
            "id": self.question.id,
            "text": self.question.text,
            "created_at": self.question.created_at.isoformat(),
            "updated_at": self.question.updated_at.isoformat(),
        }

class SessionSerializer:
    def __init__(self, session):
        self.session = session

    def serialize(self):
        return {
            "id": self.session.id,
            "user_id": self.session.user.id,
            "session_id": self.session.session_id,
            "created_at": self.session.created_at.isoformat(),
            "updated_at": self.session.updated_at.isoformat(),
        }