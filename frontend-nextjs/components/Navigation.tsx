'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/drivers', label: 'DRIVERS' },
    { href: '/teams', label: 'TEAMS' },
    { href: '/live', label: 'LIVE' },
    { href: '/pitwall', label: 'PIT WALL' },
  ];

  return (
    <nav className="nav-container">
      <div className="nav-brand">
        <Link href="/">
          <span className="brand-text">HYPE<span className="brand-accent">RACING</span></span>
        </Link>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${pathname === item.href ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;