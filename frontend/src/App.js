import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Team color mapping for neon borders
const TEAM_COLORS = {
  'Red Bull Racing': '#0600EF',
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
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">RACES</div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-grid">
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

        {/* Live Dashboard Link */}
        <Link to="/live" className="dashboard-link">
          <NeonPanel color="#DC143C" className="dashboard-panel">
            <h2 className="panel-title">LIVE DASHBOARD</h2>
            <p className="panel-description">Real-time race positions and timing</p>
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>LIVE DATA</span>
            </div>
          </NeonPanel>
        </Link>

        {/* Top Drivers Preview */}
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

// Pit Wall Page
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
            <Route path="/pitwall" element={<PitWallPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;