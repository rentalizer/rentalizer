import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import AdminSupportMessaging from './messaging/AdminSupportMessaging';

export default function AdminSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin } = useAdminRole();
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();

  // Don't show the button if user is not authenticated
  if (!user) {
    return null;
  }

  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border-2 border-border shadow-2xl rounded-xl w-full max-w-6xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-border bg-muted/20 rounded-t-xl">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {isAdmin ? 'Admin Support Center' : 'Support Chat'}
              </h2>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-destructive/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-background rounded-b-xl">
            <AdminSupportMessaging />
          </div>
        </div>
      </div>
    );
  }


  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="outline"
      className="relative"
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {isAdmin ? 'Support Center' : 'Support'}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full min-w-5 h-5 text-xs flex items-center justify-center px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Button>
  );
}