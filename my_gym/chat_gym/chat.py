import re

import pandas as pd
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain

from .SQLbasecontext import CustomTableInfo
from aluno.models import AlunoPlano
from chat_gym import chat_config


class IaGestor:
    def __init__(self, academia_id: int, user_question: str):
        self.academia_id = academia_id
        self.user_question = user_question

    def generate_query_with_academia_context(self) -> str:
        context = (
            f"O ID da academia é {self.academia_id}. "
            "Em todas as consultas, considere apenas registros relacionados a essa academia. "
            "As tabelas se relacionam conforme descrito a seguir:\n\n"
            f"{CustomTableInfo.Base}\n\n"
            "Agora, responda à seguinte pergunta:\n"
        )
        return f"{context}{self.user_question}"

    @staticmethod
    def clean_sql_query(query: str) -> str:
        return re.sub(r'```sql|```', '', query).strip()

    def run(self):
        db_uri = "postgresql+psycopg2://my_gym:123@localhost:5438/my_gym"

        db = SQLDatabase.from_uri(
            db_uri,
            include_tables=[
                'aluno',
                'plano',
                'aluno_plano',
                'produto',
                'venda',
                'pagamento',
                'usuario',
                'academia',
                'item_venda'
            ],
            sample_rows_in_table_info=10,
        )

        llm = chat_config.IaConfig.llm

        db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)

        query = self.generate_query_with_academia_context()

        result = db_chain.invoke(query, return_intermediate_steps=True)

        return result


class IaPersona:
    def __init__(self, academia_id: int, user_question: str, member_id: int):
        self.academia_id = academia_id
        self.user_question = user_question
        self.member_id = member_id

    def get_member_data(self):
        data = AlunoPlano.objects.filter(
            aluno_id=self.member_id,
            plano__academia=self.academia_id,
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

    def generate_query_with_academia_context(self) -> str:
        context = (
            "Você é um personal trainer responsável por auxiliar membros de academias que utilizam o sistema de gestão MyGym. "
            "Com base nos dados do aluno e seu plano:\n\n"
            f"{self.get_member_data()}\n\n"
            "Agora, responda à seguinte pergunta de manaeira humana e sem expor dados desnecessarios sobre o banco de dados do sistema, apenas oque o for necessario\n"
        )
        return f"{context}{self.user_question}"

    def run(self):
        llm = chat_config.IaConfig.llm

        query = self.generate_query_with_academia_context()

        result = llm.invoke(query)

        return result
