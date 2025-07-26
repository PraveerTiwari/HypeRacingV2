import { TeamColors } from '@/types';

// Team color mapping for neon borders
export const TEAM_COLORS: TeamColors = {
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

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

// Default News Items
export const DEFAULT_NEWS = [
  { id: 1, title: 'Formula 1 Championship Battle Intensifies', summary: 'Latest updates from the championship standings' },
  { id: 2, title: 'Technical Regulations Update', summary: 'New aerodynamic rules for upcoming season' },
  { id: 3, title: 'Driver Market Analysis', summary: 'Potential moves and contract negotiations' }
];

// Track Positions for Map Visualization
export const TRACK_POSITIONS = [
  { x: 140, y: 215 }, // P1
  { x: 180, y: 205 }, // P2
  { x: 220, y: 190 }, // P3
  { x: 260, y: 178 }, // P4
  { x: 300, y: 165 }, // P5
  { x: 340, y: 152 }, // P6
  { x: 380, y: 145 }, // P7
  { x: 420, y: 148 }  // P8
];

// Radio Messages Templates
export const RADIO_MESSAGES = [
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

// Race Control Updates Templates
export const RACE_UPDATES = [
  'Race started under green flag conditions',
  'Virtual Safety Car deployed',
  'DRS enabled for all drivers',
  'Weather update: Clear conditions expected',
  'Track conditions improving',
  'Rain expected in 10 minutes',
  'Safety Car deployed',
  'Race resumed'
];