
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const HospitableNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">hospitable</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <DropdownMenu openOnHover={true}>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Product
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Channel Manager</DropdownMenuItem>
                <DropdownMenuItem>Pricing</DropdownMenuItem>
                <DropdownMenuItem>Guest Communication</DropdownMenuItem>
                <DropdownMenuItem>Reviews</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu openOnHover={true}>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Blog</DropdownMenuItem>
                <DropdownMenuItem>Help Center</DropdownMenuItem>
                <DropdownMenuItem>Webinars</DropdownMenuItem>
                <DropdownMenuItem>Case Studies</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Log in
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Start free trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
