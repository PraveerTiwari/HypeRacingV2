'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import NeonPanel from '@/components/NeonPanel';
import { ChatMessage } from '@/types';

export default function PitWallPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `pitwall_${Date.now()}`);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage, timestamp: Date.now() }]);
    
    try {
      const response = await apiService.sendPitWallMessage({
        message: userMessage,
        session_id: sessionId,
        context: 'General F1 analysis and strategy discussion'
      });
      
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response, 
        timestamp: Date.now() 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'Unable to connect to pit wall. Please try again.', 
        timestamp: Date.now() 
      }]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="pitwall-page">
      <div className="page-header">
        <h1 className="page-title">PIT WALL AI</h1>
        <p className="page-subtitle">Advanced F1 Analytics & Strategy Assistant</p>
      </div>

      <div className="pitwall-layout">
        <div className="main-chat-section">
          <NeonPanel color="#DC143C" className="main-pitwall-chat">
            <h2 className="section-title">F1 STRATEGY COMMAND CENTER</h2>
            <div className="large-chat-container">
              <div className="large-chat-messages">
                {messages.length === 0 && (
                  <div className="welcome-message-large">
                    <h3>Welcome to the HypeRacing Pit Wall AI!</h3>
                    <p>I'm your advanced F1 analytics assistant. Ask me about:</p>
                    <ul>
                      <li>• Race strategy and tire management</li>
                      <li>• Driver and team performance analysis</li>
                      <li>• Championship standings and predictions</li>
                      <li>• Technical regulations and car setups</li>
                      <li>• Historical F1 data and statistics</li>
                      <li>• Live race analysis and commentary</li>
                    </ul>
                    <p>How can I help you analyze Formula 1 today?</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`large-message ${message.type}`}>
                    <div className="message-header">
                      <span className="message-sender">
                        {message.type === 'user' ? 'YOU' : 'PIT WALL AI'}
                      </span>
                      {message.timestamp && (
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="large-message ai">
                    <div className="message-header">
                      <span className="message-sender">PIT WALL AI</span>
                      <span className="message-time">{formatTime(Date.now())}</span>
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      Analyzing F1 data...
                    </div>
                  </div>
                )}
              </div>
              <div className="large-chat-input-container">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about F1 strategy, driver performance, race analysis..."
                  className="large-chat-input"
                  disabled={isLoading}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="large-send-button"
                >
                  {isLoading ? 'ANALYZING...' : 'SEND TO PIT WALL'}
                </button>
              </div>
            </div>
          </NeonPanel>
        </div>

        <div className="pitwall-sidebar">
          {/* Quick Stats Panel */}
          <NeonPanel color="#00D2BE" className="quick-stats-panel">
            <h3 className="section-title">QUICK STATS</h3>
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <div className="stat-value">2025</div>
                <div className="stat-label">SEASON</div>
              </div>
              <div className="quick-stat">
                <div className="stat-value">20</div>
                <div className="stat-label">DRIVERS</div>
              </div>
              <div className="quick-stat">
                <div className="stat-value">10</div>
                <div className="stat-label">TEAMS</div>
              </div>
              <div className="quick-stat">
                <div className="stat-value">24</div>
                <div className="stat-label">RACES</div>
              </div>
            </div>
          </NeonPanel>

          {/* Sample Questions */}
          <NeonPanel color="#FF8700" className="sample-questions-panel">
            <h3 className="section-title">SAMPLE QUESTIONS</h3>
            <div className="sample-questions">
              <button 
                className="sample-question"
                onClick={() => setInputMessage("Who is leading the championship and by how many points?")}
              >
                Championship leader analysis
              </button>
              <button 
                className="sample-question"
                onClick={() => setInputMessage("What's the best tire strategy for Spa-Francorchamps?")}
              >
                Spa tire strategy
              </button>
              <button 
                className="sample-question"
                onClick={() => setInputMessage("Compare McLaren vs Ferrari performance this season")}
              >
                Team comparison
              </button>
              <button 
                className="sample-question"
                onClick={() => setInputMessage("Analyze the impact of the 2025 regulation changes")}
              >
                Technical regulations
              </button>
              <button 
                className="sample-question"
                onClick={() => setInputMessage("Predict the top 5 championship finishers")}
              >
                Season predictions
              </button>
            </div>
          </NeonPanel>

          {/* AI Capabilities */}
          <NeonPanel color="#7C3AED" className="ai-capabilities-panel">
            <h3 className="section-title">AI CAPABILITIES</h3>
            <div className="capabilities-list">
              <div className="capability">
                <div className="capability-icon">📊</div>
                <div className="capability-text">Real-time data analysis</div>
              </div>
              <div className="capability">
                <div className="capability-icon">🏁</div>
                <div className="capability-text">Race strategy optimization</div>
              </div>
              <div className="capability">
                <div className="capability-icon">📈</div>
                <div className="capability-text">Performance predictions</div>
              </div>
              <div className="capability">
                <div className="capability-icon">🔧</div>
                <div className="capability-text">Technical insights</div>
              </div>
              <div className="capability">
                <div className="capability-icon">📚</div>
                <div className="capability-text">Historical comparisons</div>
              </div>
            </div>
          </NeonPanel>
        </div>
      </div>
    </div>
  );
}