import json
import os
from typing import Optional, Union

from django.db.models import QuerySet
import pandas as pd
from dotenv import load_dotenv
from aluno.models import AlunoPlano
from chat_gym import chat_config
from .agent_functions import get_exercice
from .models import Questions

load_dotenv()

class IaPersona:
    def __init__(self, user_question: str, member_id: int, aluno_id: int):
        self.user_question = user_question.lower()
        self.member_id = member_id
        self.aluno_id = aluno_id

    def get_last_questions(self, limit: int = 3) -> Optional[str]:
        """
        Retorna as três últimas perguntas e respostas do usuário, formatadas como string.

        Args:
            limit (int): Número máximo de perguntas a retornar (padrão: 3).

        Returns:
            Optional[str]: String com as perguntas e respostas formatadas, ou None se não houver dados.
        """
        data: QuerySet = Questions.objects.filter(
            usuario=self.member_id,
            active=True
        ).values(
            'question',
            'answer',
            'created_at'
        ).order_by('-created_at')[:limit]

        if data:
            return str(data)
        else:
            return None


    def get_member_data(self):
        try:
            data = AlunoPlano.objects.filter(
                aluno=self.aluno_id,
                active=True
            ).values(
                'aluno__nome',
                'plano__nome',
                'plano__dias_permitidos',
                'plano__beneficios',
            )
            if not data.exists():
                return "Nenhum dado encontrado para esse aluno."
            df = pd.DataFrame(list(data))
            return df.to_string(index=False)
        except Exception as e:
            return f"Erro ao buscar dados do aluno: {str(e)}"

    def generate_query_with_academia_context(self) -> str:
        member_data = self.get_member_data()
        context = (
            "You are a helpful personal trainer responsible for assisting gym members who use the MyGym management system. "
            f"Member data: {member_data}. "
            "Use this information to personalize responses when relevant. "
            "Respond in Brazilian Portuguese and only call functions when explicitly required by the question. "
            "Now, respond to the following question:"
            f"last 3 chats with user {self.get_last_questions()}"
        )
        return f"{context}\n{self.user_question}"

    def _call_function(self, name: str, args: dict) -> Optional[str]:
        try:
            if name == "get_exercice":
                if not any(args.values()):
                    return "Por favor, especifique o nome do exercício, grupo muscular ou equipamento."
                return get_exercice(**args)
            elif name == "get_member_data":
                return self.get_member_data()
            else:
                return f"Função {name} não reconhecida."
        except Exception as e:
            return f"Erro ao executar função {name}: {str(e)}"

    def _preprocess_question(self) -> Optional[str]:
        exercise_keywords = ["exercício", "como fazer", "treino", "músculo", "equipamento", "fazer", "treinar"]
        member_keywords = ["plano", "benefícios", "dias", "minha conta", "cadastro"]

        if any(keyword in self.user_question for keyword in exercise_keywords):
            return "get_exercice"
        elif any(keyword in self.user_question for keyword in member_keywords):
            return "get_member_data"
        return None

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_exercice",
                "description": (
                    "Fetches exercise data from the MyGym database. Use ONLY for questions requesting exercise recommendations or "
                    "details based on exercise title, muscle group, or equipment. "
                    "Example user questions: 'Which exercises target the glutes?', 'What can I do using the leg press machine?' "
                    "Do NOT use this function if the question is unrelated to exercises."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string",
                                  "description": "Exercice name in Portuguese (sem acentos, ex.: Elevacao Pelvica)"},
                        "muscle_group": {"type": "string",
                                         "description": "Muscle Group in Portuguese (sem acentos, ex.: Gluteos)"},
                        "equipment": {"type": "string"},
                    },
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            }
        },
        {
            "type": "function",
            "function": {
                "name": "get_member_data",
                "description": (
                    "Fetches data about the member who asked the question, including name, plan, allowed days, and benefits. "
                    "Use ONLY for questions related to the student's personal plan details or membership information."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": [],
                    "additionalProperties": False
                },
                "strict": True
            }
        }
    ]

    def run(self):
        llm = chat_config.IaConfig.llm
        messages = [
            {"role": "system", "content": self.generate_query_with_academia_context()},
            {"role": "user", "content": self.user_question},
        ]

        try:
            suggested_function = self._preprocess_question()

            completion = llm.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL_NAME"),
                messages=messages,
                tools=self.tools,
                tool_choice="auto" if not suggested_function else {"type": "function",
                                                                   "function": {"name": suggested_function}}
            )

            message = completion.choices[0].message

            if message.tool_calls:
                for tool_call in message.tool_calls:
                    name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    messages.append(message)

                    result = self._call_function(name, args)
                    messages.append(
                        {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)}
                    )

                completion_2 = llm.chat.completions.create(
                    model=os.getenv("OPENROUTER_MODEL_NAME"),
                    messages=messages,
                    tools=self.tools,
                )
                final_response = completion_2.choices[0].message
                return final_response.content
            else:
                completion_2 = llm.chat.completions.create(
                    model=os.getenv("OPENROUTER_MODEL_NAME"),
                    messages=messages,
                    tools=self.tools,
                )
                final_response = completion_2.choices[0].message
                return final_response.content

        except Exception as e:
            error_message = f"Desculpe, ocorreu um erro: {str(e)}"
            return error_message