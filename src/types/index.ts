
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
  order: number;
  isActive: boolean;
  attachment?: {
    filename: string;
    url: string;
    type: 'pdf' | 'excel';
    size: number;
  };
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
  attachment?: {
    filename: string;
    url: string;
    type: 'pdf' | 'excel';
    size: number;
  };
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

export interface Document {
  _id: string;
  filename: string;
  url: string;
  type: 'pdf' | 'excel';
  size: number;
  category: string;
  videoId?: string; // Optional reference to the video it came from
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}