from dotenv import load_dotenv

from fastapi import FastAPI, APIRouter, HTTPException
# from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from llm.ai_analyzer import analyze_symptoms
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Chatbot Models
class ChatMessage(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

# Symptom Report Models
class SymptomInput(BaseModel):
    name: str
    age: str
    bloodPressure: Optional[str] = ""
    pulseRate: Optional[str] = ""
    selectedSymptoms: List[Dict[str, Any]]

class Diagnosis(BaseModel):
    name: str
    explanation: str

class ReportResponse(BaseModel):
    report: Dict[str, Any]

# Video Consultation Models
class VideoCallRequest(BaseModel):
    doctorId: str
    patientName: str
    reason: Optional[str] = ""

class VideoCallResponse(BaseModel):
    meetingLink: str
    roomId: str
    expiresAt: str


# AI Chatbot endpoint
@api_router.post("/chatbot", response_model=ChatResponse)
async def chat_with_ai(message: ChatMessage):
    try:
        session_id = str(uuid.uuid4())
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            model="gpt-4o-mini",
            system_message="""You are DhavanthRam Care, an AI health assistant. You provide helpful, 
            accurate health information and guidance. Always remind users that your advice is 
            not a substitute for professional medical consultation. Be empathetic, clear, and 
            helpful. If someone describes serious symptoms, advise them to seek immediate 
            medical attention. You can discuss general health topics, symptoms, preventive care, 
            and when to see a doctor."""
        )
        
        user_message = UserMessage(text=message.prompt)
        # response = await chat.send_message(user_message)
        response = await chat.send_message(user_message)

        if hasattr(response, "text"):
            response = response.text
        else:
            response = str(response)
        
        # Store chat in database
        chat_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_message": message.prompt,
            "bot_response": response,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_history.insert_one(chat_doc)
        
        return ChatResponse(response=response, session_id=session_id)
        
    except Exception as e:
        logging.error(f"Chatbot error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


# AI Report Generation endpoint
@api_router.post("/reports", response_model=ReportResponse)
async def generate_ai_report(data: SymptomInput):
    try:
        session_id = str(uuid.uuid4())
        
        # Build symptom list for the prompt
        symptoms_list = ", ".join([s.get("name", "") for s in data.selectedSymptoms])
        categories = list(set([s.get("category", "") for s in data.selectedSymptoms]))
        
        prompt = f"""Based on the following patient information and symptoms, generate a detailed medical report.

Patient Information:
- Name: {data.name}
- Age: {data.age}
- Blood Pressure: {data.bloodPressure or 'Not provided'}
- Pulse Rate: {data.pulseRate or 'Not provided'}

Reported Symptoms: {symptoms_list}
Symptom Categories: {', '.join(categories)}

Please provide a structured medical assessment report in the following JSON format:
{{
    "possibleDiagnoses": [
        {{"name": "Diagnosis Name", "explanation": "Brief explanation of why this could be a possibility based on the symptoms"}}
    ],
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
    ],
    "suggestedTests": [
        "Test 1",
        "Test 2"
    ],
    "urgencyLevel": "low/medium/high",
    "specialistRecommendation": "Type of specialist to consult if needed"
}}

Important: 
- Provide 2-4 possible diagnoses
- Provide 3-5 practical recommendations
- Suggest 2-4 relevant medical tests
- This is for informational purposes only and is not a substitute for professional medical advice.

Return ONLY the JSON object, no additional text."""

        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            model="gpt-4o-mini",
            system_message="""You are a medical AI assistant that generates preliminary health assessment reports. 
            You analyze symptoms and provide possible diagnoses, recommendations, and suggested tests. 
            Always emphasize that your analysis is preliminary and the patient should consult a healthcare professional.
            Return responses in valid JSON format only."""
        )
        
        user_message = UserMessage(text=prompt)
        # response = await chat.send_message(user_message)
        
        response = await chat.send_message(user_message)

        if hasattr(response, "text"):
            response = response.text
        else:
            response = str(response)
        
        # Parse the AI response
        import json
        try:
            # Clean the response - remove markdown code blocks if present
            clean_response = response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]
            if clean_response.startswith("```"):
                clean_response = clean_response[3:]
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]
            clean_response = clean_response.strip()
            
            report_data = json.loads(clean_response)
        except json.JSONDecodeError:
            # Fallback structure if JSON parsing fails
            report_data = {
                "possibleDiagnoses": [
                    {"name": "Unable to parse AI response", "explanation": "Please try again or consult a healthcare professional directly."}
                ],
                "recommendations": [
                    "Please consult a healthcare professional for accurate diagnosis",
                    "Keep track of your symptoms and their progression",
                    "Stay hydrated and get adequate rest"
                ],
                "suggestedTests": [
                    "General health checkup",
                    "Blood tests as recommended by doctor"
                ],
                "urgencyLevel": "medium",
                "specialistRecommendation": "General Physician"
            }
        
        # Store report in database
        report_doc = {
            "id": str(uuid.uuid4()),
            "patient_name": data.name,
            "patient_age": data.age,
            "symptoms": data.selectedSymptoms,
            "report": report_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.medical_reports.insert_one(report_doc)
        
        return ReportResponse(report=report_data)
        
    except Exception as e:
        logging.error(f"Report generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")



@api_router.post("/analyze-symptoms")
async def ai_analysis(data: dict):

    result = analyze_symptoms(data)

    return {"analysis": result}



# Video consultation - Generate meeting link
@api_router.post("/video-consultation/create", response_model=VideoCallResponse)
async def create_video_consultation(request: VideoCallRequest):
    try:
        room_id = f"consultation-{uuid.uuid4().hex[:8]}"
        
        # Generate Jitsi Meet link
        meeting_link = f"https://meet.jit.si/{room_id}"
        
        # Set expiration (24 hours from now)
        expires_at = datetime.now(timezone.utc).replace(hour=23, minute=59, second=59)
        
        # Store consultation in database
        consultation_doc = {
            "id": str(uuid.uuid4()),
            "room_id": room_id,
            "doctor_id": request.doctorId,
            "patient_name": request.patientName,
            "reason": request.reason,
            "meeting_link": meeting_link,
            "status": "scheduled",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "expires_at": expires_at.isoformat()
        }
        await db.video_consultations.insert_one(consultation_doc)
        
        return VideoCallResponse(
            meetingLink=meeting_link,
            roomId=room_id,
            expiresAt=expires_at.isoformat()
        )
        
    except Exception as e:
        logging.error(f"Video consultation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create video consultation: {str(e)}")


# Get consultation details
@api_router.get("/video-consultation/{room_id}")
async def get_video_consultation(room_id: str):
    consultation = await db.video_consultations.find_one(
        {"room_id": room_id}, 
        {"_id": 0}
    )
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation


# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}


# Basic routes
@api_router.get("/")
async def root():
    return {"message": "AI Doctor Assistant API", "version": "1.0.0"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
