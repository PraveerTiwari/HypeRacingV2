import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Team color mapping for neon borders
const TEAM_COLORS = {
  'Red Bull Racing': '#1E3A8A',
  'Mercedes': '#00D2BE', 
  'Ferrari': '#DC143C',
  'McLaren': '#FF8700',
  'Aston Martin': '#006F62',
  'Alpine F1 Team': '#0090FF',
  'Williams': '#005AFF',
  'RB F1 Team': '#6692FF',
  'Kick Sauber': '#00E701',
  'Haas F1 Team': '#FFFFFF'
};

// Navigation Component
const Navigation = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-text">HYPERACING</div>
          <div className="logo-subtitle">F1 Analytics Platform</div>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/live" className="nav-link">DASHBOARD</Link>
          <Link to="/drivers" className="nav-link">DRIVERS</Link>
          <Link to="/teams" className="nav-link">TEAMS</Link>
          <Link to="/pitwall" className="nav-link">PIT WALL</Link>
        </div>
      </div>
    </nav>
  );
};

// Neon Panel Component
const NeonPanel = ({ children, color = '#00D2BE', className = '' }) => (
  <div 
    className={`neon-panel ${className}`}
    style={{
      '--neon-color': color,
      boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}10`
    }}
  >
    {children}
  </div>
);

// Home Page Component
const HomePage = () => {
  const [drivers, setDrivers] = useState([]);
  const [news] = useState([
    { id: 1, title: 'Formula 1 Championship Battle Intensifies', summary: 'Latest updates from the championship standings' },
    { id: 2, title: 'Technical Regulations Update', summary: 'New aerodynamic rules for upcoming season' },
    { id: 3, title: 'Driver Market Analysis', summary: 'Potential moves and contract negotiations' }
  ]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API}/drivers/standings`);
      setDrivers(response.data.slice(0, 6)); // Top 6 for home preview
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="grid-background"></div>
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">FORMULA 1 ANALYTICS</h1>
          <p className="hero-subtitle">Real-time data • AI insights • Championship analysis</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">21</div>
              <div className="stat-label">DRIVERS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">TEAMS</div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-grid">
        {/* Live Dashboard Link with Countdown - Now at top */}
        <Link to="/live" className="dashboard-link">
          <NeonPanel color="#DC143C" className="dashboard-panel">
            <div className="dashboard-content">
              <div className="dashboard-main">
                <h2 className="panel-title">LIVE DASHBOARD</h2>
                <p className="panel-description">Real-time race positions and timing</p>
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span>LIVE DATA</span>
                </div>
              </div>
              <div className="race-countdown">
                <div className="countdown-title">NEXT RACE</div>
                <div className="race-info">BELGIAN GP</div>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <div className="countdown-number">2</div>
                    <div className="countdown-label">DAYS</div>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number">14</div>
                    <div className="countdown-label">HRS</div>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number">23</div>
                    <div className="countdown-label">MIN</div>
                  </div>
                </div>
              </div>
            </div>
          </NeonPanel>
        </Link>

        {/* News Section */}
        <NeonPanel className="news-section" color="#00D2BE">
          <h2 className="section-title">F1 NEWS</h2>
          <div className="news-list">
            {news.map(article => (
              <div key={article.id} className="news-item">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
              </div>
            ))}
          </div>
        </NeonPanel>

        {/* Championship Leaders Preview */}
        <NeonPanel className="drivers-preview" color="#FF8700">
          <h2 className="section-title">CHAMPIONSHIP LEADERS</h2>
          <div className="drivers-grid">
            {drivers.map((driver, index) => (
              <Link key={driver.driver_id} to={`/driver/${driver.driver_id}`} className="driver-preview-card">
                <div className="driver-position">P{driver.position}</div>
                <div className="driver-info">
                  <div className="driver-name">{driver.name}</div>
                  <div className="driver-team">{driver.team}</div>
                  <div className="driver-points">{driver.points} PTS</div>
                </div>
              </Link>
            ))}
          </div>
        </NeonPanel>
      </div>
    </div>
  );
};

// Drivers List Page
const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API}/drivers/standings`);
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  return (
    <div className="drivers-page">
      <div className="grid-background"></div>
      <div className="page-header">
        <h1 className="page-title">DRIVERS CHAMPIONSHIP</h1>
        <p className="page-subtitle">2024 Season Standings</p>
      </div>

      <div className="drivers-grid">
        {drivers.map(driver => (
          <div 
            key={driver.driver_id}
            className="driver-card"
            onClick={() => navigate(`/driver/${driver.driver_id}`)}
          >
            <NeonPanel color={TEAM_COLORS[driver.team] || '#00D2BE'}>
              <div className="driver-card-content">
                <div className="driver-position-badge">P{driver.position}</div>
                <div className="driver-details">
                  <h3 className="driver-name">{driver.name}</h3>
                  <p className="driver-team">{driver.team}</p>
                  <p className="driver-nationality">{driver.nationality}</p>
                </div>
                <div className="driver-stats">
                  <div className="points-display">{driver.points}</div>
                  <div className="points-label">POINTS</div>
                </div>
              </div>
            </NeonPanel>
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Driver Page
const DriverPage = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `driver_${driverId}_${Date.now()}`);

  useEffect(() => {
    fetchDriverDetails();
  }, [driverId]);

  const fetchDriverDetails = async () => {
    try {
      // Get driver from standings first
      const standingsResponse = await axios.get(`${API}/drivers/standings`);
      const driverData = standingsResponse.data.find(d => d.driver_id === driverId);
      setDriver(driverData);
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
      const response = await axios.post(`${API}/pit-wall/chat`, {
        message: userMessage,
        session_id: sessionId,
        context: `Driver analysis for ${driver.name} from ${driver.team}`
      });
      
      setMessages(prev => [...prev, { type: 'ai', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Unable to connect to pit wall. Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  if (!driver) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Loading driver data...</div>
      </div>
    );
  }

  const teamColor = TEAM_COLORS[driver.team] || '#00D2BE';

  return (
    <div className="driver-page">
      <div className="grid-background"></div>
      
      <div className="driver-layout">
        {/* Left Column - Driver Info */}
        <div className="driver-info-column">
          <NeonPanel color={teamColor} className="driver-profile">
            <div className="driver-image-placeholder">
              <div className="driver-number">#{driver.number}</div>
            </div>
            <h1 className="driver-name">{driver.name}</h1>
            <div className="driver-team-info">
              <p className="team-name">{driver.team}</p>
              <p className="nationality">{driver.nationality}</p>
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
                  <div className="chat-prompt">
                    Ask about {driver.name.split(' ')[0]}'s performance, strategy, or racing insights...
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content">Analyzing data...</div>
                  </div>
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask the pit wall..."
                  className="message-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="send-button"
                  style={{ borderColor: teamColor }}
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
};

// Teams Page
const TeamsPage = () => {
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API}/drivers/standings`);
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Group drivers by team
  const teams = drivers.reduce((acc, driver) => {
    if (!acc[driver.team]) {
      acc[driver.team] = [];
    }
    acc[driver.team].push(driver);
    return acc;
  }, {});

  return (
    <div className="teams-page">
      <div className="grid-background"></div>
      <div className="page-header">
        <h1 className="page-title">CONSTRUCTORS</h1>
        <p className="page-subtitle">2024 Season Teams</p>
      </div>

      <div className="teams-grid">
        {Object.entries(teams).map(([teamName, teamDrivers]) => (
          <div key={teamName} className="team-card" onClick={() => navigate(`/team/${encodeURIComponent(teamName)}`)}>
            <NeonPanel color={TEAM_COLORS[teamName] || '#00D2BE'}>
              <div className="team-card-content">
                <h3 className="team-name">{teamName}</h3>
                <div className="team-drivers">
                  {teamDrivers.map(driver => (
                    <div key={driver.driver_id} className="team-driver">
                      <span className="driver-name">{driver.name}</span>
                      <span className="driver-position">P{driver.position}</span>
                    </div>
                  ))}
                </div>
                <div className="team-points">
                  <div className="points-number">
                    {teamDrivers.reduce((sum, driver) => sum + driver.points, 0)}
                  </div>
                  <div className="points-label">TEAM POINTS</div>
                </div>
              </div>
            </NeonPanel>
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Team Page
const TeamPage = () => {
  const { teamName } = useParams();
  const navigate = useNavigate();
  const decodedTeamName = decodeURIComponent(teamName);
  const [teamDrivers, setTeamDrivers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `team_${teamName}_${Date.now()}`);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamName]);

  const fetchTeamDetails = async () => {
    try {
      const standingsResponse = await axios.get(`${API}/drivers/standings`);
      const teamData = standingsResponse.data.filter(d => d.team === decodedTeamName);
      setTeamDrivers(teamData);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || teamDrivers.length === 0) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await axios.post(`${API}/pit-wall/chat`, {
        message: userMessage,
        session_id: sessionId,
        context: `Team analysis for ${decodedTeamName} with drivers: ${teamDrivers.map(d => d.name).join(', ')}`
      });
      
      setMessages(prev => [...prev, { type: 'ai', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Unable to connect to pit wall. Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  if (teamDrivers.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Loading team data...</div>
      </div>
    );
  }

  const teamColor = TEAM_COLORS[decodedTeamName] || '#00D2BE';
  const teamPoints = teamDrivers.reduce((sum, driver) => sum + driver.points, 0);
  const bestPosition = Math.min(...teamDrivers.map(d => d.position));

  return (
    <div className="team-page">
      <div className="grid-background"></div>
      
      <div className="team-layout">
        {/* Left Column - Team Info */}
        <div className="team-info-column">
          <NeonPanel color={teamColor} className="team-profile">
            <div className="team-logo-placeholder">
              <div className="team-emblem">{decodedTeamName.charAt(0)}</div>
            </div>
            <h1 className="team-name">{decodedTeamName}</h1>
            <div className="team-drivers-info">
              {teamDrivers.map(driver => (
                <div 
                  key={driver.driver_id} 
                  className="driver-info-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/driver/${driver.driver_id}`)}
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
              <div className="position-display">
                <div className="position-number">P{bestPosition}</div>
                <div className="position-label">BEST DRIVER</div>
              </div>
              <div className="points-display">
                <div className="points-number">{teamPoints}</div>
                <div className="points-label">TEAM POINTS</div>
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
                <div className="stat-value">1:43.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">AVG TEAM POSITION</div>
                <div className="stat-value">P{Math.floor(bestPosition / 2) + Math.floor(Math.random() * 2)}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">TEAM FASTEST LAP</div>
                <div className="stat-value">1:41.{Math.floor(Math.random() * 999).toString().padStart(3, '0')}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST TEAM FINISH</div>
                <div className="stat-value">P{Math.max(1, bestPosition - Math.floor(Math.random() * 3))}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">BEST QUALIFYING</div>
                <div className="stat-value">P{Math.max(1, bestPosition - Math.floor(Math.random() * 5))}</div>
              </div>
              <div className="race-stat-card">
                <div className="stat-title">SPA WINS</div>
                <div className="stat-value">{bestPosition <= 3 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2)}</div>
              </div>
            </div>
            <div className="track-insight">
              <h3 className="insight-title">TEAM SPA-FRANCORCHAMPS ANALYSIS</h3>
              <p className="insight-text">
                {decodedTeamName} has historically {bestPosition <= 5 ? 'excelled' : 'shown competitive pace'} at Spa-Francorchamps. 
                The team's strategic approach and car setup typically {bestPosition <= 8 ? 'delivers strong results' : 'aims for points finishes'} at this power-sensitive circuit.
              </p>
            </div>
          </NeonPanel>

          {/* Team Performance Panel */}
          <NeonPanel color="#FFFFFF" className="analytics-panel">
            <h2 className="section-title">TEAM PERFORMANCE</h2>
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-title">TOTAL WINS</div>
                <div className="stat-value">{teamDrivers.reduce((sum, d) => sum + (d.position <= 5 ? Math.floor(Math.random() * 2) : 0), 0)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">TOTAL PODIUMS</div>
                <div className="stat-value">{teamDrivers.reduce((sum, d) => sum + (d.position <= 10 ? Math.floor(Math.random() * 5) + 1 : 0), 0)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">FASTEST LAPS</div>
                <div className="stat-value">{Math.floor(Math.random() * 8) + 1}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">AVG POINTS/RACE</div>
                <div className="stat-value">{(teamPoints / 20).toFixed(1)}</div>
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

        {/* Right Column - Mini Pit Wall */}
        <div className="pitwall-column">
          <NeonPanel color={teamColor} className="mini-pitwall">
            <h2 className="section-title">TEAM STRATEGY</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="chat-prompt">
                    Ask about {decodedTeamName}'s strategy, driver lineup, team performance, or championship prospects...
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai">
                    <div className="message-content">Analyzing team data...</div>
                  </div>
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about team strategy..."
                  className="message-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="send-button"
                  style={{ borderColor: teamColor }}
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
};

// Live Dashboard Page
const LiveDashboardPage = () => {
  const [liveData, setLiveData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [driverRadio, setDriverRadio] = useState([]);
  const [raceUpdates, setRaceUpdates] = useState([]);
  const [telemetryData, setTelemetryData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize SignalR connection simulation
    connectToF1SignalR();
    return () => disconnectF1SignalR();
  }, []);

  const connectToF1SignalR = async () => {
    setIsConnected(true);
    
    // Simulate F1 SignalR data updates
    const interval = setInterval(() => {
      // Update positions
      setLiveData({
        sessionTime: formatTime(Date.now()),
        sessionType: 'RACE',
        trackStatus: 'GREEN',
        raceName: 'BELGIAN GRAND PRIX',
        positions: generateLivePositions(),
        weather: {
          airTemp: Math.floor(Math.random() * 10) + 20,
          trackTemp: Math.floor(Math.random() * 15) + 35,
          humidity: Math.floor(Math.random() * 30) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5
        }
      });

      // Update telemetry
      setTelemetryData(generateTelemetryData());

      // Occasional radio messages
      if (Math.random() < 0.3) {
        addRadioMessage();
      }

      // Occasional race updates
      if (Math.random() < 0.2) {
        addRaceUpdate();
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const disconnectF1SignalR = () => {
    setIsConnected(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date(timestamp);
    const minutes = Math.floor((now.getTime() % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((now.getTime() % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateLivePositions = () => {
    const drivers = [
      { pos: 1, driver: 'VER', driverId: 'verstappen', team: 'Red Bull Racing', gap: '+0.000', lastLap: '1:23.456', sector: 'S2' },
      { pos: 2, driver: 'HAM', driverId: 'hamilton', team: 'Ferrari', gap: '+0.234', lastLap: '1:23.690', sector: 'S1' },
      { pos: 3, driver: 'NOR', driverId: 'norris', team: 'McLaren', gap: '+1.567', lastLap: '1:25.023', sector: 'S3' },
      { pos: 4, driver: 'PIA', driverId: 'piastri', team: 'McLaren', gap: '+2.890', lastLap: '1:24.346', sector: 'S2' },
      { pos: 5, driver: 'LEC', driverId: 'leclerc', team: 'Ferrari', gap: '+3.456', lastLap: '1:24.912', sector: 'S1' },
      { pos: 6, driver: 'RUS', driverId: 'russell', team: 'Mercedes', gap: '+4.123', lastLap: '1:25.579', sector: 'S3' },
      { pos: 7, driver: 'ANT', driverId: 'antonelli', team: 'Mercedes', gap: '+5.789', lastLap: '1:26.234', sector: 'S2' },
      { pos: 8, driver: 'TSU', driverId: 'tsunoda', team: 'Red Bull Racing', gap: '+6.234', lastLap: '1:26.690', sector: 'S1' },
      { pos: 9, driver: 'ALO', driverId: 'alonso', team: 'Aston Martin', gap: '+7.456', lastLap: '1:27.123', sector: 'S3' },
      { pos: 10, driver: 'STR', driverId: 'stroll', team: 'Aston Martin', gap: '+8.789', lastLap: '1:27.890', sector: 'S2' },
      { pos: 11, driver: 'GAS', driverId: 'gasly', team: 'Alpine F1 Team', gap: '+9.123', lastLap: '1:28.456', sector: 'S1' },
      { pos: 12, driver: 'DOO', driverId: 'doohan', team: 'Alpine F1 Team', gap: '+10.567', lastLap: '1:29.123', sector: 'S3' },
      { pos: 13, driver: 'HAD', driverId: 'hadjar', team: 'RB F1 Team', gap: '+11.890', lastLap: '1:29.789', sector: 'S2' },
      { pos: 14, driver: 'LAW', driverId: 'lawson', team: 'RB F1 Team', gap: '+12.456', lastLap: '1:30.234', sector: 'S1' },
      { pos: 15, driver: 'BEA', driverId: 'bearman', team: 'Haas F1 Team', gap: '+13.789', lastLap: '1:30.890', sector: 'S3' },
      { pos: 16, driver: 'COL', driverId: 'colapinto', team: 'Haas F1 Team', gap: '+14.123', lastLap: '1:31.456', sector: 'S2' },
      { pos: 17, driver: 'ALB', driverId: 'albon', team: 'Williams', gap: '+15.567', lastLap: '1:32.123', sector: 'S1' },
      { pos: 18, driver: 'SAI', driverId: 'sainz', team: 'Williams', gap: '+16.890', lastLap: '1:32.789', sector: 'S3' },
      { pos: 19, driver: 'HUL', driverId: 'hulkenberg', team: 'Kick Sauber', gap: '+17.456', lastLap: '1:33.234', sector: 'S2' },
      { pos: 20, driver: 'BOR', driverId: 'bortoleto', team: 'Kick Sauber', gap: '+18.123', lastLap: '1:33.890', sector: 'S1' }
    ];

    // Add some randomness to gaps and lap times
    return drivers.map(driver => ({
      ...driver,
      gap: driver.pos === 1 ? '+0.000' : `+${(Math.random() * 10 + driver.pos * 0.8).toFixed(3)}`,
      lastLap: `1:2${Math.floor(Math.random() * 7) + 3}.${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      teamColor: TEAM_COLORS[driver.team] || '#00D2BE'
    }));
  };

  const generateTelemetryData = () => {
    const allDrivers = ['VER', 'HAM', 'NOR', 'PIA', 'LEC', 'RUS', 'ANT', 'TSU', 'ALO', 'STR', 
                       'GAS', 'DOO', 'HAD', 'LAW', 'BEA', 'COL', 'ALB', 'SAI', 'HUL', 'BOR'];
    
    const telemetryData = {};
    allDrivers.forEach(driver => {
      telemetryData[driver] = {
        speed: Math.floor(Math.random() * 50) + 250 + (driver === 'VER' ? 30 : 0),
        gear: Math.floor(Math.random() * 6) + 2,
        rpm: Math.floor(Math.random() * 3000) + 9000
      };
    });
    
    return telemetryData;
  };

  const addRadioMessage = () => {
    const messages = [
      { driver: 'VER', message: 'Box this lap, box box!', timestamp: Date.now() },
      { driver: 'HAM', message: 'Ferrari feels amazing, great balance.', timestamp: Date.now() },
      { driver: 'NOR', message: 'DRS not working properly.', timestamp: Date.now() },
      { driver: 'PIA', message: 'Traffic ahead, losing time.', timestamp: Date.now() },
      { driver: 'LEC', message: 'Push now, we can catch them.', timestamp: Date.now() },
      { driver: 'RUS', message: 'These mediums are dropping off.', timestamp: Date.now() },
      { driver: 'ANT', message: 'Learning the car, feeling good.', timestamp: Date.now() },
      { driver: 'TSU', message: 'Red Bull car feels great today.', timestamp: Date.now() },
      { driver: 'ALO', message: 'Strategy looking good from here.', timestamp: Date.now() },
      { driver: 'GAS', message: 'Alpine pace is strong today.', timestamp: Date.now() },
      { driver: 'SAI', message: 'Williams setup working well.', timestamp: Date.now() },
      { driver: 'BEA', message: 'First season going well so far.', timestamp: Date.now() },
      { driver: 'HUL', message: 'Kick Sauber feeling competitive.', timestamp: Date.now() },
      { driver: 'BOR', message: 'Great to be racing in F1.', timestamp: Date.now() },
      { driver: 'COL', message: 'Haas car balance is good.', timestamp: Date.now() }
    ];
    
    const newMessage = messages[Math.floor(Math.random() * messages.length)];
    setDriverRadio(prev => [newMessage, ...prev.slice(0, 4)]);
  };

  const addRaceUpdate = () => {
    const updates = [
      'Virtual Safety Car deployed',
      'DRS enabled',
      'Yellow flag in sector 2',
      'Pit lane open',
      'Track conditions improving',
      'Rain expected in 10 minutes',
      'Safety Car deployed',
      'Race resumed'
    ];
    
    const newUpdate = {
      message: updates[Math.floor(Math.random() * updates.length)],
      timestamp: Date.now()
    };
    
    setRaceUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
  };

  if (!liveData) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Connecting to F1 Live Timing...</div>
      </div>
    );
  }

  return (
    <div className="live-dashboard-page">
      <div className="grid-background"></div>
      
      {/* Top Weather Bar */}
      <div className="weather-race-header">
        <div className="race-title-section">
          <h1 className="race-name">{liveData.raceName}</h1>
          <div className="session-info">
            <span className="session-time">{liveData.sessionTime}</span>
            <span className={`track-status ${liveData.trackStatus.toLowerCase()}`}>
              <div className="status-indicator"></div>
              {liveData.trackStatus}
            </span>
          </div>
        </div>
        
        <div className="weather-header">
          <div className="weather-item-header">
            <span className="weather-label">AIR</span>
            <span className="weather-value">{liveData.weather.airTemp}°C</span>
          </div>
          <div className="weather-item-header">
            <span className="weather-label">TRACK</span>
            <span className="weather-value">{liveData.weather.trackTemp}°C</span>
          </div>
          <div className="weather-item-header">
            <span className="weather-label">HUMIDITY</span>
            <span className="weather-value">{liveData.weather.humidity}%</span>
          </div>
          <div className="weather-item-header">
            <span className="weather-label">WIND</span>
            <span className="weather-value">{liveData.weather.windSpeed} km/h</span>
          </div>
          <div className="connection-status">
            <div className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Left - Driver Positions (Full Height) */}
        <NeonPanel className="positions-panel-new" color="#00D2BE">
          <h2 className="panel-title">RACE POSITIONS</h2>
          <div className="positions-list-new">
            {liveData.positions.map((driver, index) => (
              <div 
                key={driver.pos} 
                className="position-row-new"
                style={{ '--team-color': driver.teamColor, cursor: 'pointer' }}
                onClick={() => navigate(`/driver/${driver.driverId}`)}
              >
                <div className="position-number">P{driver.pos}</div>
                <div className="driver-code">
                  {driver.driver}
                </div>
                <div className="team-name-short">{driver.team.replace(' F1 Team', '').replace(' Racing', '')}</div>
                <div className="gap-time">{driver.gap}</div>
                <div className="last-lap">{driver.lastLap}</div>
                <div className={`sector-indicator ${driver.sector.toLowerCase()}`}>{driver.sector}</div>
              </div>
            ))}
          </div>
        </NeonPanel>

        {/* Right Top - Track Map (Expanded) */}
        <NeonPanel className="trackmap-panel-new" color="#DC143C">
          <h2 className="panel-title">TRACK MAP - SPA-FRANCORCHAMPS</h2>
          <div className="track-container-new">
            <div className="track-outline">
              <svg viewBox="0 0 500 300" className="track-svg">
                <path
                  d="M60 240 L120 220 Q180 200 240 175 Q300 150 360 140 Q420 130 470 150 Q490 170 480 190 L460 210 Q430 230 380 240 L300 250 Q240 255 180 250 L60 240"
                  stroke="#333"
                  strokeWidth="16"
                  fill="none"
                />
                <path
                  d="M60 240 L120 220 Q180 200 240 175 Q300 150 360 140 Q420 130 470 150 Q490 170 480 190 L460 210 Q430 230 380 240 L300 250 Q240 255 180 250 L60 240"
                  stroke="#DC143C"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Dynamic driver positions on track */}
                {liveData.positions.slice(0, 8).map((driver, index) => {
                  const trackPositions = [
                    { x: 140, y: 215 }, // P1
                    { x: 180, y: 205 }, // P2
                    { x: 220, y: 190 }, // P3
                    { x: 260, y: 178 }, // P4
                    { x: 300, y: 165 }, // P5
                    { x: 340, y: 152 }, // P6
                    { x: 380, y: 145 }, // P7
                    { x: 420, y: 148 }  // P8
                  ];
                  const pos = trackPositions[index];
                  
                  return (
                    <g key={driver.pos}>
                      <circle 
                        cx={pos.x} 
                        cy={pos.y} 
                        r="4" 
                        fill={driver.teamColor} 
                      />
                      <text 
                        x={pos.x + 8} 
                        y={pos.y + 4} 
                        fill="#FFFFFF" 
                        fontSize="10" 
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {driver.driver}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </NeonPanel>

        {/* Right Bottom - Telemetry and Radio Container */}
        <div className="telemetry-radio-container">
          {/* Left - Telemetry */}
          <NeonPanel className="telemetry-panel-new" color="#10B981">
            <h2 className="panel-title">LIVE TELEMETRY</h2>
            <div className="telemetry-grid-new">
              {Object.entries(telemetryData).map(([driver, data]) => (
                <div key={driver} className="telemetry-card-new">
                  <div className="telemetry-driver-new">{driver}</div>
                  <div className="telemetry-data-new">
                    <div className="data-row">
                      <span className="data-label">SPD</span>
                      <span className="data-value">{data.speed}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">GEA</span>
                      <span className="data-value">{data.gear}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">RPM</span>
                      <span className="data-value">{data.rpm}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeonPanel>

          {/* Right - Driver Radio */}
          <NeonPanel className="radio-panel-new" color="#FF8700">
            <h2 className="panel-title">DRIVER RADIO 🔊</h2>
            <div className="radio-messages-new">
              {driverRadio.map((msg, index) => (
                <div key={index} className="radio-message-new">
                  <div className="radio-header-new">
                    <span className="driver-code-radio">{msg.driver}</span>
                    <span className="radio-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="radio-text">{msg.message}</div>
                </div>
              ))}
              {driverRadio.length === 0 && (
                <div className="no-radio">No recent radio messages</div>
              )}
            </div>
          </NeonPanel>
        </div>

        {/* Bottom - Race Updates */}
        <NeonPanel className="updates-panel-new" color="#7C3AED">
          <h2 className="panel-title">RACE CONTROL UPDATES</h2>
          <div className="updates-list-new">
            {raceUpdates.map((update, index) => (
              <div key={index} className="update-item-new">
                <div className="update-time">{formatTime(update.timestamp)}</div>
                <div className="update-message">{update.message}</div>
              </div>
            ))}
            {raceUpdates.length === 0 && (
              <div className="no-updates">No recent updates</div>
            )}
          </div>
        </NeonPanel>
      </div>
    </div>
  );
};
const PitWallPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `pitwall_${Date.now()}`);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage('');
    
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await axios.post(`${API}/pit-wall/chat`, {
        message: userMessage,
        session_id: sessionId,
        context: 'F1 Championship 2024 - General pit wall consultation'
      });
      
      setMessages(prev => [...prev, { type: 'ai', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { type: 'ai', content: 'Unable to connect to pit wall. Please try again.' }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="pitwall-page">
      <div className="grid-background"></div>
      <div className="page-header">
        <h1 className="page-title">PIT WALL AI</h1>
        <p className="page-subtitle">Expert F1 Analysis & Strategic Insights</p>
      </div>

      <NeonPanel color="#00D2BE" className="main-pitwall">
        <div className="pitwall-chat">
          <div className="chat-messages-main">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <h3>Welcome to the Pit Wall</h3>
                <p>Ask me about F1 strategy, driver performance, championship analysis, or any racing insights you need.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message-main ${msg.type}`}>
                <div className="message-content-main">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message-main ai">
                <div className="message-content-main">Analyzing F1 data...</div>
              </div>
            )}
          </div>
          <div className="chat-input-main">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about F1 strategy, drivers, teams, or championship analysis..."
              className="message-input-main"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="send-button-main"
            >
              ANALYZE
            </button>
          </div>
        </div>
      </NeonPanel>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/driver/:driverId" element={<DriverPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/team/:teamName" element={<TeamPage />} />
            <Route path="/live" element={<LiveDashboardPage />} />
            <Route path="/pitwall" element={<PitWallPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;