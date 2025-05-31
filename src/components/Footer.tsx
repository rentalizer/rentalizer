
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ContactChat } from './ContactChat';
import { Link } from 'react-router-dom';

interface FooterProps {
  showLinks?: boolean;
}

export const Footer = ({ showLinks = true }: FooterProps) => {
  return (
    <footer className="relative z-10 mt-16 border-t border-gray-500/50 bg-slate-700/90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Logo and Description */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h3>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Create new income streams without owning property. Rentalizer.ai combines powerful market analysis, deal sourcing, and automation tools with a built-in CRM and a thriving community—everything you need to launch and scale your rental arbitrage business
            </p>
          </div>

          {/* Support Links - only show if showLinks is true */}
          {showLinks && (
            <div className="mb-8">
              <div className="flex justify-center gap-6">
                <ContactChat />
                <Link to="/privacy-policy" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Rentalizer. All rights reserved. Built with AI-powered market intelligence.
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
