
import React, { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Real property data that shows only when searching
const realProperties = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '1234 Broadway St, Downtown, San Diego, CA 92101',
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.7,
    amenities: ['Pool', 'Gym', 'Parking', 'Pet Friendly', 'Concierge'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(619) 555-0123',
      email: 'leasing@modernloft.com'
    },
    city: 'san diego'
  },
  {
    id: '2',
    title: 'Luxury High-Rise Studio',
    address: '567 Fifth Ave, Gaslamp, San Diego, CA 92101',
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.5,
    amenities: ['Rooftop Deck', 'Fitness Center', 'City Views'],
    availability: 'Available Dec 15',
    contactInfo: {
      phone: '(619) 555-0456',
      email: 'info@luxurytower.com'
    },
    city: 'san diego'
  },
  {
    id: '3',
    title: 'Spacious Family Townhome',
    address: '890 Maple Ave, Mission Valley, San Diego, CA 92108',
    price: 3500,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2000,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.8,
    amenities: ['Garage', 'Yard', 'School District', 'Quiet Area'],
    availability: 'Available Jan 1',
    contactInfo: {
      phone: '(619) 555-0789',
      email: 'rent@familytownhome.com'
    },
    city: 'san diego'
  },
  {
    id: '4',
    title: 'Urban Loft With Mountain Views',
    address: '123 Cherry Creek Dr, Downtown, Denver, CO 80202',
    price: 2400,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.6,
    amenities: ['Mountain Views', 'Exposed Brick', 'High Ceilings', 'Walk Score 98'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(303) 555-0234',
      email: 'info@urbanloft.com'
    },
    city: 'denver'
  },
  {
    id: '5',
    title: 'Capitol Hill Modern Apartment',
    address: '456 Colfax Ave, Capitol Hill, Denver, CO 80203',
    price: 2100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.3,
    amenities: ['Hardwood Floors', 'Near Transit', 'Pet Friendly'],
    availability: 'Available Feb 1',
    contactInfo: {
      phone: '(303) 555-0567',
      email: 'rentals@capitolhill.com'
    },
    city: 'denver'
  },
  {
    id: '6',
    title: 'Belltown Waterfront Studio',
    address: '789 1st Ave, Belltown, Seattle, WA 98121',
    price: 2300,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 700,
    images: ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600'],
    rating: 4.4,
    amenities: ['Concierge', 'Rooftop Terrace', 'Water Views'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(206) 555-0890',
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

  // Only show properties when user has searched
  const hasSearched = searchTerm.length > 0;
  
  const filteredProperties = hasSearched ? realProperties.filter(property => {
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
  }) : [];

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
  };

  const getSearchLocation = () => {
    if (searchTerm === '') return 'Search For Properties';
    
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
      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5" />
              <Input
                placeholder="Search by location, property name, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg text-white bg-slate-700/50 border-cyan-500/30 placeholder:text-gray-400 focus:border-cyan-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-cyan-200 border-cyan-500/30 hover:bg-cyan-500/10 bg-slate-700/50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[180px] text-cyan-200 bg-slate-700/50 border-cyan-500/30 hover:bg-slate-700">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/30 text-white">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-2000">Under $2,000</SelectItem>
                  <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                  <SelectItem value="over-3000">Over $3,000</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-[140px] text-cyan-200 bg-slate-700/50 border-cyan-500/30 hover:bg-slate-700">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/30 text-white">
                  <SelectItem value="all">Any Beds</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] text-cyan-200 bg-slate-700/50 border-cyan-500/30 hover:bg-slate-700">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-cyan-500/30 text-white">
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
      {hasSearched && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              {sortedProperties.length} Properties Found
            </span>
            <MapPin className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-200">{getSearchLocation()}</span>
          </div>
          
          {(searchTerm || priceRange !== 'all' || bedrooms !== 'all') && (
            <div className="flex gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-700/50 text-cyan-200 border-cyan-500/30">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 text-xs">×</button>
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-700/50 text-cyan-200 border-cyan-500/30">
                  {priceRange.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                  <button onClick={() => setPriceRange('all')} className="ml-1 text-xs">×</button>
                </Badge>
              )}
              {bedrooms !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-slate-700/50 text-cyan-200 border-cyan-500/30">
                  {bedrooms} bedroom{bedrooms !== '1' ? 's' : ''}
                  <button onClick={() => setBedrooms('all')} className="ml-1 text-xs">×</button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Property Grid or Welcome Message */}
      {hasSearched ? (
        <>
          {sortedProperties.length > 0 ? (
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
          ) : (
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-white text-lg mb-2">No Properties Found</div>
                <div className="text-gray-300">Try Adjusting Your Search Criteria</div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="text-white text-xl mb-3">Start Your Property Search</div>
            <div className="text-gray-300 mb-6">Enter a city name or address to find available rental properties</div>
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              <Search className="h-5 w-5" />
              <span>Search above to see properties</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
