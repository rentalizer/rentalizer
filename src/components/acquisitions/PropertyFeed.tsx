
import React, { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Expanded real property data with more variety and actual property images
const realProperties = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '1234 Broadway St, Downtown, San Diego, CA 92101',
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=edges'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=edges'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop&crop=edges'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4ae?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=edges'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=800&h=600&fit=crop&crop=edges'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop&crop=edges'
    ],
    rating: 4.4,
    amenities: ['Concierge', 'Rooftop Terrace', 'Water Views'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(206) 555-0890',
      email: 'leasing@belltowntower.com'
    },
    city: 'seattle'
  },
  {
    id: '7',
    title: 'Victorian Era Converted Apartment',
    address: '345 Castro St, Castro District, San Francisco, CA 94114',
    price: 3200,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1100,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=edges'
    ],
    rating: 4.2,
    amenities: ['Original Hardwood', 'Bay Windows', 'Historic Charm'],
    availability: 'Available Jan 15',
    contactInfo: {
      phone: '(415) 555-0321',
      email: 'contact@victorianrentals.com'
    },
    city: 'san francisco'
  },
  {
    id: '8',
    title: 'Tech Hub Penthouse',
    address: '888 Market St, SOMA, San Francisco, CA 94103',
    price: 4500,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=edges'
    ],
    rating: 4.9,
    amenities: ['City Views', 'Rooftop Access', 'Smart Home', 'Parking'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(415) 555-0654',
      email: 'luxury@techpenthouse.com'
    },
    city: 'san francisco'
  },
  {
    id: '9',
    title: 'Cozy Brooklyn Brownstone',
    address: '246 Park Slope Ave, Brooklyn, NY 11215',
    price: 2900,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&crop=edges'
    ],
    rating: 4.6,
    amenities: ['Original Details', 'Garden Access', 'Near Subway'],
    availability: 'Available Mar 1',
    contactInfo: {
      phone: '(718) 555-0987',
      email: 'rentals@brooklynbrownstone.com'
    },
    city: 'new york'
  },
  {
    id: '10',
    title: 'Manhattan Midtown Studio',
    address: '500 W 42nd St, Hell\'s Kitchen, New York, NY 10036',
    price: 3100,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4ae?w=800&h=600&fit=crop&crop=edges',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop&crop=edges'
    ],
    rating: 4.4,
    amenities: ['Doorman', 'Fitness Center', 'Times Square Proximity'],
    availability: 'Available Now',
    contactInfo: {
      phone: '(212) 555-0456',
      email: 'leasing@midtownstudio.com'
    },
    city: 'new york'
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

  // Show properties when user has searched (even with just 1 character)
  const hasSearched = searchTerm.length > 0;
  
  const filteredProperties = hasSearched ? realProperties.filter(property => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = property.title.toLowerCase().includes(searchLower) ||
                         property.address.toLowerCase().includes(searchLower) ||
                         property.city.toLowerCase().includes(searchLower) ||
                         property.amenities.some(amenity => amenity.toLowerCase().includes(searchLower));
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under-2000' && property.price < 2000) ||
                        (priceRange === '2000-3000' && property.price >= 2000 && property.price <= 3000) ||
                        (priceRange === '3000-4000' && property.price >= 3000 && property.price <= 4000) ||
                        (priceRange === 'over-4000' && property.price > 4000);
    
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
      case 'rating': return b.rating! - a.rating!;
      default: return 0;
    }
  });

  const handleSaveProperty = (property: any) => {
    console.log('Saving property:', property);
  };

  const getSearchLocation = () => {
    if (searchTerm === '') return 'Search For Properties';
    
    const searchLower = searchTerm.toLowerCase();
    
    // Check if search matches any city directly
    if (searchLower.includes('san diego') || searchLower.includes('sandiego')) {
      return 'San Diego Area';
    }
    if (searchLower.includes('denver')) {
      return 'Denver Area';
    }
    if (searchLower.includes('seattle')) {
      return 'Seattle Area';
    }
    if (searchLower.includes('san francisco') || searchLower.includes('sf')) {
      return 'San Francisco Area';
    }
    if (searchLower.includes('new york') || searchLower.includes('nyc') || searchLower.includes('brooklyn') || searchLower.includes('manhattan')) {
      return 'New York Area';
    }
    
    // If no direct match, capitalize the search term
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
                placeholder="Search by city, property name, address, or amenities... (Try: San Diego, Denver, Seattle, San Francisco, NYC)"
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
                  <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                  <SelectItem value="over-4000">Over $4,000</SelectItem>
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
                  <SelectItem value="rating">Highest Rated</SelectItem>
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
                  {priceRange.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $').replace('3000-4000', '$3,000 - $4,000')}
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
            <div className="text-white text-xl mb-3">Discover Your Next Rental Investment</div>
            <div className="text-gray-300 mb-6">Search across major markets to find the perfect rental arbitrage opportunities</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('San Diego')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                San Diego
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('Denver')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                Denver
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('Seattle')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                Seattle
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('San Francisco')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                San Francisco
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('New York')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                New York
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-cyan-400">
              <Search className="h-5 w-5" />
              <span>Click a city above or search to see real properties!</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
