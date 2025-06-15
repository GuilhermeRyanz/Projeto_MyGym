import json
import os
import re
from typing import Optional, Union, TypedDict

import pandas as pd
from django.db.models import QuerySet
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_core.prompts import ChatPromptTemplate
from langchain_experimental.sql import SQLDatabaseChain

from academia.models import UsuarioAcademia
from aluno.models import AlunoPlano
from chat_gym import chat_config
from usuario.models import Usuario
from .agent_functions import get_exercise
from .models import Questions

load_dotenv()


class State(TypedDict):
    question: str
    query: str
    result: str
    answer: str


system_message = """
Dada uma pergunta de entrada, crie uma consulta SQL sintaticamente correta no dialeto {dialect}
para ajudar a encontrar a resposta. Limite sua consulta para no máximo {top_k} resultados,
a menos que o usuário peça explicitamente mais resultados. 

NUNCA selecione todas as colunas de uma tabela. Escolha apenas as relevantes de acordo com a pergunta.
NUNCA faça consultaS que possam retornar dados de academia com id diferentes da fornecida pelo usuario.
SE a tabela necessaria para responder a pergunta nao se ligar diretamente a academia informada, tente usar joins em tabelas que se relacionem diretamente com academia.

EXEMPLO DE CONSULTAS USANDO JOINS:

SELECT AVG(p.valor)
FROM pagamento p
JOIN aluno_plano ap ON p.aluno_plano = ap.id
JOIN plano pl ON ap.plano = pl.id
WHERE pl.academia = 1
  AND DATE_TRUNC('month', p.data_pagamento) = DATE_TRUNC('month', CURRENT_DATE);


Use apenas as tabelas a seguir:
{table_info}
"""

user_prompt = "Pergunta: {input}"

query_prompt_template = ChatPromptTemplate(
    [("system", system_message), ("user", user_prompt)]
)



def sanitize_query(query: str) -> str:
    """
    Extrai apenas a consulta SQL do texto gerado, removendo explicações e blocos markdown.
    """
    # Tenta extrair o bloco entre ```sql ... ```
    match = re.search(r"```sql\s*(.*?)\s*```", query, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    lines = query.splitlines()
    sql_lines = []
    start = False
    for line in lines:
        if re.match(r"^\s*(SELECT|WITH|INSERT|UPDATE|DELETE)\b", line, re.IGNORECASE):
            start = True
        if start:
            sql_lines.append(line)
    return "\n".join(sql_lines).strip()

class IaGestor:
    def __init__(self, user_id: int, academia_id: int, user_question: str):
        self.user_id = user_id
        self.academia_id = academia_id
        self.user_question = user_question

        self.db_uri = os.getenv("DATABASE_URI", "postgresql+psycopg2://my_gym:123@localhost:5438/my_gym")
        self.db = self.init_database()
        self.llm = chat_config.IaLangChainConfig.llm

    def check_user_access(self) -> bool:
        """
        Verifica se o usuário tem acesso à academia.
        Retorna True se tiver acesso, False caso contrário.
        """
        try:
            user = Usuario.objects.get(id=self.user_id)
            return UsuarioAcademia.objects.filter(id=self.academia_id, usuario=user, active=True).exists()
        except Exception:
            return False

    def init_database(self) -> SQLDatabase:
        """Inicializa e retorna a conexão com o banco de dados."""
        try:
            return SQLDatabase.from_uri(
                self.db_uri,
                include_tables=[
                    'aluno',
                    'plano',
                    'aluno_plano',
                    'produto',
                    'venda',
                    'pagamento',
                    'usuario',
                    'academia',
                    'item_venda',
                ],
                sample_rows_in_table_info=10,
            )
        except Exception as e:
            raise ValueError(f"Erro ao conectar ao banco de dados: {str(e)}")

    def generate_query_prompt(self, state: State) -> str:
        """Gera o prompt para o modelo de linguagem baseado na pergunta."""
        try:
            print(f"Gerando prompt para a questão: {state['question']}")
            if not self.db:
                raise ValueError("Banco de dados não está inicializado ou acessível.")

            db_dialect = self.db.dialect
            print(f"Dialeto do banco: {db_dialect}")

            table_info = self.db.get_table_info()
            print(f"Informações das tabelas disponíveis: {table_info}")

            # Gera o prompt e extrai o texto corretamente
            prompt_obj = query_prompt_template.invoke({
                "dialect": db_dialect,
                "top_k": 10,
                "table_info": table_info,
                "input": state["question"],
                "academia_id": self.academia_id,
            })
            # Tente acessar .to_string() ou .content
            prompt_str = getattr(prompt_obj, "to_string", None)
            if callable(prompt_str):
                prompt_str = prompt_obj.to_string()
            else:
                prompt_str = getattr(prompt_obj, "content", str(prompt_obj))

            print(f"Prompt gerado pelo modelo: {prompt_str}")
            sanitized_query = sanitize_query(prompt_str)
            print(f"Prompt sanitizado: {sanitized_query}")

            return sanitized_query
        except Exception as e:
            raise ValueError(f"Erro ao gerar o prompt de consulta SQL: {str(e)}")

    def run_query(self, query: str) -> dict:
        """Executa uma consulta SQL gerada."""
        try:
            print("Criando db_chain...")
            db_chain = SQLDatabaseChain.from_llm(self.llm, self.db, verbose=True)
            print("Invocando query:", query)
            result = db_chain.invoke(query, return_intermediate_steps=True)
            print("Resultado:", result)
            return result
        except Exception as e:
            raise ValueError(f"Erro ao executar a consulta SQL: {str(e)}")

    def generate_answer(self, state: State) -> str:
        """Gera uma resposta baseada na consulta SQL e resultado."""
        try:
            prompt = (
                "Dada a pergunta do usuário, a consulta SQL correspondente e o resultado SQL, responda a pergunta.\n\n"
                f'Pergunta: {state["question"]}\n'
                f'Consulta SQL: {state["query"]}\n'
                f'Resultado SQL: {state["result"]}'
            )
            response = self.llm.invoke(prompt)
            return response.content
        except Exception as e:
            return f"Erro ao gerar resposta: {str(e)}"

    def run(self) -> Union[str, dict]:
        try:
            if not self.check_user_access():
                return {"error": "Usuário não tem acesso a esta academia."}

            state = State(
                question=self.user_question,
                query="",
                result="",
                answer=""
            )

            state["query"] = self.generate_query_prompt(state)
            query_result = self.run_query(state["query"])
            state["result"] = query_result
            state["answer"] = self.generate_answer(state)
            return state
        except Exception as e:
            return {"error": f"Erro ao processar requisição: {str(e)}"}


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
            "Use this information to sugerir ou montar planos de treino personalizados, caso a pergunta envolva rotinas de treino. "
            "Evite responder com informações genéricas. "
            "Respond in Brazilian Portuguese and only call functions when explicitly required by the question. "
            "The days of weeke in member data follow this order 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sabado"
            "Now, respond to the following question:"
            f"last 3 chats with user {self.get_last_questions()}"
        )
        return f"{context}\n{self.user_question}"

    def _call_function(self, name: str, args: dict) -> Optional[str]:
        try:
            if name == "get_exercise":
                if not any(args.values()):
                    return "Por favor, especifique o nome do exercício, grupo muscular ou equipamento."
                return get_exercise(**args)
            elif name == "get_member_data":
                return self.get_member_data()
            else:
                return f"Função {name} não reconhecida."
        except Exception as e:
            return f"Erro ao executar função {name}: {str(e)}"

    def _preprocess_question(self) -> Optional[str]:
        exercise_keywords = ["exercício", "como fazer", "treino", "músculo", "equipamento", "fazer", "treinar"]
        member_keywords = ["meu plano", "minha conta", "benefícios do meu plano", "dias permitidos"]

        if any(keyword in self.user_question for keyword in exercise_keywords):
            return "get_exercise"
        elif any(keyword in self.user_question for keyword in member_keywords):
            return "get_member_data"
        return None

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_exercise",
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
                                  "description": "Exercise name in Portuguese (sem acentos, ex.: Elevacao Pelvica)"},
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
