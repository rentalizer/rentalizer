import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, RefreshCw, Users, MessageSquare, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_questions_asked: number;
  created_at: string;
  last_question_at: string | null;
  status: string;
}

export const AdminLeadsPanel = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_captures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = ['Name', 'Email', 'Phone', 'Questions Asked', 'Status', 'Created At', 'Last Question'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.phone}"`,
          lead.total_questions_asked,
          `"${lead.status}"`,
          `"${new Date(lead.created_at).toLocaleDateString()}"`,
          lead.last_question_at ? `"${new Date(lead.last_question_at).toLocaleDateString()}"` : '""'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `richie-ai-leads-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: "Leads data has been downloaded as CSV.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export leads data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (lead: Lead) => {
    if (lead.total_questions_asked >= 10) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    if (lead.total_questions_asked > 0) {
      return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="secondary">New</Badge>;
  };

  const stats = {
    total: leads.length,
    active: leads.filter(lead => lead.total_questions_asked > 0 && lead.total_questions_asked < 10).length,
    completed: leads.filter(lead => lead.total_questions_asked >= 10).length,
    totalQuestions: leads.reduce((sum, lead) => sum + lead.total_questions_asked, 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Leads</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Questions</p>
                <p className="text-2xl font-bold text-white">{stats.totalQuestions}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Ask Richie AI Leads</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={fetchLeads}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportToCSV}
                size="sm"
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                disabled={isExporting || leads.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No leads found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-cyan-300">Name</TableHead>
                    <TableHead className="text-cyan-300">Email</TableHead>
                    <TableHead className="text-cyan-300">Phone</TableHead>
                    <TableHead className="text-cyan-300">Questions</TableHead>
                    <TableHead className="text-cyan-300">Status</TableHead>
                    <TableHead className="text-cyan-300">Created</TableHead>
                    <TableHead className="text-cyan-300">Last Question</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="border-slate-700">
                      <TableCell className="text-white font-medium">{lead.name}</TableCell>
                      <TableCell className="text-gray-300">{lead.email}</TableCell>
                      <TableCell className="text-gray-300">{lead.phone}</TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <span>{lead.total_questions_asked}/10</span>
                          <div className="w-16 h-2 bg-slate-700 rounded-full">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                              style={{ width: `${(lead.total_questions_asked / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(lead)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {lead.last_question_at 
                          ? new Date(lead.last_question_at).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};