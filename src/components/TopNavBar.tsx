
import React from 'react';
import { BarChart3, User, LogOut, Users, TrendingUp, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const TopNavBar = () => {
  const { user, signOut } = useAuth();
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
      // Don't redirect on error - let the current page handle the logged-out state
    }
  };

  const navigationTabs = [
    {
      name: 'Training & Community',
      path: '/community',
      icon: Users
    },
    {
      name: 'Market Intelligence',
      path: '/markets',
      icon: TrendingUp
    },
    {
      name: 'Acquisition CRM',
      path: '/properties',
      icon: Building
    },
    {
      name: 'Property Management',
      path: '/pms',
      icon: null,
      emoji: '🫶'
    }
  ];

  const isActiveTab = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full bg-slate-700/90 backdrop-blur-lg border-b border-gray-500/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-cyan-400" style={{
              filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 1)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.9)) drop-shadow(0 0 18px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 36px rgba(6, 182, 212, 0.5))'
            }} />
          </div>

          {/* Center - Navigation Tabs */}
          <div className="flex items-center gap-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = isActiveTab(tab.path);
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gray-600/20 text-gray-300 border border-gray-500/30'
                      : 'text-gray-300 hover:bg-slate-600/50 hover:text-gray-300'
                  }`}
                >
                  {tab.emoji ? (
                    <span className="text-base grayscale brightness-75">{tab.emoji}</span>
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{tab.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Login or User info */}
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-2 text-sm bg-gray-900/50 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => {
                  alert('Profile button clicked! Navigating to profile setup...');
                  console.log('🔧 Profile button clicked!');
                  navigate('/profile-setup');
                }}
                type="button"
                title="Click to edit your profile"
              >
                <User className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300 pointer-events-none">{user.email}</span>
                <Badge 
                  variant="outline" 
                  className="bg-green-900/30 border-green-500/30 text-green-300 text-xs px-2 py-0 pointer-events-none"
                >
                  {isAdmin ? 'Admin' : 'Pro'}
                </Badge>
              </button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
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
  );
};
