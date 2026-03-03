from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import uuid


def analyze_symptoms(data):

    session_id = str(uuid.uuid4())

    prompt = f"""
You are an AI medical assistant.

Symptoms: {data.get('symptoms')}
Duration: {data.get('duration')}
Temperature: {data.get('temperature')}
BP: {data.get('bp')}

Return ONLY JSON:

{{
  "risk_level": "",
  "possible_conditions": [],
  "doctor_focus": [],
  "urgency": ""
}}
"""

    chat = LlmChat(
        api_key=os.environ.get("EMERGENT_LLM_KEY", ""),
        session_id=session_id,
        system_message="You are a medical AI assistant."
    )

    user_message = UserMessage(content=prompt)

    response = chat.send_message_sync(user_message)

    return response