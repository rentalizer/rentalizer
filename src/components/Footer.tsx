
import React from 'react';

interface FooterProps {
  showLinks?: boolean;
}

export const Footer = ({ showLinks = true }: FooterProps) => {
  return (
    <footer className="relative z-10 mt-16 border-t border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <img 
                src="/lovable-uploads/f01a7927-4318-452b-8513-c35042097178.png" 
                alt="Rentalizer Logo" 
                className="h-16 w-16"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h3>
            </div>
          </div>
        </div>

        {/* Copyright and Powered by */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Rentalizer. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-400">Powered by</span>
            <div className="flex items-center gap-4">
              <span className="text-cyan-300 font-medium">AirDNA</span>
              <span className="text-purple-300 font-medium">OpenAI</span>
              <span className="text-blue-300 font-medium">Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
