
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
        className="drop-shadow-2xl"
      >
        {/* 3D Cube Structure */}
        {/* Front face */}
        <path 
          d="M4 8 L20 8 L20 24 L4 24 Z" 
          fill="url(#frontGradient)" 
          stroke="#06b6d4" 
          strokeWidth="0.8"
        />
        
        {/* Top face */}
        <path 
          d="M4 8 L8 4 L24 4 L20 8 Z" 
          fill="url(#topGradient)" 
          stroke="#06b6d4" 
          strokeWidth="0.8"
        />
        
        {/* Right face */}
        <path 
          d="M20 8 L24 4 L24 20 L20 24 Z" 
          fill="url(#rightGradient)" 
          stroke="#06b6d4" 
          strokeWidth="0.8"
        />

        {/* Windows on front face with cyan glow */}
        <rect x="6" y="10" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        <rect x="11" y="10" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        <rect x="15" y="10" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        
        <rect x="6" y="15" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        <rect x="11" y="15" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        <rect x="15" y="15" width="3" height="3" fill="#06b6d4" opacity="0.9" />

        <rect x="6" y="20" width="3" height="3" fill="#06b6d4" opacity="0.9" />
        <rect x="15" y="20" width="3" height="3" fill="#06b6d4" opacity="0.9" />

        {/* Door with purple accent */}
        <rect x="11" y="20" width="3" height="4" fill="#8b5cf6" />

        {/* Gradients for futuristic 3D effect */}
        <defs>
          <linearGradient id="frontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
          
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          
          <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#164e63" />
          </linearGradient>
          
          {/* Glow filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};
