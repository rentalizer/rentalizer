
import React, { useState } from 'react';
import { TopNavBar } from '@/components/TopNavBar';
import { PropertyFeed } from '@/components/acquisitions/PropertyFeed';
import { AIEmailAgent } from '@/components/acquisitions/AIEmailAgent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  Bot, 
  Target, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Zap
} from 'lucide-react';

export default function AcquisitionsAgent() {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('properties');

  const handleContactProperty = (property: any) => {
    setSelectedProperty(property);
    setActiveTab('agent');
    
    toast({
      title: "Property Selected",
      description: `Ready to create email sequence for ${property.title}`,
    });
  };

  const stats = [
    { label: 'Properties Monitored', value: '1,247', icon: Building2, color: 'text-blue-400' },
    { label: 'Active Email Sequences', value: '12', icon: Bot, color: 'text-purple-400' },
    { label: 'Leads Generated', value: '89', icon: Target, color: 'text-blue-400' },
    { label: 'Response Rate', value: '23%', icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/30 to-purple-900/30">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Acquisition CRM
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-powered apartment sourcing and automated landlord outreach system
          </p>
        </div>

        {/* How It Works Section */}
        <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              How Acquisition CRM Works
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">1. Apartment Discovery</h3>
              <p className="text-gray-300 text-sm">
                Our system searches for apartments across multiple platforms, 
                identifying potential rental arbitrage opportunities.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">2. Smart Outreach</h3>
              <p className="text-gray-300 text-sm">
                Automated email sequences engage property owners with personalized, 
                professional messages using smart automation.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">3. Lead Conversion</h3>
              <p className="text-gray-300 text-sm">
                Track responses, schedule viewings, and convert leads into profitable 
                rental arbitrage deals with our integrated CRM system.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-slate-700/50`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Property Banner */}
        {selectedProperty && (
          <Card className="bg-blue-900/20 border-blue-400/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-100">{selectedProperty.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-blue-200">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedProperty.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="border-blue-400/30 text-blue-200">
                          ${selectedProperty.price.toLocaleString()}/mo
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProperty(null)}
                  className="border-blue-400/30 text-blue-200 hover:bg-blue-500/10"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-blue-500/20">
            <TabsTrigger 
              value="properties" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <Building2 className="h-4 w-4" />
              Property Feed
            </TabsTrigger>
            <TabsTrigger 
              value="agent" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300"
            >
              <Bot className="h-4 w-4" />
              AI Email Agent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <PropertyFeed onContactProperty={handleContactProperty} />
          </TabsContent>

          <TabsContent value="agent" className="space-y-6">
            <Card className="bg-slate-800/50 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <AIEmailAgent selectedProperty={selectedProperty} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
