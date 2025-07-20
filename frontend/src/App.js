import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// F1 Driver Analytics Component
const DriverCard = ({ driver, onClick }) => (
  <div 
    className="driver-card bg-gray-900 border-2 border-gray-700 rounded-xl p-6 cursor-pointer hover:border-red-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
    onClick={() => onClick(driver)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          #{driver.number}
        </div>
        <div className="ml-4">
          <h3 className="text-white font-bold text-lg">{driver.name}</h3>
          <p className="text-gray-400 text-sm">{driver.team}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-teal-400">P{driver.position}</div>
        <div className="text-orange-400 font-semibold">{driver.points} pts</div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs">
        {driver.nationality}
      </span>
      <div className="text-xs text-gray-500">Championship Standing</div>
    </div>
  </div>
);

// Pit Wall AI Chat Component
const PitWallChat = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await axios.post(`${API}/pit-wall/chat`, {
        message: userMessage,
        session_id: sessionId,
        context: 'F1 Championship 2024'
      });
      
      // Add AI response to chat
      setMessages(prev => [...prev, { type: 'ai', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Sorry, radio interference! Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="pit-wall-chat bg-gray-900 border-2 border-purple-600 rounded-xl p-6 h-full">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
        <h3 className="text-white font-bold text-xl ml-3">🏎️ PIT WALL AI</h3>
      </div>
      
      <div className="chat-messages bg-black rounded-lg p-4 h-80 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center">
            Ask me anything about F1! Strategy, driver insights, race analysis...
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-xs p-3 rounded-lg ${
              msg.type === 'user' 
                ? 'bg-red-600 text-white' 
                : 'bg-purple-700 text-white'
            }`}>
              <div className="text-xs opacity-75 mb-1">
                {msg.type === 'user' ? 'You' : 'Pit Wall'}
              </div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block bg-purple-700 text-white p-3 rounded-lg">
              <div className="text-xs opacity-75 mb-1">Pit Wall</div>
              <div className="flex items-center">
                <div className="animate-bounce">Analyzing data</div>
                <div className="ml-2">🏁</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask the Pit Wall..."
          className="flex-1 bg-gray-800 border-2 border-gray-600 rounded-l-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-r-lg transition-colors"
        >
          📻
        </button>
      </div>
    </div>
  );
};

// Live Timing Dashboard Component
const LiveDashboard = () => {
  const [liveData, setLiveData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate live connection - replace with actual WebSocket
    const connectToLive = () => {
      setIsConnected(true);
      const interval = setInterval(() => {
        setLiveData({
          session_time: '1:23:45',
          race_status: 'Race',
          positions: [
            { pos: 1, driver: 'VER', gap: '+0.000', team: 'Red Bull' },
            { pos: 2, driver: 'LEC', gap: '+0.234', team: 'Ferrari' },
            { pos: 3, driver: 'RUS', gap: '+1.567', team: 'Mercedes' },
            { pos: 4, driver: 'NOR', gap: '+2.890', team: 'McLaren' },
            { pos: 5, driver: 'PER', gap: '+3.456', team: 'Red Bull' }
          ]
        });
      }, 2000);

      return () => clearInterval(interval);
    };

    const cleanup = connectToLive();
    return cleanup;
  }, []);

  return (
    <div className="live-dashboard bg-gray-900 border-2 border-teal-500 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-2xl">🏁 LIVE RACE DASHBOARD</h2>
        <div className={`flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse mr-2`}></div>
          {isConnected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>
      
      {liveData && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-black rounded-lg p-4">
            <div className="text-orange-400 font-bold">Session Time: {liveData.session_time}</div>
            <div className="text-red-400 font-bold">Status: {liveData.race_status}</div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {liveData.positions.map((position, index) => (
              <div key={index} className="flex items-center justify-between bg-black rounded-lg p-3 hover:bg-gray-800 transition-colors">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    position.pos === 1 ? 'bg-yellow-500 text-black' :
                    position.pos === 2 ? 'bg-gray-400 text-black' :
                    position.pos === 3 ? 'bg-orange-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    P{position.pos}
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-bold">{position.driver}</div>
                    <div className="text-gray-400 text-sm">{position.team}</div>
                  </div>
                </div>
                <div className="text-teal-400 font-mono">{position.gap}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('championship');
  const [sessionId] = useState(() => `session_${Date.now()}`);

  useEffect(() => {
    fetchDriverStandings();
  }, []);

  const fetchDriverStandings = async () => {
    try {
      const response = await axios.get(`${API}/drivers/standings`);
      setDrivers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      setLoading(false);
    }
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setActiveTab('driver-details');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏎️</div>
          <div className="text-white text-xl font-bold">Loading HypeRacing...</div>
          <div className="text-red-500 animate-pulse mt-2">Connecting to F1 Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-orange-500 to-teal-500 p-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">🏎️ HypeRacing</h1>
          <p className="text-white/90">F1 Analytics + AI Insights</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-6">
          <div className="flex space-x-6">
            {['championship', 'live-dashboard', 'pit-wall'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'championship' && '🏆 Championship'}
                {tab === 'live-dashboard' && '📊 Live Dashboard'}
                {tab === 'pit-wall' && '🎯 Pit Wall AI'}
                {tab === 'driver-details' && `👨‍🏎️ ${selectedDriver?.name}`}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'championship' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">2024 Driver Championship</h2>
              <p className="text-gray-400">Click on any driver to view detailed analytics</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <DriverCard
                  key={driver.driver_id}
                  driver={driver}
                  onClick={handleDriverClick}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'live-dashboard' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Live Race Dashboard</h2>
              <p className="text-gray-400">Real-time F1 race positions and timing data</p>
            </div>
            <LiveDashboard />
          </div>
        )}

        {activeTab === 'pit-wall' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">AI Pit Wall</h2>
              <p className="text-gray-400">Get expert F1 insights and strategic analysis</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <PitWallChat sessionId={sessionId} />
            </div>
          </div>
        )}

        {activeTab === 'driver-details' && selectedDriver && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Driver Info */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white mb-4">
                    #{selectedDriver.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{selectedDriver.name}</h3>
                  <p className="text-gray-400">{selectedDriver.team}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Championship Position</span>
                    <span className="text-teal-400 font-bold">P{selectedDriver.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Points</span>
                    <span className="text-orange-400 font-bold">{selectedDriver.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nationality</span>
                    <span className="text-white">{selectedDriver.nationality}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Analytics */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
                <h4 className="text-xl font-bold text-white mb-4">Performance Analytics</h4>
                <div className="space-y-4">
                  <div className="bg-black rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Season Performance</div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-teal-400 h-2 rounded-full" 
                          style={{width: `${(selectedDriver.position / 20) * 100}%`}}
                        ></div>
                      </div>
                      <span className="ml-3 text-white font-bold">{selectedDriver.points}pts</span>
                    </div>
                  </div>
                  
                  <div className="bg-black rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Race Insights</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Finish</span>
                        <span className="text-blue-400">P{Math.ceil(selectedDriver.position / 2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Podiums</span>
                        <span className="text-yellow-400">{selectedDriver.position <= 3 ? '8' : '2'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">DNFs</span>
                        <span className="text-red-400">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pit Wall */}
            <div>
              <PitWallChat sessionId={`${sessionId}_${selectedDriver.driver_id}`} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            🏎️ HypeRacing - Powered by F1 Data API & OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;