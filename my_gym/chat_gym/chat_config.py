from langchain_openai import ChatOpenAI


import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

class IaConfig:

    llm = ChatOpenAI(
        openai_api_base=os.getenv("OPENROUTER_API_BASE"),
        openai_api_key=os.getenv("OPENROUTER_API_KEY"),
        model_name=os.getenv("OPENROUTER_MODEL_NAME"),
    )