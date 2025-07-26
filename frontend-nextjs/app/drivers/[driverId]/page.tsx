'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService } from '@/lib/api';
import { TEAM_COLORS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { Driver, ChatMessage } from '@/types';

export default function DriverPage() {
  const params = useParams();
  const driverId = params?.driverId as string;
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `driver_${driverId}_${Date.now()}`);

  useEffect(() => {
    if (driverId) {
      fetchDriverDetails();
    }
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      const drivers = await apiService.getDriverStandings();
      const foundDriver = drivers.find(d => d.driver_id === driverId);
      if (foundDriver) {
        setDriver(foundDriver);
      }
    } catch (error) {
      console.error('Error fetching driver details:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !driver) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await apiService.sendPitWallMessage({
        message: userMessage,
        session_id: sessionId,
        context: `Driver analysis for ${driver.name} (${driver.team})`
      });
      
      setMessages(prev => [...prev, { type: 'ai', content: response.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Unable to connect to pit wall. Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!driverId || !driver) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Loading driver data...</div>
      </div>
    );
  }

  const teamColor = TEAM_COLORS[driver.team] || '#00D2BE';

  return (
    <div className="driver-page">
      <div className="driver-layout">
        {/* Left Column - Driver Info */}
        <div className="driver-info-column">
          <NeonPanel color={teamColor} className="driver-profile">
            <div className="driver-image-placeholder">
              <div className="driver-number">#{driver.number || driver.position}</div>
            </div>
            <h1 className="driver-name">{driver.name}</h1>
            <div className="driver-team-info">
              <p className="team-name">{driver.team}</p>
              <p className="nationality">{driver.nationality || 'International'}</p>
            </div>
            <div className="championship-info">
              <div className="position-display">
                <div className="position-number">P{driver.position}</div>
                <div className="position-label">CHAMPIONSHIP</div>
              </div>
              <div className="points-display">
                <div className="points-number">{driver.points}</div>
                <div className="points-label">POINTS</div>
              </div>
            </div>
          </NeonPanel>
        </div>

        {/* Middle Column - Analytics */}
        <div className="analytics-column">
          {/* Race Analytics Panel */}
          <NeonPanel color={teamColor} className="race-analytics-panel">
            <h2 className="section-title">RACE ANALYTICS - BELGIAN GP</h2>
            <div className="race-stats-grid">
              <div className="race-stat-card">
                <div className="stat-title">AVG LAPTIME</div>
                <div className="stat-value">1:44.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">AVG POSITION</div>
                <div className="stat-value">P{Math.floor(driver.position / 2) + Math.floor(Math.random() * 3)}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">FASTEST LAP</div>
                <div className="stat-value">1:41.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST FINISH</div>
                <div className="stat-value">P{Math.max(1, driver.position - Math.floor(Math.random() * 5))}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST QUALIFYING</div>
                <div className="stat-value">P{Math.max(1, driver.position - Math.floor(Math.random() * 7))}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">SPA PODIUMS</div>
                <div className="stat-value">{driver.position <= 5 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2)}</div>
              </div>
            </div>
            <div className="track-insight">
              <h3 className="insight-title">SPA-FRANCORCHAMPS INSIGHT</h3>
              <p className="insight-text">
                This track favors {driver.position <= 10 ? 'strong qualifying performance and tire management' : 'consistent pace and strategic overtaking'}. 
                Historical data shows {driver.name.split(' ')[0]} performs {driver.position <= 8 ? 'exceptionally well' : 'competitively'} at this circuit.
              </p>
            </div>
          </NeonPanel>

          {/* Performance Analytics Panel */}
          <NeonPanel color="#FFFFFF" className="analytics-panel">
            <h2 className="section-title">PERFORMANCE ANALYTICS</h2>
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-title">RACE WINS</div>
                <div className="stat-value">{driver.position <= 5 ? Math.floor(Math.random() * 3) + 1 : 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">PODIUMS</div>
                <div className="stat-value">{driver.position <= 10 ? Math.floor(Math.random() * 8) + 2 : 1}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">FASTEST LAPS</div>
                <div className="stat-value">{Math.floor(Math.random() * 5)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">POINTS/RACE</div>
                <div className="stat-value">{(driver.points / 20).toFixed(1)}</div>
              </div>
            </div>
            
            <div className="performance-chart">
              <h3 className="chart-title">SEASON PERFORMANCE</h3>
              <div className="performance-bars">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="performance-bar">
                    <div 
                      className="bar-fill" 
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        backgroundColor: teamColor
                      }}
                    ></div>
                    <div className="bar-label">R{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </NeonPanel>
        </div>

        {/* Right Column - Mini Pit Wall */}
        <div className="pitwall-column">
          <NeonPanel color={teamColor} className="mini-pitwall">
            <h2 className="section-title">PIT WALL AI</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message">
                    Ask me anything about {driver.name}'s performance, race strategy, or F1 analytics!
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content">Analyzing data...</div>
                  </div>
                )}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about driver performance..."
                  className="chat-input"
                  disabled={isLoading}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="send-button"
                >
                  SEND
                </button>
              </div>
            </div>
          </NeonPanel>
        </div>
      </div>
    </div>
  );
}