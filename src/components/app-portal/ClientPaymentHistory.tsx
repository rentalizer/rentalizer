import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  DollarSign,
  Calendar,
  Receipt
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface ClientPaymentHistoryProps {
  clientId: string;
  timeRange: string;
  client?: Client;
}

const getPaymentHistory = (clientId: string, timeRange: string, client?: Client) => {
  // Mock Stripe payment data starting from April 13, 2025 at 6:48 AM
  const payments = [
    {
      id: 'pi_3NPqMA2eZvKYlo2C1234567',
      timestamp: '2025-06-14 00:01:22',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly Subscription - June 2025',
      payment_method: '**** 4242',
      stripe_fee: 0.57,
      net_amount: 8.43
    },
    {
      id: 'pi_3NOqMA2eZvKYlo2C1234566',
      timestamp: '2025-05-14 00:01:15',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly Subscription - May 2025',
      payment_method: '**** 4242',
      stripe_fee: 0.57,
      net_amount: 8.43
    },
    {
      id: 'pi_3NNqMA2eZvKYlo2C1234565',
      timestamp: '2025-04-14 00:01:08',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly Subscription - April 2025 (2nd payment)',
      payment_method: '**** 4242',
      stripe_fee: 0.57,
      net_amount: 8.43
    },
    {
      id: 'sub_1NPqMA2eZvKYlo2C1234567',
      timestamp: '2025-04-13 06:48:15',
      type: 'subscription_created',
      amount: 9.00,
      currency: 'USD',
      status: 'active',
      description: 'Subscription Created - Monthly Plan',
      payment_method: '**** 4242',
      stripe_fee: 0.57,
      net_amount: 8.43
    },
    {
      id: 'pi_3NMqMA2eZvKYlo2C1234564',
      timestamp: '2025-04-13 06:48:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'First Payment - Rentalizer Subscription',
      payment_method: '**** 4242',
      stripe_fee: 0.57,
      net_amount: 8.43
    },
    {
      id: 'cus_NPqMA2eZvKYlo2C1234567',
      timestamp: '2025-04-13 06:20:32',
      type: 'customer_created',
      amount: 0.00,
      currency: 'USD',
      status: 'created',
      description: 'Customer account created',
      payment_method: '-',
      stripe_fee: 0.00,
      net_amount: 0.00
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

  return payments.filter(payment => 
    new Date(payment.timestamp) >= cutoffDate
  );
};

const getStatusBadge = (status: string, type: string) => {
  if (type === 'customer_created') {
    return <Badge variant="outline" className="border-blue-500/30 text-blue-400">created</Badge>;
  }
  
  if (type === 'subscription_created') {
    return <Badge variant="outline" className="border-green-500/30 text-green-400">active</Badge>;
  }

  switch (status) {
    case 'succeeded':
      return <Badge variant="outline" className="border-green-500/30 text-green-400">succeeded</Badge>;
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">pending</Badge>;
    case 'failed':
      return <Badge variant="outline" className="border-red-500/30 text-red-400">failed</Badge>;
    case 'active':
      return <Badge variant="outline" className="border-green-500/30 text-green-400">active</Badge>;
    default:
      return <Badge variant="outline" className="border-gray-500/30 text-gray-400">{status}</Badge>;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'subscription_payment':
      return <CreditCard className="h-4 w-4 text-green-400" />;
    case 'subscription_created':
      return <CheckCircle className="h-4 w-4 text-blue-400" />;
    case 'customer_created':
      return <Receipt className="h-4 w-4 text-purple-400" />;
    default:
      return <DollarSign className="h-4 w-4 text-gray-400" />;
  }
};

export const ClientPaymentHistory = ({ clientId, timeRange, client }: ClientPaymentHistoryProps) => {
  const payments = getPaymentHistory(clientId, timeRange, client);
  
  const totalRevenue = payments
    .filter(p => p.type === 'subscription_payment' && p.status === 'succeeded')
    .reduce((sum, p) => sum + p.net_amount, 0);
  
  const totalPayments = payments.filter(p => p.type === 'subscription_payment').length;
  const successfulPayments = payments.filter(p => p.type === 'subscription_payment' && p.status === 'succeeded').length;

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Total Payments</p>
              <p className="text-2xl font-bold text-blue-400">
                {totalPayments}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-green-400">
                {totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Subscription Since</p>
              <p className="text-lg font-bold text-purple-400">
                {client?.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-slate-700/20 rounded-lg border border-slate-600/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-600/50">
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Description</TableHead>
              <TableHead className="text-gray-300">Amount</TableHead>
              <TableHead className="text-gray-300">Payment Method</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Stripe ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="border-slate-600/30 hover:bg-slate-600/20">
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(payment.timestamp).toLocaleDateString()} {' '}
                      {new Date(payment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(payment.type)}
                    <span className="font-medium capitalize">
                      {payment.type.replace('_', ' ')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {payment.description}
                </TableCell>
                <TableCell className="text-white">
                  {payment.amount > 0 ? (
                    <div>
                      <div className="font-medium">${payment.amount.toFixed(2)}</div>
                      {payment.net_amount > 0 && (
                        <div className="text-xs text-gray-400">
                          Net: ${payment.net_amount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-300">
                  {payment.payment_method}
                </TableCell>
                <TableCell>
                  {getStatusBadge(payment.status, payment.type)}
                </TableCell>
                <TableCell className="text-gray-400 font-mono text-xs">
                  {payment.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No payment history found for the selected time period.</p>
        </div>
      )}
    </div>
  );
};
