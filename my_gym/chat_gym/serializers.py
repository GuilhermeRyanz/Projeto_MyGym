class ChatSerializer:
    def __init__(self, chat):
        self.chat = chat

    def serialize(self):
        return {
            "id": self.chat.id,
            "name": self.chat.name,
            "messages": [message.serialize() for message in self.chat.messages],
        }