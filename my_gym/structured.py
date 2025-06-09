import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

llm = OpenAI(
        base_url=os.getenv("OPENROUTER_API_BASE"),
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )

class CalendarEvents(BaseModel):
    name: str
    date: str
    partitions: list[str]

completion = llm.beta.chat.completions.parse(
    model=os.getenv("OPENROUTER_MODEL_NAME"),
    messages=[
        {"role": "system", "content": "extract the event information."},
        {
            "role": "user",
            "content": "Alice and bob are going to a science fair on Friday."
        },
    ],
    response_format=CalendarEvents,
)

print(completion.model_dump())

event = completion.choices[0].message.parsed
print(event.name)
print(event.date)
print(event.partitions)