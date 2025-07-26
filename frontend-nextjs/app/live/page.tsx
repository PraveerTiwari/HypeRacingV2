'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateLivePositions, generateTelemetryData, formatTime } from '@/lib/api';
import { RADIO_MESSAGES, RACE_UPDATES, TRACK_POSITIONS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { LiveData, RadioMessage, RaceUpdate, TelemetryData } from '@/types';

export default function LiveDashboardPage() {
  const router = useRouter();
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [driverRadio, setDriverRadio] = useState<RadioMessage[]>([]);
  const [raceUpdates, setRaceUpdates] = useState<RaceUpdate[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});

  useEffect(() => {
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
    }, 2000);

    // Radio messages update
    const radioInterval = setInterval(() => {
      addRadioMessage();
    }, 5000);

    // Race updates
    const updatesInterval = setInterval(() => {
      addRaceUpdate();
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(radioInterval);
      clearInterval(updatesInterval);
    };
  };

  const disconnectF1SignalR = () => {
    setIsConnected(false);
  };

  const addRadioMessage = () => {
    const newMessage = RADIO_MESSAGES[Math.floor(Math.random() * RADIO_MESSAGES.length)];
    setDriverRadio(prev => [newMessage, ...prev.slice(0, 4)]);
  };

  const addRaceUpdate = () => {
    const newUpdate = {
      message: RACE_UPDATES[Math.floor(Math.random() * RACE_UPDATES.length)],
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
                style={{ '--team-color': driver.teamColor, cursor: 'pointer' } as React.CSSProperties}
                onClick={() => router.push(`/drivers/${driver.driverId}`)}
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
                  const pos = TRACK_POSITIONS[index];
                  
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
              {Object.entries(telemetryData).slice(0, 10).map(([driver, data]) => (
                <div key={driver} className="telemetry-item">
                  <div className="driver-code-telemetry">{driver}</div>
                  <div className="telemetry-data">
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
}