from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

class Chat():
    def __init__(self, context, question):
        self.context = context
        self.question = question
        self.template = ""

        self.template = """

        Responda a questao abaixo.

        Este é um o seu contexto {context}

        Pergunta: {question}

        Resposta: 

        """

    def ask_question(self):
        model = OllamaLLM(model="llama3")
        prompt = ChatPromptTemplate.from_template(self.template)
        chain = prompt | model
        result = chain.invoke({"context": f"{self.context}", "question": f"{self.question}"})

        return f"{result}"