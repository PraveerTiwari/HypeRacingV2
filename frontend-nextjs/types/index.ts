// Common Types for HypeRacing F1 Application

export interface Driver {
  driver_id: string;
  name: string;
  team: string;
  position: number;
  points: number;
  nationality?: string;
  number?: number;
}

export interface Team {
  name: string;
  drivers: Driver[];
  points: number;
  color: string;
}

export interface LivePosition {
  pos: number;
  driver: string;
  driverId: string;
  team: string;
  gap: string;
  lastLap: string;
  sector: 'S1' | 'S2' | 'S3';
  teamColor: string;
}

export interface TelemetryData {
  [driverCode: string]: {
    speed: number;
    gear: number;
    rpm: number;
  };
}

export interface RadioMessage {
  driver: string;
  message: string;
  timestamp: number;
}

export interface RaceUpdate {
  message: string;
  timestamp: number;
}

export interface LiveData {
  sessionTime: string;
  sessionType: string;
  trackStatus: 'GREEN' | 'YELLOW' | 'RED';
  raceName: string;
  positions: LivePosition[];
  weather: {
    airTemp: number;
    trackTemp: number;
    humidity: number;
    windSpeed: number;
  };
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp?: number;
}

export interface TeamColors {
  [teamName: string]: string;
}

export interface RaceAnalytics {
  avgLaptime: string;
  avgPosition: string;
  fastestLap: string;
  bestFinish: string;
  bestQualifying: string;
  spaPodiums?: number;
  spaWins?: number;
}

export interface PerformanceStats {
  raceWins: number;
  podiums: number;
  fastestLaps: number;
  pointsPerRace: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PitWallChatRequest {
  message: string;
  session_id: string;
  context?: string;
}

export interface PitWallChatResponse {
  response: string;
  session_id: string;
}

// Page Props Types
export interface DriverPageProps {
  driver: Driver;
  raceAnalytics: RaceAnalytics;
  performanceStats: PerformanceStats;
}

export interface TeamPageProps {
  team: Team;
  drivers: Driver[];
  raceAnalytics: RaceAnalytics;
  performanceStats: PerformanceStats;
}

export interface HomePageProps {
  drivers: Driver[];
  news: NewsItem[];
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
}