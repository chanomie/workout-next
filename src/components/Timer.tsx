import React from 'react';
import { getAssetPath } from '@/lib/paths';

interface TimerProps {
  duration: number;
  remainingTime: number;
  size?: number;
  strokeWidth?: number;
  backgroundImage?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  remainingTime, 
  size = 250, 
  strokeWidth = 12,
  backgroundImage
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate progress safely
  const progress = duration > 0 ? remainingTime / duration : 0;
  
  // Drains from full to empty
  const offset = circumference * (1 - progress);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '2rem auto' }}>
      {backgroundImage && (
        <div style={{
          position: 'absolute',
          top: strokeWidth,
          left: strokeWidth,
          right: strokeWidth,
          bottom: strokeWidth,
          borderRadius: '50%',
          overflow: 'hidden',
          opacity: 0.8,
          zIndex: 0
        }}>
          <img 
            src={getAssetPath(backgroundImage)} 
            alt="" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      )}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'relative', zIndex: 1 }}>
        {/* Background circle (the "track") */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="timer-track"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle (the "drainable" part) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="timer-progress"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
    </div>
  );
};
