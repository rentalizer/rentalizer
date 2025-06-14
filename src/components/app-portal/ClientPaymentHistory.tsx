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
  // Client 1 (Ramakrishna) - Original data
  const client1Payments = [
    {
      id: 'pi_3RDJOUGjV9r2LUGm1d8bXk',
      timestamp: '2025-06-13 06:48:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Subscription update',
      payment_method: 'Visa •••• 9487',
      stripe_fee: 0.56,
      net_amount: 8.44
    },
    {
      id: 'pi_3ROJOUGjV9r2LUGOTnwZhM',
      timestamp: '2025-05-13 06:47:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Subscription update',
      payment_method: 'Visa •••• 9487',
      stripe_fee: 0.56,
      net_amount: 8.44
    },
    {
      id: 'pi_3RQJOGjV9r2LUG5Fyedzdf',
      timestamp: '2025-04-13 06:48:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Subscription update',
      payment_method: 'Visa •••• 9487',
      stripe_fee: 0.57,
      net_amount: 8.43
    }
  ];

  // Client 2 (Sara Ifeanyi) - Updated client data
  const client2Payments = [
    {
      id: 'pi_3RDKLMGjV9r2LUGn2f9cYl',
      timestamp: '2025-05-01 14:22:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly subscription',
      payment_method: 'Mastercard •••• 4242',
      stripe_fee: 0.56,
      net_amount: 8.44
    },
    {
      id: 'pi_3RBHIJGjV9r2LUGo3g8dZm',
      timestamp: '2025-04-01 14:22:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly subscription',
      payment_method: 'Mastercard •••• 4242',
      stripe_fee: 0.56,
      net_amount: 8.44
    },
    {
      id: 'pi_3R9FGHGjV9r2LUGp4h7eAn',
      timestamp: '2025-03-01 14:22:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly subscription',
      payment_method: 'Mastercard •••• 4242',
      stripe_fee: 0.56,
      net_amount: 8.44
    },
    {
      id: 'pi_3R7DEFGjV9r2LUGq5i6fBo',
      timestamp: '2025-02-01 14:22:00',
      type: 'subscription_payment',
      amount: 9.00,
      currency: 'USD',
      status: 'succeeded',
      description: 'Monthly subscription',
      payment_method: 'Mastercard •••• 4242',
      stripe_fee: 0.56,
      net_amount: 8.44
    }
  ];

  const payments = clientId === '1' ? client1Payments : client2Payments;

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
    case 'requires_action':
      return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">requires action</Badge>;
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
  
  // Updated calculations to match single payment
  const totalRevenue = payments
    .filter(p => p.type === 'subscription_payment' && p.status === 'succeeded')
    .reduce((sum, p) => sum + p.net_amount, 0);
  
  const totalPayments = payments.filter(p => p.type === 'subscription_payment').length;
  const successfulPayments = payments.filter(p => p.type === 'subscription_payment' && p.status === 'succeeded').length;

  const subscriptionSince = client?.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : 'N/A';

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
                {subscriptionSince}
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
                      {new Date(payment.timestamp).toLocaleDateString()} {new Date(payment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(payment.type)}
                    <span className="font-medium">
                      Subscription Payment
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {payment.description}
                </TableCell>
                <TableCell className="text-white">
                  <div>
                    <div className="font-medium">${payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">
                      Net: ${payment.net_amount.toFixed(2)}
                    </div>
                  </div>
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
