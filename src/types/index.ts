
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

// Video related types
export interface VideoHandout {
  name: string;
  url: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  category: string;
  tags: string[];
  featured: boolean;
  isLive: boolean;
  videoUrl: string;
  handouts: VideoHandout[];
  order: number;
  isActive: boolean;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  lastModifiedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  embedUrl: string;
}

export interface CreateVideoData {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  videoUrl: string;
  tags?: string[];
  featured?: boolean;
  isLive?: boolean;
  handouts?: VideoHandout[];
}

export interface UpdateVideoData extends Partial<CreateVideoData> {
  isActive?: boolean;
}

export interface VideoFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}