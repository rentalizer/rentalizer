
import React from 'react';
import { BarChart3, User, LogOut, Calendar, MessageSquare, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminSupportButton from '@/components/AdminSupportButton';

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
      name: 'Messages',
      path: '/messages',
      hasNotification: true
    }
  ];

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-slate-700/95 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-cyan-400" style={{
                filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 36px rgba(6, 182, 212, 0.5))'
              }} />
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
                        ? 'text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-gray-300 hover:text-cyan-400'
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-cyan-400" />
                  <span className="text-cyan-300">{user.email}</span>
                  <Badge variant="outline" className="bg-blue-900/30 border-blue-500/30 text-blue-300 text-xs px-2 py-0 ml-2">
                    Pro
                  </Badge>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
            
            {!user && (
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 font-medium"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
