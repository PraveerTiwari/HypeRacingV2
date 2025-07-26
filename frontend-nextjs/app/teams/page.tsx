import React from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { TEAM_COLORS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { Driver } from '@/types';

async function getTeamsData() {
  try {
    const drivers = await apiService.getDriverStandings();
    
    // Group drivers by team
    const teams = drivers.reduce((acc: { [key: string]: Driver[] }, driver) => {
      if (!acc[driver.team]) {
        acc[driver.team] = [];
      }
      acc[driver.team].push(driver);
      return acc;
    }, {});

    return Object.entries(teams);
  } catch (error) {
    console.error('Error fetching teams data:', error);
    return [];
  }
}

export default async function TeamsPage() {
  const teams = await getTeamsData();

  return (
    <div className="teams-page">
      <div className="page-header">
        <h1 className="page-title">CONSTRUCTORS</h1>
        <p className="page-subtitle">2025 Season Teams</p>
      </div>

      <div className="teams-grid">
        {teams.map(([teamName, teamDrivers]) => (
          <Link 
            key={teamName} 
            href={`/teams/${encodeURIComponent(teamName)}`}
            className="team-card"
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
}