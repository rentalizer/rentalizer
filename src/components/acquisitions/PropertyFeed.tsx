
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
    address: '123 Main St, Downtown, San Diego, CA 92101',
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
    },
    city: 'san diego'
  },
  {
    id: '2',
    title: 'Modern Studio Loft',
    address: '456 Oak Ave, Midtown, San Diego, CA 92102',
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
    },
    city: 'san diego'
  },
  {
    id: '3',
    title: 'Spacious 3BR Family Home',
    address: '789 Pine St, Suburbs, San Diego, CA 92103',
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
    },
    city: 'san diego'
  },
  {
    id: '4',
    title: 'Urban Loft With City Views',
    address: '321 Broadway, Downtown, Denver, CO 80202',
    price: 2200,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    images: ['/placeholder.svg', '/placeholder.svg'],
    rating: 4.3,
    amenities: ['City Views', 'Exposed Brick', 'High Ceilings', 'Walk Score 95'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(303) 555-0123',
      email: 'info@urbanloft.com'
    },
    city: 'denver'
  },
  {
    id: '5',
    title: 'Cozy Capitol Hill Apartment',
    address: '654 Colfax Ave, Capitol Hill, Denver, CO 80203',
    price: 1950,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 750,
    images: ['/placeholder.svg'],
    rating: 4.1,
    amenities: ['Hardwood Floors', 'Near Transit', 'Pet Friendly'],
    availability: 'Available Feb 1',
    contactInfo: {
      phone: '(303) 555-0456',
      email: 'rentals@capitolhill.com'
    },
    city: 'denver'
  },
  {
    id: '6',
    title: 'Belltown High-Rise Studio',
    address: '987 1st Ave, Belltown, Seattle, WA 98121',
    price: 2100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    images: ['/placeholder.svg', '/placeholder.svg'],
    rating: 4.4,
    amenities: ['Concierge', 'Rooftop Terrace', 'Sound Views'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(206) 555-0789',
      email: 'leasing@belltowntower.com'
    },
    city: 'seattle'
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
    const matchesSearch = searchTerm === '' || 
                         property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // Get the search location display
  const getSearchLocation = () => {
    if (searchTerm === '') return 'All Areas';
    
    // Check if search matches a city
    const searchLower = searchTerm.toLowerCase();
    const cities = ['san diego', 'denver', 'seattle', 'miami', 'austin', 'atlanta'];
    const matchedCity = cities.find(city => city.includes(searchLower) || searchLower.includes(city));
    
    if (matchedCity) {
      return matchedCity.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Area';
    }
    
    return searchTerm.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Area';
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
                className="pl-10 h-12 text-lg text-gray-900 bg-white"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[180px] text-gray-700 bg-white border-gray-300">
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
                <SelectTrigger className="w-[140px] text-gray-700 bg-white border-gray-300">
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
                <SelectTrigger className="w-[160px] text-gray-700 bg-white border-gray-300">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low To High</SelectItem>
                  <SelectItem value="price-high">Price: High To Low</SelectItem>
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
          <span className="text-gray-600">{getSearchLocation()}</span>
        </div>
        
        {(searchTerm || priceRange !== 'all' || bedrooms !== 'all') && (
          <div className="flex gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
                {priceRange.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                <button onClick={() => setPriceRange('all')} className="ml-1 text-xs">×</button>
              </Badge>
            )}
            {bedrooms !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100 text-gray-700">
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
            <div className="text-gray-500 text-lg mb-2">No Properties Found</div>
            <div className="text-gray-400">Try Adjusting Your Search Criteria</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
