#!/usr/bin/env python3
"""
HypeRacing F1 Analytics Backend Test Suite
Tests all backend API endpoints and functionality
"""

import asyncio
import aiohttp
import json
import uuid
from datetime import datetime
import sys
import os

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("ERROR: Could not get REACT_APP_BACKEND_URL from frontend/.env")
    sys.exit(1)

API_BASE = f"{BACKEND_URL}/api"

class F1BackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.session_id = str(uuid.uuid4())
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and isinstance(response_data, dict):
            print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "response": response_data
        })
        print()
    
    async def test_api_health(self):
        """Test 1: Basic API Health Check"""
        try:
            async with self.session.get(f"{API_BASE}/") as response:
                if response.status == 200:
                    data = await response.json()
                    if "message" in data and "HypeRacing" in data["message"]:
                        self.log_test("API Health Check", True, f"Status: {response.status}", data)
                        return True
                    else:
                        self.log_test("API Health Check", False, f"Unexpected response format", data)
                        return False
                else:
                    self.log_test("API Health Check", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Exception: {str(e)}")
            return False
    
    async def test_driver_standings(self):
        """Test 2: F1 Driver Standings"""
        try:
            async with self.session.get(f"{API_BASE}/drivers/standings") as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list) and len(data) > 0:
                        # Check if we have proper driver data structure
                        first_driver = data[0]
                        required_fields = ['driver_id', 'name', 'team', 'position', 'points']
                        if all(field in first_driver for field in required_fields):
                            self.log_test("Driver Standings", True, 
                                        f"Retrieved {len(data)} drivers", 
                                        {"sample_driver": first_driver})
                            return True
                        else:
                            self.log_test("Driver Standings", False, 
                                        f"Missing required fields in driver data")
                            return False
                    else:
                        self.log_test("Driver Standings", False, 
                                    f"Empty or invalid response format")
                        return False
                else:
                    self.log_test("Driver Standings", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("Driver Standings", False, f"Exception: {str(e)}")
            return False
    
    async def test_recent_races(self):
        """Test 3: Recent Race Results"""
        try:
            async with self.session.get(f"{API_BASE}/races/recent") as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list) and len(data) > 0:
                        first_race = data[0]
                        required_fields = ['season', 'round', 'race_name', 'circuit_name', 'date']
                        if all(field in first_race for field in required_fields):
                            self.log_test("Recent Races", True, 
                                        f"Retrieved {len(data)} races", 
                                        {"sample_race": first_race})
                            return True
                        else:
                            self.log_test("Recent Races", False, 
                                        f"Missing required fields in race data")
                            return False
                    else:
                        self.log_test("Recent Races", False, 
                                    f"Empty or invalid response format")
                        return False
                else:
                    self.log_test("Recent Races", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("Recent Races", False, f"Exception: {str(e)}")
            return False
    
    async def test_driver_details(self):
        """Test 4: Driver Details"""
        # Test with common driver IDs
        test_drivers = ["verstappen", "leclerc", "hamilton"]
        
        for driver_id in test_drivers:
            try:
                async with self.session.get(f"{API_BASE}/drivers/{driver_id}") as response:
                    if response.status == 200:
                        data = await response.json()
                        if "driver_info" in data and "season_results" in data:
                            self.log_test(f"Driver Details ({driver_id})", True, 
                                        f"Retrieved driver info and season results", 
                                        {"driver_name": data["driver_info"].get("familyName", "Unknown")})
                            return True
                        else:
                            self.log_test(f"Driver Details ({driver_id})", False, 
                                        f"Missing required fields in response")
                    elif response.status == 404:
                        # Try next driver
                        continue
                    else:
                        self.log_test(f"Driver Details ({driver_id})", False, 
                                    f"Status: {response.status}")
            except Exception as e:
                self.log_test(f"Driver Details ({driver_id})", False, f"Exception: {str(e)}")
                continue
        
        # If we get here, none of the drivers worked
        self.log_test("Driver Details", False, "No valid drivers found")
        return False
    
    async def test_pit_wall_chat(self):
        """Test 5: AI Pit Wall Chat"""
        try:
            chat_payload = {
                "message": "Who is leading the championship?",
                "session_id": self.session_id
            }
            
            async with self.session.post(f"{API_BASE}/pit-wall/chat", 
                                       json=chat_payload) as response:
                if response.status == 200:
                    data = await response.json()
                    if "response" in data and "session_id" in data:
                        if len(data["response"]) > 10:  # Reasonable response length
                            self.log_test("Pit Wall Chat", True, 
                                        f"Received AI response ({len(data['response'])} chars)", 
                                        {"response_preview": data["response"][:100] + "..."})
                            return True
                        else:
                            self.log_test("Pit Wall Chat", False, 
                                        f"Response too short: {data['response']}")
                            return False
                    else:
                        self.log_test("Pit Wall Chat", False, 
                                    f"Missing required fields in response")
                        return False
                else:
                    self.log_test("Pit Wall Chat", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("Pit Wall Chat", False, f"Exception: {str(e)}")
            return False
    
    async def test_pit_wall_session_continuity(self):
        """Test 6: Pit Wall Session Continuity"""
        try:
            # Send second message in same session
            chat_payload = {
                "message": "What about the constructors championship?",
                "session_id": self.session_id
            }
            
            async with self.session.post(f"{API_BASE}/pit-wall/chat", 
                                       json=chat_payload) as response:
                if response.status == 200:
                    data = await response.json()
                    if "response" in data and data["session_id"] == self.session_id:
                        self.log_test("Pit Wall Session Continuity", True, 
                                    f"Session maintained: {self.session_id}", 
                                    {"response_preview": data["response"][:100] + "..."})
                        return True
                    else:
                        self.log_test("Pit Wall Session Continuity", False, 
                                    f"Session ID mismatch or missing response")
                        return False
                else:
                    self.log_test("Pit Wall Session Continuity", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("Pit Wall Session Continuity", False, f"Exception: {str(e)}")
            return False
    
    async def test_chat_history(self):
        """Test 7: Chat History Retrieval"""
        try:
            async with self.session.get(f"{API_BASE}/pit-wall/history/{self.session_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    if isinstance(data, list) and len(data) >= 2:  # Should have our 2 test messages
                        self.log_test("Chat History", True, 
                                    f"Retrieved {len(data)} chat messages", 
                                    {"message_count": len(data)})
                        return True
                    else:
                        self.log_test("Chat History", False, 
                                    f"Expected at least 2 messages, got {len(data) if isinstance(data, list) else 0}")
                        return False
                else:
                    self.log_test("Chat History", False, f"Status: {response.status}")
                    return False
        except Exception as e:
            self.log_test("Chat History", False, f"Exception: {str(e)}")
            return False
    
    async def test_error_handling(self):
        """Test 8: Error Handling"""
        error_tests = [
            ("Invalid Endpoint", f"{API_BASE}/invalid-endpoint", 404),
            ("Invalid Driver ID", f"{API_BASE}/drivers/invalid-driver-123", 404),
        ]
        
        all_passed = True
        for test_name, url, expected_status in error_tests:
            try:
                async with self.session.get(url) as response:
                    if response.status == expected_status:
                        self.log_test(f"Error Handling - {test_name}", True, 
                                    f"Correctly returned {response.status}")
                    else:
                        self.log_test(f"Error Handling - {test_name}", False, 
                                    f"Expected {expected_status}, got {response.status}")
                        all_passed = False
            except Exception as e:
                self.log_test(f"Error Handling - {test_name}", False, f"Exception: {str(e)}")
                all_passed = False
        
        # Test malformed chat request
        try:
            malformed_payload = {"invalid": "payload"}
            async with self.session.post(f"{API_BASE}/pit-wall/chat", 
                                       json=malformed_payload) as response:
                if response.status == 422:  # FastAPI validation error
                    self.log_test("Error Handling - Malformed Chat", True, 
                                f"Correctly returned {response.status} for invalid payload")
                else:
                    self.log_test("Error Handling - Malformed Chat", False, 
                                f"Expected 422, got {response.status}")
                    all_passed = False
        except Exception as e:
            self.log_test("Error Handling - Malformed Chat", False, f"Exception: {str(e)}")
            all_passed = False
        
        return all_passed
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print(f"🏁 Starting HypeRacing F1 Analytics Backend Tests")
        print(f"Backend URL: {API_BASE}")
        print(f"Test Session ID: {self.session_id}")
        print("=" * 60)
        
        tests = [
            self.test_api_health,
            self.test_driver_standings,
            self.test_recent_races,
            self.test_driver_details,
            self.test_pit_wall_chat,
            self.test_pit_wall_session_continuity,
            self.test_chat_history,
            self.test_error_handling,
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                result = await test()
                if result:
                    passed += 1
            except Exception as e:
                print(f"❌ Test failed with exception: {str(e)}")
        
        print("=" * 60)
        print(f"🏁 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print(f"⚠️  {total - passed} tests failed. Check the details above.")
        
        return passed, total, self.test_results

async def main():
    async with F1BackendTester() as tester:
        passed, total, results = await tester.run_all_tests()
        return passed == total

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)