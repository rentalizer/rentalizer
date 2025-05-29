
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
