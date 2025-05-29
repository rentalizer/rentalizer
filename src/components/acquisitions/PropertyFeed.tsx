
import React, { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock data that mimics apartment.com properties
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Downtown Apartment',
    address: '123 Main St, Downtown, NY 10001',
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    rating: 4.5,
    amenities: ['Pool', 'Gym', 'Parking', 'Pet Friendly', 'Laundry'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'contact@luxurydowntown.com'
    }
  },
  {
    id: '2',
    title: 'Modern Studio Loft',
    address: '456 Oak Ave, Midtown, NY 10002',
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    images: ['/placeholder.svg', '/placeholder.svg'],
    rating: 4.2,
    amenities: ['Rooftop Deck', 'Doorman', 'Fitness Center'],
    availability: 'Available Dec 1',
    contactInfo: {
      phone: '(555) 987-6543',
      email: 'leasing@modernstudio.com'
    }
  },
  {
    id: '3',
    title: 'Spacious 3BR Family Home',
    address: '789 Pine St, Suburbs, NY 10003',
    price: 3200,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1800,
    images: ['/placeholder.svg'],
    rating: 4.8,
    amenities: ['Yard', 'Garage', 'School District', 'Quiet Neighborhood'],
    availability: 'Available Jan 15',
    contactInfo: {
      phone: '(555) 456-7890',
      email: 'rent@familyhome.com'
    }
  }
];

interface PropertyFeedProps {
  onContactProperty: (property: any) => void;
}

export const PropertyFeed = ({ onContactProperty }: PropertyFeedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under-2000' && property.price < 2000) ||
                        (priceRange === '2000-3000' && property.price >= 2000 && property.price <= 3000) ||
                        (priceRange === 'over-3000' && property.price > 3000);
    
    const matchesBedrooms = bedrooms === 'all' || 
                           property.bedrooms.toString() === bedrooms;
    
    return matchesSearch && matchesPrice && matchesBedrooms;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'bedrooms': return b.bedrooms - a.bedrooms;
      case 'sqft': return b.sqft - a.sqft;
      default: return 0;
    }
  });

  const handleSaveProperty = (property: any) => {
    console.log('Saving property:', property);
    // This would typically save to a favorites list or database
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by location, property name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-2000">Under $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="over-3000">Over $3,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Beds</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
                  <SelectItem value="sqft">Largest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {sortedProperties.length} Properties Found
          </span>
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600">New York Area</span>
        </div>
        
        {(searchTerm || priceRange !== 'all' || bedrooms !== 'all') && (
          <div className="flex gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {priceRange.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                <button onClick={() => setPriceRange('all')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {bedrooms !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {bedrooms} bedroom{bedrooms !== '1' ? 's' : ''}
                <button onClick={() => setBedrooms('all')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onContact={onContactProperty}
            onSaveProperty={handleSaveProperty}
          />
        ))}
      </div>

      {sortedProperties.length === 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="text-gray-500 text-lg mb-2">No properties found</div>
            <div className="text-gray-400">Try adjusting your search criteria</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
