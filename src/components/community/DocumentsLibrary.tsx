
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Book, Plus, Search, Download, Eye, FileText, Calculator, MessageSquare, Users, Home, CheckCircle } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'sheet' | 'template' | 'guide';
  category: string;
  description: string;
  downloads: number;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
  featured?: boolean;
}

export const DocumentsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documents: Document[] = [
    {
      id: '1',
      title: 'Cash Flow Analysis Sheet',
      type: 'sheet',
      category: 'Financial',
      description: 'Comprehensive spreadsheet for analyzing rental arbitrage cash flow potential',
      downloads: 234,
      uploadedBy: 'Richie Matthews',
      uploadDate: '2024-12-15',
      tags: ['financial', 'analysis', 'cash-flow'],
      featured: true
    },
    {
      id: '2',
      title: 'Deal Calculator',
      type: 'sheet',
      category: 'Financial',
      description: 'Quick calculator to evaluate potential rental arbitrage deals',
      downloads: 189,
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-12-10',
      tags: ['calculator', 'deals', 'roi']
    },
    {
      id: '3',
      title: 'Furnishings Budgeting Sheet',
      type: 'sheet',
      category: 'Operations',
      description: 'Detailed budget template for furnishing rental properties',
      downloads: 156,
      uploadedBy: 'Mike Chen',
      uploadDate: '2024-12-08',
      tags: ['furnishing', 'budget', 'setup']
    },
    {
      id: '4',
      title: 'Canned Messages',
      type: 'pdf',
      category: 'Communication',
      description: 'Pre-written messages for guest communication and common scenarios',
      downloads: 298,
      uploadedBy: 'Lisa Rodriguez',
      uploadDate: '2024-12-05',
      tags: ['communication', 'templates', 'guests'],
      featured: true
    },
    {
      id: '5',
      title: 'Guest Messaging Templates',
      type: 'template',
      category: 'Communication',
      description: 'Professional templates for all guest interactions',
      downloads: 267,
      uploadedBy: 'David Kim',
      uploadDate: '2024-12-03',
      tags: ['messaging', 'templates', 'professional']
    },
    {
      id: '6',
      title: 'House Rules Template',
      type: 'pdf',
      category: 'Legal',
      description: 'Comprehensive house rules template for rental properties',
      downloads: 198,
      uploadedBy: 'Emily Davis',
      uploadDate: '2024-11-28',
      tags: ['rules', 'legal', 'property']
    },
    {
      id: '7',
      title: 'Housekeeping Checklist',
      type: 'pdf',
      category: 'Operations',
      description: 'Detailed checklist for property cleaning and maintenance',
      downloads: 178,
      uploadedBy: 'Robert Wilson',
      uploadDate: '2024-11-25',
      tags: ['cleaning', 'maintenance', 'checklist']
    },
    {
      id: '8',
      title: 'ICA - Maintenance',
      type: 'pdf',
      category: 'Legal',
      description: 'Independent Contractor Agreement for maintenance services',
      downloads: 143,
      uploadedBy: 'Maria Garcia',
      uploadDate: '2024-11-20',
      tags: ['contract', 'maintenance', 'legal']
    },
    {
      id: '9',
      title: 'ICA - Housekeeper',
      type: 'pdf',
      category: 'Legal',
      description: 'Independent Contractor Agreement for housekeeping services',
      downloads: 156,
      uploadedBy: 'Alex Thompson',
      uploadDate: '2024-11-18',
      tags: ['contract', 'housekeeping', 'legal']
    },
    {
      id: '10',
      title: 'Job Ad Copy - Housekeeper',
      type: 'template',
      category: 'HR',
      description: 'Professional job posting template for hiring housekeepers',
      downloads: 89,
      uploadedBy: 'Sophie Lee',
      uploadDate: '2024-11-15',
      tags: ['hiring', 'job-post', 'housekeeper']
    },
    {
      id: '11',
      title: 'Job Ad Copy - Virtual Assistant',
      type: 'template',
      category: 'HR',
      description: 'Job posting template for virtual assistant positions',
      downloads: 67,
      uploadedBy: 'John Smith',
      uploadDate: '2024-11-12',
      tags: ['hiring', 'virtual-assistant', 'remote']
    },
    {
      id: '12',
      title: 'Lease Addendum',
      type: 'pdf',
      category: 'Legal',
      description: 'Legal addendum template for subletting agreements',
      downloads: 234,
      uploadedBy: 'Richie Matthews',
      uploadDate: '2024-11-10',
      tags: ['lease', 'legal', 'subletting']
    },
    {
      id: '13',
      title: 'Messaging Rules',
      type: 'pdf',
      category: 'Communication',
      description: 'Guidelines for professional guest communication',
      downloads: 112,
      uploadedBy: 'Emily Davis',
      uploadDate: '2024-11-08',
      tags: ['communication', 'guidelines', 'professional']
    },
    {
      id: '14',
      title: 'Onboarding - Virtual Assistant',
      type: 'guide',
      category: 'HR',
      description: 'Complete onboarding guide for virtual assistants',
      downloads: 78,
      uploadedBy: 'David Kim',
      uploadDate: '2024-11-05',
      tags: ['onboarding', 'training', 'virtual-assistant']
    },
    {
      id: '15',
      title: 'Pitch Deck - Acquisitions',
      type: 'pdf',
      category: 'Marketing',
      description: 'Professional pitch deck for landlord presentations',
      downloads: 167,
      uploadedBy: 'Lisa Rodriguez',
      uploadDate: '2024-11-01',
      tags: ['pitch', 'acquisitions', 'landlords']
    }
  ];

  const categories = ['all', 'Financial', 'Operations', 'Communication', 'Legal', 'HR', 'Marketing'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'sheet': return <Calculator className="h-4 w-4" />;
      case 'template': return <MessageSquare className="h-4 w-4" />;
      case 'guide': return <Book className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'sheet': return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'template': return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'guide': return 'bg-purple-500/20 border-purple-500/30 text-purple-300';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Financial': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Operations': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Communication': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Legal': 'bg-red-500/20 border-red-500/30 text-red-300',
      'HR': 'bg-orange-500/20 border-orange-500/30 text-orange-300',
      'Marketing': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-cyan-300">Documents Library</h2>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
            {documents.length} resources
          </Badge>
        </div>
        <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap"
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 whitespace-nowrap"
              }
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => (
          <Card key={doc.id} className={`bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors ${doc.featured ? 'ring-1 ring-yellow-400/30' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(doc.type)}>
                    {getTypeIcon(doc.type)}
                    <span className="ml-1 capitalize">{doc.type}</span>
                  </Badge>
                  {doc.featured && (
                    <Badge className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-300">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-green-300">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg text-white">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{doc.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <Badge className={getCategoryColor(doc.category)}>
                  {doc.category}
                </Badge>
                <span className="text-xs text-gray-400">{doc.downloads} downloads</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="border-purple-500/30 text-purple-300 text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-700">
                <span>By {doc.uploadedBy}</span>
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No documents found</h3>
            <p className="text-gray-400">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
