
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface FooterProps {
  showLinks?: boolean;
}

export const Footer = ({ showLinks = true }: FooterProps) => {
  return (
    <footer className="relative z-10 mt-16 border-t border-gray-500/50 bg-slate-700/90 backdrop-blur-lg w-full">
      <div className="w-full px-6 py-12">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <BarChart3 className="h-8 w-8 text-cyan-400 neon-text" />
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
           <div className="flex items-center gap-2 text-sm">
             <span className="text-gray-400">Powered by</span>
             <a 
               href="https://www.airdna.co" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
             >
               AirDNA
             </a>
             <span className="text-gray-600">•</span>
             <a 
               href="https://openai.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
             >
               OpenAI
             </a>
             <span className="text-gray-600">•</span>
             <a 
               href="https://supabase.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
             >
               Supabase
             </a>
           </div>
        </div>
      </div>
    </footer>
  );
};
