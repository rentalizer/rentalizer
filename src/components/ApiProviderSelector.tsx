import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Database, AlertTriangle } from 'lucide-react';

interface ApiProviderSelectorProps {
  selectedProvider: 'airdna' | 'rentcast';
  onProviderChange: (provider: 'airdna' | 'rentcast') => void;
  apiKeys: {
    airdnaApiKey?: string;
    rentcastApiKey?: string;
  };
}

export const ApiProviderSelector: React.FC<ApiProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  apiKeys
}) => {
  const hasAirDNA = !!apiKeys.airdnaApiKey;
  const hasRentCast = !!apiKeys.rentcastApiKey;

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          API Data Provider
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which API to use for market data analysis
        </p>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedProvider}
          onValueChange={(value) => onProviderChange(value as 'airdna' | 'rentcast')}
          className="space-y-4"
        >
          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem
              value="airdna"
              id="airdna"
              disabled={!hasAirDNA}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="airdna" className="font-medium cursor-pointer">
                  AirDNA
                </Label>
                {hasAirDNA ? (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                    No API Key
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Premium short-term rental data with revenue estimates and comparable properties
                </p>
              </div>
              {!hasAirDNA && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-600">
                    Add your AirDNA API key in the configuration to enable this option
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <RadioGroupItem
              value="rentcast"
              id="rentcast"
              disabled={!hasRentCast}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="rentcast" className="font-medium cursor-pointer">
                  RentCast
                </Label>
                {hasRentCast ? (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                    No API Key
                  </Badge>
                )}
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Comprehensive rental listing data with current market prices and property details
                </p>
              </div>
              {!hasRentCast && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-600">
                    Add your RentCast API key in the configuration to enable this option
                  </p>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};