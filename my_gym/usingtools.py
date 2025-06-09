import json
import os

import requests
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv()

llm = OpenAI(
    base_url=os.getenv("OPENROUTER_API_BASE"),
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def get_weather(latitude, longitude):
    """This is a publically available API that returns the weather for a given location."""
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    return data["current"]




tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current temperature for provided coordinates in celsius.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {"type": "number"},
                    "longitude": {"type": "number"},
                },
                "required": ["latitude", "longitude"],
                "additionalProperties": False,
            },
            "strict": True,
        },
    }
]


system_prompt = "You are a helpful weather assistant."

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "What's the weather like in Manaus today?"},
]

completion = llm.chat.completions.create(
    model=os.getenv("OPENROUTER_MODEL_NAME"),
    messages=messages,
    tools=tools,
)

print(completion.model_dump())

def call_function(name, args):
    if name == "get_weather":
        return get_weather(**args)

for tool_call in completion.choices[0].message.tool_calls:
    name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)
    messages.append(completion.choices[0].message)

    result = call_function(name, args)
    messages.append(
        {"role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result)}
    )
    print(result)

class WeatherResponse(BaseModel):
    temperature: float = Field(
        description="The current temperature in celsius for the given location."
    )
    response: str = Field(
        description="A natural language response to the user's question."
    )

completion_2 = llm.beta.chat.completions.parse(
    model=os.getenv("OPENROUTER_MODEL_NAME"),
    messages=messages,
    tools=tools,
    response_format=WeatherResponse,
)

print(completion.model_dump())
print(completion_2.model_dump())

final_response = completion_2.choices[0].message.parsed
print(final_response.temperature)
print(final_response.response)