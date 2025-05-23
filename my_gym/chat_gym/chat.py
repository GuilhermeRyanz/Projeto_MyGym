from tempfile import template

from click import prompt
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

from chat_gym.templates import LlmTemplates

llm = OpenAI(openai_api_key="teu cu")

template = """
    You are an AI assistant with expertise in data analysis and automation. Answer the following question:
    Question: {question}
    """

prompt = PromptTemplate(template=template, input_variables=["question"])
chain = LLMChain(llm=llm, prompt=prompt)

query = "What is the impact of AI in healthcare?"

response = chain.run(question=query)
print(f"Agent Response: {response}")