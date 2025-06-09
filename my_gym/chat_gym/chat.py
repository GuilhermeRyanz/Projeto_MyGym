import json
import os
import re
from types import NoneType

import pandas as pd
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from pydantic import BaseModel, Field

from .SQLbasecontext import CustomTableInfo
from aluno.models import AlunoPlano
from chat_gym import chat_config
from .agent_functions import get_exercice

load_dotenv()

class ExerciceResponse(BaseModel):
    exercice: str = Field(
        description="The exercice is."
    )
    response: str = Field(
        description="A natural language response to the user's question in Brazilian Portuguese."
    )

class MemberData(BaseModel):
    data: str = Field(
        description="The menber data is"
    )
    response: str = Field(
        description="A natural language response to the user's question in Brazilian Portuguese."
    )

class NormalResponseData(BaseModel):
    response: str = Field(
        description="A natural language response to the user's question in Brazilian Portuguese."
    )

# class IaGestor:
#     def __init__(self, academia_id: int, user_question: str):
#         self.academia_id = academia_id
#         self.user_question = user_question
#
#     def generate_query_with_academia_context(self) -> str:
#         context = (
#             f"O ID da academia é {self.academia_id}. "
#             "Em todas as consultas, considere apenas registros relacionados a essa academia. "
#             "As tabelas se relacionam conforme descrito a seguir:\n\n"
#             f"{CustomTableInfo.Base}\n\n"
#             "Agora, responda à seguinte pergunta:\n"
#         )
#         return f"{context}{self.user_question}"
#
#     @staticmethod
#     def clean_sql_query(query: str) -> str:
#         return re.sub(r'```sql|```', '', query).strip()
#
#     def run(self):
#         db_uri = "postgresql+psycopg2://my_gym:123@localhost:5438/my_gym"
#
#         db = SQLDatabase.from_uri(
#             db_uri,
#             include_tables=[
#                 'aluno',
#                 'plano',
#                 'aluno_plano',
#                 'produto',
#                 'venda',
#                 'pagamento',
#                 'usuario',
#                 'academia',
#                 'item_venda'
#             ],
#             sample_rows_in_table_info=10,
#         )
#
#         llm = chat_config.IaConfig.llm
#
#         db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)
#
#         query = self.generate_query_with_academia_context()
#
#         result = db_chain.invoke(query, return_intermediate_steps=True)
#
#         return result


class IaPersona:
    def __init__(self, user_question: str, member_id: int, aluno_id:int):
        self.user_question = user_question
        self.member_id = member_id
        self.aluno_id = aluno_id

    def get_member_data(self):
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

    def chooseResponse(self, function_name):
        if function_name == 'get_member_data':
            return ExerciceResponse
        elif function_name == 'get_member_data':
            return MemberData
        else:
            return NormalResponseData



    def generate_query_with_academia_context(self) -> str:
        context = (
            "You are a helpful personal trainer responsible for assisting gym members who use the MyGym management system."
        )
        return f"{context}"


    def _call_function(self, name, args):
        if name == "get_exercice":
            return get_exercice(**args)
        if name == "get_member_data":
            return self.get_member_data()

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_exercice",
                "description": (
                    "Obtém dados de exercícios específicos do banco de dados MyGym. "
                    "Use SOMENTE para perguntas que solicitam recomendações ou informações sobre exercícios, com base em nome, grupo muscular ou equipamento. "
                    "Os parâmetros devem ser em português brasileiro, sem acentos (ex.: 'Elevacao Pelvica', 'Gluteos'), e conter apenas os dados fornecidos pela pergunta, não adicione parametros para os quais o usuario não forneceu inteiramente, Ex: se o usuario não falou qual o grupo musculoa nao adicione esse parametro."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Nome do exercício (sem acentos, ex.: Elevacao Pelvica)"
                        },
                        "muscle_group": {
                            "type": "string",
                            "description": "Grupo muscular alvo (sem acentos, ex.: Gluteos)"
                        },
                        "equipment": {
                            "type": "string",
                        }
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
                    "Obtém dados do aluno que fez a pergunta, incluindo nome, plano, dias permitidos e benefícios. "
                    "Use SOMENTE para perguntas sobre informações pessoais do aluno ou detalhes do plano."
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
        global respType
        llm = chat_config.IaConfig.llm

        messages = [
            {"role": "system", "content": self.generate_query_with_academia_context()},
            {"role": "user", "content": self.user_question},
        ]

        try:
            completion = llm.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL_NAME"),
                messages=messages,
                tools=self.tools
            )

            message = completion.choices[0].message
            if message.tool_calls:
                for tool_call in message.tool_calls:
                    name = tool_call.function.name
                    respType = self.chooseResponse(name)
                    args = json.loads(tool_call.function.arguments)
                    messages.append(message)

                    result = self._call_function(name, args)
                    messages.append(
                        {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)}
                    )

                completion_2 = llm.beta.chat.completions.parse(
                    model=os.getenv("OPENROUTER_MODEL_NAME"),
                    messages=messages,
                    tools=self.tools,
                    response_format=respType
                )
                final_response = completion_2.choices[0].message.parsed
                return final_response.response
            else:
                completion_2 = llm.beta.chat.completions.parse(
                    model=os.getenv("OPENROUTER_MODEL_NAME"),
                    messages=messages,
                    tools=self.tools,
                    response_format=NormalResponseData
                )
                final_response = completion_2.choices[0].message.parsed
                return final_response.response

        except Exception as e:
            print(f"Erro na execução: {e}")
            return f"Desculpe, ocorreu um erro: {str(e)}"

