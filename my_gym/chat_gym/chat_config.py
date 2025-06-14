from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class IaConfig:

    llm = OpenAI(
        base_url=os.getenv("OPENROUTER_API_BASE"),
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

class IaLangChainConfig:
    llm = ChatOpenAI(
        openai_api_base=os.getenv("OPENROUTER_API_BASE"),
        openai_api_key=os.getenv("OPENROUTER_API_KEY"),
        model_name=os.getenv("OPENROUTER_MODEL_NAME"),
    )
