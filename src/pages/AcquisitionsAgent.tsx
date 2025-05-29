
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
    { label: 'Properties Monitored', value: '1,247', icon: Building2, color: 'text-blue-600' },
    { label: 'Active Email Sequences', value: '12', icon: Bot, color: 'text-purple-600' },
    { label: 'Leads Generated', value: '89', icon: Target, color: 'text-green-600' },
    { label: 'Response Rate', value: '23%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <TopNavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Acquisitions Agent
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI-powered property sourcing and automated landlord outreach system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/10`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Property Banner */}
        {selectedProperty && (
          <Card className="bg-purple-100 border-purple-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">{selectedProperty.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-purple-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedProperty.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Badge variant="outline" className="border-purple-300 text-purple-700">
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
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger 
              value="properties" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Building2 className="h-4 w-4" />
              Property Feed
            </TabsTrigger>
            <TabsTrigger 
              value="agent" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900"
            >
              <Bot className="h-4 w-4" />
              AI Email Agent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Available Properties
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    Live Feed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PropertyFeed onContactProperty={handleContactProperty} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <AIEmailAgent selectedProperty={selectedProperty} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works Section */}
        <Card className="bg-white/5 border-white/20 backdrop-blur-sm mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              How the Acquisitions Agent Works
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">1. Property Discovery</h3>
              <p className="text-gray-300 text-sm">
                Our AI continuously monitors property listings across multiple platforms, 
                identifying potential rental arbitrage opportunities.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">2. Smart Outreach</h3>
              <p className="text-gray-300 text-sm">
                Automated email sequences engage property owners with personalized, 
                professional messages using IFTTT smart automation.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
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
      </div>
    </div>
  );
}
