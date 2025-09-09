
export interface STRData {
  submarket: string;
  revenue: number;
}

export interface RentData {
  submarket: string;
  rent: number;
}

export interface CityMarketData {
  strData: STRData[];
  rentData: RentData[];
}

export interface MarketAnalysisResult {
  submarket: string;
  strRevenue: number;
  medianRent: number;
  multiple: number;
}

export interface EdgeFunctionResponse {
  submarkets: MarketAnalysisResult[];
  city: string;
  propertyType: string;
  bathrooms: string;
  dataSource: string;
}
