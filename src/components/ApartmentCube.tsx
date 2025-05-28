
import React from 'react';

interface ApartmentCubeProps {
  size?: number;
  className?: string;
}

export const ApartmentCube: React.FC<ApartmentCubeProps> = ({ size = 32, className = "" }) => {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        className="drop-shadow-lg"
      >
        {/* 3D Cube Structure */}
        {/* Front face */}
        <path 
          d="M4 8 L20 8 L20 24 L4 24 Z" 
          fill="url(#frontGradient)" 
          stroke="#1e40af" 
          strokeWidth="0.5"
        />
        
        {/* Top face */}
        <path 
          d="M4 8 L8 4 L24 4 L20 8 Z" 
          fill="url(#topGradient)" 
          stroke="#1e40af" 
          strokeWidth="0.5"
        />
        
        {/* Right face */}
        <path 
          d="M20 8 L24 4 L24 20 L20 24 Z" 
          fill="url(#rightGradient)" 
          stroke="#1e40af" 
          strokeWidth="0.5"
        />

        {/* Windows on front face */}
        <rect x="6" y="10" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        <rect x="11" y="10" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        <rect x="15" y="10" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        
        <rect x="6" y="15" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        <rect x="11" y="15" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        <rect x="15" y="15" width="3" height="3" fill="#60a5fa" opacity="0.8" />

        <rect x="6" y="20" width="3" height="3" fill="#60a5fa" opacity="0.8" />
        <rect x="15" y="20" width="3" height="3" fill="#60a5fa" opacity="0.8" />

        {/* Door */}
        <rect x="11" y="20" width="3" height="4" fill="#3730a3" />

        {/* Gradients for 3D effect */}
        <defs>
          <linearGradient id="frontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          
          <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
