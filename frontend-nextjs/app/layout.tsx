import React from 'react';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';
import '@/styles/pitwall.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>HypeRacing - Formula 1 Analytics</title>
        <meta name="description" content="Real-time F1 data, AI insights, and championship analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="app">
          <div className="grid-background"></div>
          <Navigation />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}