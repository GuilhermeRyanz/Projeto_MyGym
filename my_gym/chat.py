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


    def ask_question(self, df):
        try:
            model = OllamaLLM(model="llama3:8b")
            prompt = ChatPromptTemplate.from_template(self.template)

            df_descricao = df.to_string(index=False)

            contexto_completo = f"{self.context}\n\nDados do DataFrame:\n{df_descricao}"

            chain = prompt | model
            result = chain.invoke({"context": contexto_completo, "question": self.question})

            return str(result)
        except Exception as e:
            return f"Erro ao processar a pergunta: {str(e)}"