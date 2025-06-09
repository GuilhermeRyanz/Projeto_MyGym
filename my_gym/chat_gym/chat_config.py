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
