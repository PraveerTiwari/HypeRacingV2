import React from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { TEAM_COLORS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { Driver } from '@/types';

async function getDrivers(): Promise<Driver[]> {
  try {
    const drivers = await apiService.getDriverStandings();
    return drivers;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

export default async function DriversPage() {
  const drivers = await getDrivers();

  return (
    <div className="drivers-page">
      <div className="page-header">
        <h1 className="page-title">DRIVERS</h1>
        <p className="page-subtitle">2025 Season Championship Standings</p>
      </div>

      <div className="drivers-grid">
        {drivers.map((driver) => {
          const teamColor = TEAM_COLORS[driver.team] || '#00D2BE';
          
          return (
            <Link 
              key={driver.driver_id} 
              href={`/drivers/${driver.driver_id}`}
              className="driver-card"
            >
              <NeonPanel color={teamColor}>
                <div className="driver-card-content">
                  <div className="driver-position-badge">P{driver.position}</div>
                  <div className="driver-details">
                    <h3 className="driver-name">{driver.name}</h3>
                    <p className="driver-team">{driver.team}</p>
                    <div className="driver-stats">
                      <div className="stat">
                        <span className="stat-value">{driver.points}</span>
                        <span className="stat-label">PTS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </NeonPanel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}