
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Mail, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { ContactChat } from './ContactChat';

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 border-t border-gray-700/50 bg-gray-900/60 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-cyan-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The ultimate AI-powered platform for analyzing short-term rental market opportunities. 
              Make data-driven investment decisions with professional market insights.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-300">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-300">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-300">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-300">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Market Analysis
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Revenue Calculator
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  API Access
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Professional Data
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  AI Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold text-cyan-300 mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <ContactChat />
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-gray-300 hover:text-cyan-300 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 iStay USA LLC. All rights reserved. Built with AI-powered market intelligence.
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
