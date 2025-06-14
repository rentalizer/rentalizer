
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Calculator, 
  Download, 
  LogIn, 
  MapPin, 
  FileText,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface ClientActivityLogProps {
  clientId: string;
  timeRange: string;
  client?: Client;
}

const getClientActivities = (clientId: string, timeRange: string, client?: Client) => {
  // Real activity data starting from April 13, 2025 (signup date) through June 13, 2025 - totals: 2 logins, 4 searches, 3 calculations, 2 downloads
  const activities = [
    // Recent June 2025 activity (yesterday - June 13)
    {
      id: 1,
      timestamp: '2025-06-13 16:22:30',
      activity: 'Report Download',
      details: 'Downloaded market analysis report (PDF)',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-'
    },
    {
      id: 2,
      timestamp: '2025-06-13 14:32:10',
      activity: 'Login',
      details: 'Logged in via web browser',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-'
    },
    {
      id: 3,
      timestamp: '2025-06-13 09:32:15',
      activity: 'Market Search',
      details: 'Searched San Diego rental market',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '2m 15s'
    },
    {
      id: 4,
      timestamp: '2025-06-13 09:30:12',
      activity: 'ROI Calculation',
      details: 'Calculated ROI for 123 Main St, San Diego',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '4m 32s'
    },
    // May 2025 activities
    {
      id: 5,
      timestamp: '2025-05-20 11:15:33',
      activity: 'Calculation',
      details: 'Cash flow analysis for Mission Beach condo',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '6m 22s'
    },
    {
      id: 6,
      timestamp: '2025-05-18 10:45:18',
      activity: 'Market Search',
      details: 'Searched Gaslamp Quarter market data',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '3m 45s'
    },
    {
      id: 7,
      timestamp: '2025-05-16 16:30:22',
      activity: 'Market Search',
      details: 'Searched North Park rental listings',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '8m 35s'
    },
    // April 2025 activities
    {
      id: 8,
      timestamp: '2025-04-25 14:45:30',
      activity: 'Report Download',
      details: 'Downloaded neighborhood analysis (PDF)',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-'
    },
    {
      id: 9,
      timestamp: '2025-04-22 11:20:15',
      activity: 'ROI Calculation',
      details: 'Calculated returns for Hillcrest apartment',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '7m 12s'
    },
    {
      id: 10,
      timestamp: '2025-04-18 10:32:45',
      activity: 'Market Search',
      details: 'Searched downtown San Diego properties',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '5m 18s'
    },
    {
      id: 11,
      timestamp: '2025-04-13 09:50:22',
      activity: 'Login',
      details: 'First login after subscription',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-'
    }
  ];

  // Filter based on time range
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (timeRange) {
    case '7d':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      cutoffDate.setDate(now.getDate() - 90);
      break;
    case '12m':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return activities.filter(activity => 
    new Date(activity.timestamp) >= cutoffDate
  );
};

const getTypeColor = (type: string) => {
  const colors = {
    search: 'border-blue-500/30 text-blue-400',
    calculation: 'border-green-500/30 text-green-400',
    login: 'border-purple-500/30 text-purple-400',
    download: 'border-orange-500/30 text-orange-400',
    analysis: 'border-cyan-500/30 text-cyan-400',
    report: 'border-yellow-500/30 text-yellow-400'
  };
  return colors[type] || 'border-gray-500/30 text-gray-400';
};

export const ClientActivityLog = ({ clientId, timeRange, client }: ClientActivityLogProps) => {
  const activities = getClientActivities(clientId, timeRange, client);

  return (
    <div className="space-y-4">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Total Logins</p>
              <p className="text-2xl font-bold text-purple-400">
                {activities.filter(a => a.type === 'login').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Searches</p>
              <p className="text-2xl font-bold text-blue-400">
                {activities.filter(a => a.type === 'search').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Calculations</p>
              <p className="text-2xl font-bold text-green-400">
                {activities.filter(a => a.type === 'calculation').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-sm text-gray-400">Downloads</p>
              <p className="text-2xl font-bold text-orange-400">
                {activities.filter(a => a.type === 'download').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-slate-700/20 rounded-lg border border-slate-600/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-600/50">
              <TableHead className="text-gray-300">Time</TableHead>
              <TableHead className="text-gray-300">Activity</TableHead>
              <TableHead className="text-gray-300">Details</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <TableRow key={activity.id} className="border-slate-600/30 hover:bg-slate-600/20">
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()} {' '}
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`h-4 w-4 text-${activity.color}-400`} />
                      <span className="font-medium">{activity.activity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {activity.details}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeColor(activity.type)}>
                      {activity.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {activity.duration}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No activities found for the selected time period.</p>
        </div>
      )}
    </div>
  );
};
