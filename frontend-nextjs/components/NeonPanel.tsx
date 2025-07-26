import React from 'react';

interface NeonPanelProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const NeonPanel: React.FC<NeonPanelProps> = ({ 
  children, 
  color = '#00D2BE', 
  className = '' 
}) => {
  const style = {
    '--neon-color': color,
  } as React.CSSProperties;

  return (
    <div 
      className={`neon-panel ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default NeonPanel;