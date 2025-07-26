import React from 'react';
import Link from 'next/link';
import { apiService } from '@/lib/api';
import { DEFAULT_NEWS } from '@/lib/constants';
import NeonPanel from '@/components/NeonPanel';
import { Driver, NewsItem } from '@/types';

async function getDrivers(): Promise<Driver[]> {
  try {
    const drivers = await apiService.getDriverStandings();
    return drivers.slice(0, 6); // Top 6 for home preview
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
}

export default async function HomePage() {
  const drivers = await getDrivers();
  const news: NewsItem[] = DEFAULT_NEWS;

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">FORMULA 1 ANALYTICS</h1>
          <p className="hero-subtitle">Real-time data • AI insights • Championship analysis</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">20</div>
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

      <section className="home-content">
        <div className="home-grid">
          {/* Live Dashboard Link */}
          <div className="dashboard-link">
            <NeonPanel color="#DC143C">
              <Link href="/live" className="dashboard-content">
                <div className="dashboard-main">
                  <h2 className="dashboard-title">LIVE DASHBOARD</h2>
                  <p className="dashboard-subtitle">Real-time race data and telemetry</p>
                </div>
                <div className="race-countdown">
                  <div className="countdown-label">NEXT RACE</div>
                  <div className="countdown-timer">
                    <div className="countdown-item">
                      <div className="countdown-number">02</div>
                      <div className="countdown-label">DAYS</div>
                    </div>
                    <div className="countdown-item">
                      <div className="countdown-number">14</div>
                      <div className="countdown-label">HRS</div>
                    </div>
                  </div>
                </div>
              </Link>
            </NeonPanel>
          </div>

          {/* News Section */}
          <div className="news-section">
            <NeonPanel color="#00D2BE">
              <h3 className="section-title">LATEST NEWS</h3>
              <div className="news-list">
                {news.map((item) => (
                  <div key={item.id} className="news-item">
                    <h4 className="news-title">{item.title}</h4>
                    <p className="news-summary">{item.summary}</p>
                  </div>
                ))}
              </div>
            </NeonPanel>
          </div>

          {/* Drivers Preview */}
          <div className="drivers-preview">
            <NeonPanel color="#FF8700">
              <div className="section-header">
                <h3 className="section-title">CHAMPIONSHIP LEADERS</h3>
                <Link href="/drivers" className="view-all-link">VIEW ALL</Link>
              </div>
              <div className="drivers-list">
                {drivers.map((driver) => (
                  <Link 
                    key={driver.driver_id} 
                    href={`/drivers/${driver.driver_id}`}
                    className="driver-preview-item"
                  >
                    <div className="driver-position">P{driver.position}</div>
                    <div className="driver-info">
                      <div className="driver-name">{driver.name}</div>
                      <div className="driver-team">{driver.team}</div>
                    </div>
                    <div className="driver-points">{driver.points}</div>
                  </Link>
                ))}
              </div>
            </NeonPanel>
          </div>
        </div>
      </section>
    </div>
  );
}