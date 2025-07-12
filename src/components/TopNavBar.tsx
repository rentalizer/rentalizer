
import React from 'react';
import { BarChart3, User, LogOut, Calendar, MessageSquare, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const TopNavBar = () => {
  const { user, signOut, isLoading } = useAuth();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      console.log('🔄 TopNavBar: Starting logout process...');
      await signOut();
      console.log('✅ TopNavBar: Logout completed');
    } catch (error) {
      console.error('❌ TopNavBar: Error signing out:', error);
    }
  };

  const navigationItems = [
    {
      name: 'Today',
      path: '/',
    },
    {
      name: 'Calendar',
      path: '/calendar',
    },
    {
      name: 'Listings',
      path: '/listings',
    },
    {
      name: 'Messages',
      path: '/messages',
      hasNotification: true
    }
  ];

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-red-500" />
            </Link>
          </div>

          {/* Center - Navigation (only show for logged-in users) */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = isActiveTab(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                    {item.hasNotification && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs px-1 py-0 min-w-[16px] h-4 rounded-full">
                        1
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side - Menu and User */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                 <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                   Menu
                 </Button>
                 <Button
                   onClick={() => navigate('/profile-setup')}
                   variant="ghost"
                   size="sm"
                   className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                 >
                   <span className="hidden sm:inline">{user.email}</span>
                   <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                     <User className="h-4 w-4 text-white" />
                   </div>
                 </Button>
              </>
            )}
            
            {!user && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open('mailto:support@rentalizer.com', '_blank')}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Contact Us
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
