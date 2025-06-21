
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calculator, 
  Search, 
  Building2, 
  MessageCircle, 
  Users, 
  Menu, 
  X,
  Database,
  Home
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginDialog } from './LoginDialog';

export const TopNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/',
      description: 'Main Dashboard'
    },
    { 
      icon: Calculator, 
      label: 'Calculator', 
      path: '/calculator',
      description: 'Deal Analysis'
    },
    { 
      icon: Search, 
      label: 'Market Research', 
      path: '/market-analysis',
      description: 'Market Intelligence'
    },
    { 
      icon: Building2, 
      label: 'Acquisitions', 
      path: '/acquisitions',
      description: 'Property Sourcing'
    },
    { 
      icon: MessageCircle, 
      label: 'Ask Richie AI', 
      path: '/askrichie',
      description: 'AI Assistant'
    },
    { 
      icon: Database, 
      label: 'Content Manager', 
      path: '/content-manager',
      description: 'Knowledge Base'
    },
    { 
      icon: Users, 
      label: 'Community', 
      path: '/community',
      description: 'Connect & Learn'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer mr-6"
          onClick={() => handleNavigation('/')}
        >
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">RENTALIZER</h1>
            <p className="text-xs text-muted-foreground leading-none">Rental Intelligence Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className="flex items-center gap-2 relative"
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.path === '/askrichie' && (
                  <Badge variant="secondary" className="ml-1 text-xs">AI</Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <LoginDialog 
              trigger={
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              }
            />
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container py-4">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item.path)}
                    className="justify-start gap-3 h-auto py-3"
                  >
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        {item.label}
                        {item.path === '/askrichie' && (
                          <Badge variant="secondary" className="text-xs">AI</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
