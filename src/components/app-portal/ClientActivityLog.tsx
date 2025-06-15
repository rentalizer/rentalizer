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
  Activity,
  ExternalLink
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
  // Client 1 (Ramakrishna) - Original data
  const client1Activities = [
    // Recent June 2025 activity
    {
      id: 1,
      timestamp: '2025-06-13 16:22:30',
      activity: 'Report Download',
      details: 'Downloaded market analysis report (PDF)',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-',
      link: '/reports/market-analysis-20250613'
    },
    {
      id: 2,
      timestamp: '2025-06-13 14:32:10',
      activity: 'Login',
      details: 'Logged in via web browser',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250613143210'
    },
    {
      id: 3,
      timestamp: '2025-06-13 09:32:15',
      activity: 'Market Search',
      details: 'Searched San Diego rental market',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '2m 15s',
      link: '/searches/san-diego-rental-20250613'
    },
    {
      id: 4,
      timestamp: '2025-06-13 09:30:12',
      activity: 'ROI Calculation',
      details: 'Calculated ROI for 123 Main St, San Diego',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '4m 32s',
      link: '/calculations/roi-123main-20250613'
    },
    // May 2025 activities
    {
      id: 5,
      timestamp: '2025-05-20 11:15:33',
      activity: 'Cash Flow Calculation',
      details: 'Cash flow analysis for Mission Beach condo',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '6m 22s',
      link: '/calculations/cashflow-mission-beach-20250520'
    },
    {
      id: 6,
      timestamp: '2025-05-18 10:45:18',
      activity: 'Market Search',
      details: 'Searched Gaslamp Quarter market data',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '3m 45s',
      link: '/searches/gaslamp-quarter-20250518'
    },
    {
      id: 7,
      timestamp: '2025-05-16 16:30:22',
      activity: 'Market Search',
      details: 'Searched North Park rental listings',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '8m 35s',
      link: '/searches/north-park-20250516'
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
      duration: '-',
      link: '/reports/neighborhood-analysis-20250425'
    },
    {
      id: 9,
      timestamp: '2025-04-22 11:20:15',
      activity: 'Investment Calculation',
      details: 'Calculated returns for Hillcrest apartment',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '7m 12s',
      link: '/calculations/investment-hillcrest-20250422'
    },
    {
      id: 10,
      timestamp: '2025-04-18 10:32:45',
      activity: 'Property Search',
      details: 'Searched downtown San Diego properties',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '5m 18s',
      link: '/searches/downtown-sd-20250418'
    },
    {
      id: 11,
      timestamp: '2025-04-13 09:50:22',
      activity: 'First Login',
      details: 'First login after subscription',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250413095022'
    }
  ];

  // Client 2 (Ifeanyi Okoye) - Updated client data
  const client2Activities = [
    // May 2025
    {
      id: 1,
      timestamp: '2025-05-28 15:45:20',
      activity: 'Property Analysis',
      details: 'Analyzed luxury condo in downtown Seattle',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '12m 45s',
      link: '/calculations/luxury-condo-seattle-20250528'
    },
    {
      id: 2,
      timestamp: '2025-05-25 09:30:15',
      activity: 'Login',
      details: 'Logged in via mobile app',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250525093015'
    },
    {
      id: 3,
      timestamp: '2025-05-22 14:20:30',
      activity: 'Market Research',
      details: 'Researched Capitol Hill rental trends',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '18m 22s',
      link: '/searches/capitol-hill-trends-20250522'
    },
    {
      id: 4,
      timestamp: '2025-05-15 11:10:45',
      activity: 'Report Download',
      details: 'Downloaded quarterly market report',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-',
      link: '/reports/quarterly-market-20250515'
    },
    // April 2025
    {
      id: 5,
      timestamp: '2025-04-20 16:35:12',
      activity: 'ROI Analysis',
      details: 'Analyzed 4-unit apartment building ROI',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '25m 18s',
      link: '/calculations/4unit-apartment-20250420'
    },
    {
      id: 6,
      timestamp: '2025-04-18 13:25:40',
      activity: 'Neighborhood Search',
      details: 'Searched Fremont district properties',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '7m 33s',
      link: '/searches/fremont-district-20250418'
    },
    {
      id: 7,
      timestamp: '2025-04-12 10:15:25',
      activity: 'Login',
      details: 'Logged in via web browser',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250412101525'
    },
    // March 2025
    {
      id: 8,
      timestamp: '2025-03-28 14:50:30',
      activity: 'Cash Flow Model',
      details: 'Built cash flow model for duplex investment',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '35m 42s',
      link: '/calculations/duplex-cashflow-20250328'
    },
    {
      id: 9,
      timestamp: '2025-03-25 11:20:15',
      activity: 'Market Analysis',
      details: 'Analyzed Ballard neighborhood trends',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '15m 20s',
      link: '/searches/ballard-trends-20250325'
    },
    {
      id: 10,
      timestamp: '2025-03-20 09:40:50',
      activity: 'Investment Report',
      details: 'Downloaded investment strategy guide',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-',
      link: '/reports/investment-strategy-20250320'
    },
    {
      id: 11,
      timestamp: '2025-03-15 16:25:35',
      activity: 'Login',
      details: 'Logged in via web browser',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250315162535'
    },
    // February 2025
    {
      id: 12,
      timestamp: '2025-02-25 13:30:20',
      activity: 'Property Evaluation',
      details: 'Evaluated single-family home potential',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '22m 15s',
      link: '/calculations/sfh-evaluation-20250225'
    },
    {
      id: 13,
      timestamp: '2025-02-20 10:45:30',
      activity: 'Market Research',
      details: 'Researched University District market',
      type: 'search',
      icon: Search,
      color: 'blue',
      duration: '12m 45s',
      link: '/searches/university-district-20250220'
    },
    {
      id: 14,
      timestamp: '2025-02-15 14:20:10',
      activity: 'Login',
      details: 'Logged in via mobile app',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250215142010'
    },
    {
      id: 15,
      timestamp: '2025-02-14 20:15:00',
      activity: 'First Login',
      details: 'Initial account setup and first login',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250214201500'
    }
  ];

  // Client 3 (Lindsay Sherman) - High-value client activities
  const client3Activities = [
    // Recent activity in 2025
    {
      id: 1,
      timestamp: '2025-06-10 14:30:20',
      activity: 'Accelerator Pro Access',
      details: 'Accessed advanced market analysis tools',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '45m 30s',
      link: '/accelerator/advanced-analysis-20250610'
    },
    {
      id: 2,
      timestamp: '2025-06-05 11:15:45',
      activity: 'Premium Report Download',
      details: 'Downloaded comprehensive market report (PDF)',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-',
      link: '/reports/premium-market-20250605'
    },
    {
      id: 3,
      timestamp: '2025-05-28 16:20:15',
      activity: 'Portfolio Analysis',
      details: 'Analyzed 12-property investment portfolio',
      type: 'calculation',
      icon: Calculator,
      color: 'green',
      duration: '1h 15m',
      link: '/calculations/portfolio-analysis-20250528'
    },
    {
      id: 4,
      timestamp: '2025-05-20 09:45:30',
      activity: 'Login',
      details: 'Logged in via web browser',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20250520094530'
    },
    // Activity from when she first joined (August 2024)
    {
      id: 5,
      timestamp: '2024-08-15 10:30:00',
      activity: 'Accelerator Pro Setup',
      details: 'Completed onboarding and initial setup',
      type: 'login',
      icon: LogIn,
      color: 'purple',
      duration: '-',
      link: '/auth/sessions/20240815103000'
    },
    {
      id: 6,
      timestamp: '2024-08-01 08:44:00',
      activity: 'Purchase Completed',
      details: 'Purchased Accelerator Pro package',
      type: 'download',
      icon: Download,
      color: 'orange',
      duration: '-',
      link: '/purchase/accelerator-pro-20240801'
    }
  ];

  const activities = clientId === '1' ? client1Activities : 
                    clientId === '2' ? client2Activities : 
                    client3Activities;

  // Filter based on time range
  const now = new Date('2025-06-14');
  let cutoffDate = new Date();
  
  switch (timeRange) {
    case '7d':
      cutoffDate.setTime(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
    case '30d':
      cutoffDate.setTime(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      break;
    case '90d':
      cutoffDate.setTime(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      break;
    case '12m':
      cutoffDate.setTime(now.getTime() - (365 * 24 * 60 * 60 * 1000));
      break;
    default:
      cutoffDate = new Date(client?.joinedDate || '2025-02-01');
  }

  const signupDate = new Date(client?.joinedDate || '2025-02-01');
  if (cutoffDate > signupDate) {
    cutoffDate = signupDate;
  }

  console.log('Time range:', timeRange);
  console.log('Cutoff date:', cutoffDate);
  console.log('Activities before filter:', activities.length);
  
  const filteredActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const isIncluded = activityDate >= cutoffDate;
    if (!isIncluded) {
      console.log('Filtered out activity:', activity.timestamp, 'because it\'s before', cutoffDate);
    }
    return isIncluded;
  });
  
  console.log('Activities after filter:', filteredActivities.length);
  
  return filteredActivities;
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

const handleActivityClick = (link: string) => {
  console.log('Navigating to:', link);
  alert(`Would navigate to: ${link}`);
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
                    <button
                      onClick={() => handleActivityClick(activity.link)}
                      className="flex items-center gap-2 hover:text-purple-300 transition-colors group"
                    >
                      <IconComponent className={`h-4 w-4 text-${activity.color}-400`} />
                      <span className="font-medium underline decoration-dotted underline-offset-4">
                        {activity.activity}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
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
