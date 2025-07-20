from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="HypeRacing F1 Analytics API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Driver(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    driver_id: str
    name: str
    team: str
    nationality: str
    number: str
    position: Optional[int] = None
    points: Optional[float] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Race(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    season: str
    round: str
    race_name: str
    circuit_name: str
    date: str
    time: Optional[str] = None
    results: Optional[List[Dict]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    response: str
    context: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PitWallRequest(BaseModel):
    message: str
    session_id: str
    context: Optional[str] = None

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# F1 Data Service
class F1DataService:
    def __init__(self):
        self.base_url = "http://api.jolpi.ca/ergast/f1"
        
    async def get_current_standings(self):
        """Get current driver standings"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/current/driverStandings.json")
                data = response.json()
                standings = data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings']
                
                drivers = []
                for standing in standings:
                    driver_data = standing['Driver']
                    constructor = standing['Constructors'][0]
                    
                    driver = {
                        "driver_id": driver_data['driverId'],
                        "name": f"{driver_data['givenName']} {driver_data['familyName']}",
                        "team": constructor['name'],
                        "nationality": driver_data['nationality'],
                        "number": driver_data.get('permanentNumber', 'N/A'),
                        "position": int(standing['position']),
                        "points": float(standing['points'])
                    }
                    drivers.append(driver)
                
                return drivers
            except Exception as e:
                logging.error(f"Error fetching driver standings: {e}")
                return []
    
    async def get_recent_races(self, limit=10):
        """Get recent race results"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/current/results.json?limit={limit}")
                data = response.json()
                races = data['MRData']['RaceTable']['Races']
                
                race_results = []
                for race in races:
                    race_info = {
                        "season": race['season'],
                        "round": race['round'],
                        "race_name": race['raceName'],
                        "circuit_name": race['Circuit']['circuitName'],
                        "date": race['date'],
                        "time": race.get('time'),
                        "results": race.get('Results', [])
                    }
                    race_results.append(race_info)
                
                return race_results
            except Exception as e:
                logging.error(f"Error fetching race results: {e}")
                return []

    async def get_driver_details(self, driver_id: str):
        """Get detailed driver information"""
        async with httpx.AsyncClient() as client:
            try:
                # Get driver info
                response = await client.get(f"{self.base_url}/current/drivers/{driver_id}.json")
                data = response.json()
                
                if not data['MRData']['DriverTable']['Drivers']:
                    return None
                    
                driver_data = data['MRData']['DriverTable']['Drivers'][0]
                
                # Get driver results this season
                results_response = await client.get(f"{self.base_url}/current/drivers/{driver_id}/results.json")
                results_data = results_response.json()
                races = results_data['MRData']['RaceTable']['Races']
                
                return {
                    "driver_info": driver_data,
                    "season_results": races
                }
            except Exception as e:
                logging.error(f"Error fetching driver details: {e}")
                return None

f1_service = F1DataService()

# AI Pit Wall Service
class PitWallService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        
    async def get_pit_wall_response(self, message: str, session_id: str, context: Optional[str] = None):
        """Get AI response from the Pit Wall"""
        try:
            system_message = """You are the "Pit Wall" - an expert F1 AI assistant with deep knowledge of Formula 1 racing. 
            You provide intelligent insights, strategic analysis, and foresights about drivers, teams, race performance, and F1 data.
            
            Your expertise includes:
            - Driver performance analysis and comparisons
            - Race strategy and tire management
            - Weather impact on race outcomes  
            - Historical F1 data and statistics
            - Team dynamics and championship battles
            - Technical regulations and car performance
            - Track characteristics and setup optimization
            
            Respond in an engaging, knowledgeable tone as if you're a seasoned F1 strategist on the pit wall.
            Keep responses concise but insightful. Use F1 terminology naturally."""
            
            if context:
                system_message += f"\n\nCurrent context: {context}"
            
            # Create LLM chat instance
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("openai", "gpt-4o").with_max_tokens(2048)
            
            user_message = UserMessage(text=message)
            response = await chat.send_message(user_message)
            
            return response
        except Exception as e:
            logging.error(f"Error getting Pit Wall response: {e}")
            return "Sorry, I'm having trouble connecting to the pit wall radio right now. Please try again in a moment."

pit_wall = PitWallService()

# API Routes
@api_router.get("/")
async def root():
    return {"message": "HypeRacing F1 Analytics API"}

@api_router.get("/drivers/standings", response_model=List[Dict])
async def get_driver_standings():
    """Get current F1 driver championship standings"""
    standings = await f1_service.get_current_standings()
    return standings

@api_router.get("/races/recent", response_model=List[Dict])
async def get_recent_races():
    """Get recent race results"""
    races = await f1_service.get_recent_races()
    return races

@api_router.get("/drivers/{driver_id}")
async def get_driver_details(driver_id: str):
    """Get detailed driver information and stats"""
    details = await f1_service.get_driver_details(driver_id)
    if not details:
        raise HTTPException(status_code=404, detail="Driver not found")
    return details

@api_router.post("/pit-wall/chat")
async def chat_with_pit_wall(request: PitWallRequest):
    """Chat with the AI Pit Wall for F1 insights"""
    response = await pit_wall.get_pit_wall_response(
        request.message, 
        request.session_id, 
        request.context
    )
    
    # Store chat in database
    chat_message = ChatMessage(
        session_id=request.session_id,
        message=request.message,
        response=response,
        context=request.context
    )
    
    await db.pit_wall_chats.insert_one(chat_message.dict())
    
    return {"response": response, "session_id": request.session_id}

@api_router.get("/pit-wall/history/{session_id}")
async def get_chat_history(session_id: str, limit: int = 50):
    """Get chat history for a session"""
    chats = await db.pit_wall_chats.find(
        {"session_id": session_id}
    ).sort("timestamp", -1).limit(limit).to_list(length=limit)
    
    return [ChatMessage(**chat) for chat in chats]

# WebSocket for live data
@api_router.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Simulate live timing data - replace with actual SignalR connection
            live_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "type": "timing_update",
                "data": {
                    "race_status": "Race",
                    "session_time": "1:23:45",
                    "positions": [
                        {"pos": 1, "driver": "VER", "gap": "+0.000"},
                        {"pos": 2, "driver": "LEC", "gap": "+0.234"},
                        {"pos": 3, "driver": "RUS", "gap": "+1.567"}
                    ]
                }
            }
            await manager.send_personal_message(json.dumps(live_data), websocket)
            await asyncio.sleep(2)  # Update every 2 seconds
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("HypeRacing F1 Analytics API started")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()