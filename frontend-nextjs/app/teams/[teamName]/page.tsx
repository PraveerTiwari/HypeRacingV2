'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiService } from '@/lib/api';
import { TEAM_COLORS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { Driver, ChatMessage } from '@/types';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamName = decodeURIComponent(params?.teamName as string || '');
  
  const [teamDrivers, setTeamDrivers] = useState<Driver[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `team_${teamName.replace(/\s+/g, '_')}_${Date.now()}`);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamName]);

  const fetchTeamDetails = async () => {
    try {
      const drivers = await apiService.getDriverStandings();
      const filteredDrivers = drivers.filter(driver => driver.team === teamName);
      setTeamDrivers(filteredDrivers);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await apiService.sendPitWallMessage({
        message: userMessage,
        session_id: sessionId,
        context: `Team analysis for ${teamName}`
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

  if (teamDrivers.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Loading team data...</div>
      </div>
    );
  }

  const teamColor = TEAM_COLORS[teamName] || '#00D2BE';

  return (
    <div className="team-page">
      <div className="team-layout">
        {/* Left Column - Team Info */}
        <div className="team-info-column">
          <NeonPanel color={teamColor} className="team-profile">
            <div className="team-logo-placeholder">
              <div className="team-emblem">{teamName.charAt(0)}</div>
            </div>
            <h1 className="team-name">{teamName}</h1>
            
            <div className="team-drivers-info">
              {teamDrivers.map(driver => (
                <div 
                  key={driver.driver_id} 
                  className="driver-info-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/drivers/${driver.driver_id}`)}
                >
                  <span className="driver-name">
                    {driver.name}
                  </span>
                  <span className="driver-position">P{driver.position}</span>
                  <span className="driver-points">{driver.points} pts</span>
                </div>
              ))}
            </div>
            
            <div className="team-championship-info">
              <div className="team-stat">
                <div className="stat-label">BEST DRIVER</div>
                <div className="stat-value">P{Math.min(...teamDrivers.map(d => d.position))}</div>
              </div>
              <div className="team-stat">
                <div className="stat-label">TEAM POINTS</div>
                <div className="stat-value">{teamDrivers.reduce((sum, d) => sum + d.points, 0)}</div>
              </div>
            </div>
          </NeonPanel>
        </div>

        {/* Middle Column - Team Analytics */}
        <div className="analytics-column">
          {/* Team Race Analytics Panel */}
          <NeonPanel color={teamColor} className="race-analytics-panel">
            <h2 className="section-title">TEAM RACE ANALYTICS - BELGIAN GP</h2>
            <div className="race-stats-grid">
              <div className="race-stat-card">
                <div className="stat-title">AVG TEAM LAPTIME</div>
                <div className="stat-value">1:44.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">AVG TEAM POSITION</div>
                <div className="stat-value">P{Math.floor(teamDrivers.reduce((sum, d) => sum + d.position, 0) / teamDrivers.length)}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">TEAM FASTEST LAP</div>
                <div className="stat-value">1:41.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST TEAM FINISH</div>
                <div className="stat-value">P{Math.min(...teamDrivers.map(d => d.position)) - 1 || 1}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST QUALIFYING</div>
                <div className="stat-value">P{Math.max(1, Math.min(...teamDrivers.map(d => d.position)) - 2)}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">SPA WINS</div>
                <div className="stat-value">{Math.min(...teamDrivers.map(d => d.position)) <= 3 ? Math.floor(Math.random() * 3) + 1 : 0}</div>
              </div>
            </div>
            <div className="track-insight">
              <h3 className="insight-title">TEAM SPA-FRANCORCHAMPS ANALYSIS</h3>
              <p className="insight-text">
                {teamName} has shown {Math.min(...teamDrivers.map(d => d.position)) <= 5 ? 'strong competitive pace' : 'steady development progress'} this season. 
                At Spa-Francorchamps, the team's aerodynamic package and power unit combination should provide {Math.min(...teamDrivers.map(d => d.position)) <= 8 ? 'excellent straight-line speed advantages' : 'good opportunities for points scoring'}.
              </p>
            </div>
          </NeonPanel>

          {/* Team Performance Analytics Panel */}
          <NeonPanel color="#FFFFFF" className="analytics-panel">
            <h2 className="section-title">TEAM PERFORMANCE</h2>
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-title">TOTAL WINS</div>
                <div className="stat-value">{Math.min(...teamDrivers.map(d => d.position)) <= 3 ? Math.floor(Math.random() * 5) + 1 : 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">TOTAL PODIUMS</div>
                <div className="stat-value">{Math.min(...teamDrivers.map(d => d.position)) <= 6 ? Math.floor(Math.random() * 12) + 3 : Math.floor(Math.random() * 3)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">FASTEST LAPS</div>
                <div className="stat-value">{Math.floor(Math.random() * 8)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">AVG POINTS/RACE</div>
                <div className="stat-value">{(teamDrivers.reduce((sum, d) => sum + d.points, 0) / 20).toFixed(1)}</div>
              </div>
            </div>
            
            <div className="driver-comparison">
              <h3 className="chart-title">DRIVER COMPARISON</h3>
              <div className="comparison-bars">
                {teamDrivers.map((driver, index) => {
                  const teamTotalPoints = teamDrivers.reduce((sum, d) => sum + d.points, 0);
                  const driverPercentage = teamTotalPoints > 0 ? (driver.points / teamTotalPoints) * 100 : 0;
                  
                  return (
                    <div key={driver.driver_id} className="driver-comparison-bar">
                      <div className="driver-name-small">{driver.name.split(' ')[1] || driver.name}</div>
                      <div className="driver-percentage">({driverPercentage.toFixed(1)}%)</div>
                      <div className="comparison-bar-container">
                        <div 
                          className="bar-fill" 
                          style={{
                            width: `${driverPercentage}%`,
                            backgroundColor: teamColor,
                            opacity: Math.max(0.6, driverPercentage / 100)
                          }}
                        ></div>
                      </div>
                      <div className="driver-points-small">{driver.points} pts</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </NeonPanel>
        </div>

        {/* Right Column - Team Pit Wall */}
        <div className="pitwall-column">
          <NeonPanel color={teamColor} className="mini-pitwall">
            <h2 className="section-title">TEAM PIT WALL AI</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message">
                    Ask me about {teamName}'s strategy, team performance, or driver comparisons!
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content">Analyzing team data...</div>
                  </div>
                )}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about team strategy..."
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