import axios from 'axios';
import { API_BASE_URL } from './constants';
import { Driver, PitWallChatRequest, PitWallChatResponse, ApiResponse } from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service Functions
export const apiService = {
  // Health check
  async health(): Promise<{ status: string }> {
    const response = await api.get('/api/health');
    return response.data;
  },

  // Driver standings
  async getDriverStandings(): Promise<Driver[]> {
    const response = await api.get('/api/drivers/standings');
    return response.data;
  },

  // Recent races
  async getRecentRaces(): Promise<any[]> {
    const response = await api.get('/api/races/recent');
    return response.data;
  },

  // Pit wall chat
  async sendPitWallMessage(data: PitWallChatRequest): Promise<PitWallChatResponse> {
    const response = await api.post('/api/pit-wall/chat', data);
    return response.data;
  },

  // Chat history
  async getChatHistory(sessionId: string): Promise<any[]> {
    const response = await api.get(`/api/pit-wall/history?session_id=${sessionId}`);
    return response.data;
  },
};

// Live data generation functions (client-side simulated data)
export const generateLivePositions = () => {
  const drivers = [
    { pos: 1, driver: 'VER', driverId: 'verstappen', team: 'Red Bull Racing', gap: '+0.000', lastLap: '1:23.456', sector: 'S2' as const },
    { pos: 2, driver: 'HAM', driverId: 'hamilton', team: 'Ferrari', gap: '+0.234', lastLap: '1:23.690', sector: 'S1' as const },
    { pos: 3, driver: 'NOR', driverId: 'norris', team: 'McLaren', gap: '+1.567', lastLap: '1:25.023', sector: 'S3' as const },
    { pos: 4, driver: 'PIA', driverId: 'piastri', team: 'McLaren', gap: '+2.890', lastLap: '1:24.346', sector: 'S2' as const },
    { pos: 5, driver: 'LEC', driverId: 'leclerc', team: 'Ferrari', gap: '+3.456', lastLap: '1:24.912', sector: 'S1' as const },
    { pos: 6, driver: 'RUS', driverId: 'russell', team: 'Mercedes', gap: '+4.123', lastLap: '1:25.579', sector: 'S3' as const },
    { pos: 7, driver: 'ANT', driverId: 'antonelli', team: 'Mercedes', gap: '+5.789', lastLap: '1:26.234', sector: 'S2' as const },
    { pos: 8, driver: 'TSU', driverId: 'tsunoda', team: 'Red Bull Racing', gap: '+6.234', lastLap: '1:26.690', sector: 'S1' as const },
    { pos: 9, driver: 'ALO', driverId: 'alonso', team: 'Aston Martin', gap: '+7.456', lastLap: '1:27.123', sector: 'S3' as const },
    { pos: 10, driver: 'STR', driverId: 'stroll', team: 'Aston Martin', gap: '+8.789', lastLap: '1:27.890', sector: 'S2' as const },
    { pos: 11, driver: 'GAS', driverId: 'gasly', team: 'Alpine F1 Team', gap: '+9.123', lastLap: '1:28.456', sector: 'S1' as const },
    { pos: 12, driver: 'DOO', driverId: 'doohan', team: 'Alpine F1 Team', gap: '+10.567', lastLap: '1:29.123', sector: 'S3' as const },
    { pos: 13, driver: 'HAD', driverId: 'hadjar', team: 'RB F1 Team', gap: '+11.890', lastLap: '1:29.789', sector: 'S2' as const },
    { pos: 14, driver: 'LAW', driverId: 'lawson', team: 'RB F1 Team', gap: '+12.456', lastLap: '1:30.234', sector: 'S1' as const },
    { pos: 15, driver: 'BEA', driverId: 'bearman', team: 'Haas F1 Team', gap: '+13.789', lastLap: '1:30.890', sector: 'S3' as const },
    { pos: 16, driver: 'COL', driverId: 'colapinto', team: 'Haas F1 Team', gap: '+14.123', lastLap: '1:31.456', sector: 'S2' as const },
    { pos: 17, driver: 'ALB', driverId: 'albon', team: 'Williams', gap: '+15.567', lastLap: '1:32.123', sector: 'S1' as const },
    { pos: 18, driver: 'SAI', driverId: 'sainz', team: 'Williams', gap: '+16.890', lastLap: '1:32.789', sector: 'S3' as const },
    { pos: 19, driver: 'HUL', driverId: 'hulkenberg', team: 'Kick Sauber', gap: '+17.456', lastLap: '1:33.234', sector: 'S2' as const },
    { pos: 20, driver: 'BOR', driverId: 'bortoleto', team: 'Kick Sauber', gap: '+18.123', lastLap: '1:33.890', sector: 'S1' as const }
  ];

  // Add some randomness to gaps and lap times
  return drivers.map(driver => ({
    ...driver,
    gap: driver.pos === 1 ? '+0.000' : `+${(Math.random() * 10 + driver.pos * 0.8).toFixed(3)}`,
    lastLap: `1:2${Math.floor(Math.random() * 7) + 3}.${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    teamColor: require('./constants').TEAM_COLORS[driver.team] || '#00D2BE'
  }));
};

export const generateTelemetryData = () => {
  const allDrivers = ['VER', 'HAM', 'NOR', 'PIA', 'LEC', 'RUS', 'ANT', 'TSU', 'ALO', 'STR', 
                     'GAS', 'DOO', 'HAD', 'LAW', 'BEA', 'COL', 'ALB', 'SAI', 'HUL', 'BOR'];
  
  const telemetryData: { [key: string]: any } = {};
  allDrivers.forEach(driver => {
    telemetryData[driver] = {
      speed: Math.floor(Math.random() * 50) + 250 + (driver === 'VER' ? 30 : 0),
      gear: Math.floor(Math.random() * 6) + 2,
      rpm: Math.floor(Math.random() * 3000) + 9000
    };
  });
  
  return telemetryData;
};

export const formatTime = (timestamp: number): string => {
  const now = new Date(timestamp);
  const minutes = Math.floor((now.getTime() % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((now.getTime() % (1000 * 60)) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default api;