
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Map, Table2, Download, Satellite } from 'lucide-react';
import { ResultsTable } from '@/components/ResultsTable';
import { MapView } from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';

interface SubmarketData {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

interface MarketAnalysisResultsProps {
  submarketData: SubmarketData[];
  selectedSubmarkets: SubmarketData[];
  cityName: string;
  propertyType: string;
  bathrooms: string;
  onSelectionChange: (selected: SubmarketData[]) => void;
}

export const MarketAnalysisResults: React.FC<MarketAnalysisResultsProps> = ({
  submarketData,
  selectedSubmarkets,
  cityName,
  propertyType,
  bathrooms,
  onSelectionChange
}) => {
  const { toast } = useToast();

  const handleExportData = () => {
    const dataToExport = selectedSubmarkets.length > 0 ? selectedSubmarkets : submarketData;
    
    if (dataToExport.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please run a market analysis first.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ['Submarket', 'STR Revenue', 'Median Rent', 'Revenue Multiple'];
    const csvRows = dataToExport.map(row => [
      `"${row.submarket}"`,
      row.strRevenue || 'NA',
      row.medianRent || 'NA',
      row.multiple > 0 ? row.multiple.toFixed(2) : 'NA'
    ].join(','));
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${cityName.toLowerCase().replace(/\s+/g, '-')}-market-analysis-mashvisor.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: `Real market data for ${cityName} downloaded.`,
    });
  };

  if (submarketData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">
            Market Analysis Results
          </h2>
          <p className="text-gray-400 mt-1">
            {propertyType}BR/{bathrooms}BA apartments in {cityName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-800/50 border-purple-500/30 text-purple-300 px-3 py-1">
            <Table2 className="h-4 w-4 mr-1" />
            Table View
          </Badge>
          <Badge variant="outline" className="bg-gray-800/50 border-cyan-500/30 text-cyan-300 px-3 py-1">
            <Map className="h-4 w-4 mr-1" />
            Map View
          </Badge>
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="border-green-500/30 text-green-300 hover:bg-green-500/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export {selectedSubmarkets.length > 0 ? `Selected (${selectedSubmarkets.length})` : 'All'} CSV
          </Button>
        </div>
      </div>

      <Card className="shadow-2xl border border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg">
        <CardContent className="p-0">
          <ResizablePanelGroup direction="horizontal" className="min-h-[700px]">
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Table2 className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-300">Table View</h3>
                </div>
                <div className="h-[620px] overflow-hidden">
                  <ResultsTable 
                    results={submarketData} 
                    city={cityName} 
                    onSelectionChange={onSelectionChange}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} minSize={40}>
              <div className="h-full p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Satellite className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-cyan-300">Map View</h3>
                </div>
                <MapView results={submarketData} city={cityName} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
};
