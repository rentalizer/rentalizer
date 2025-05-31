import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, SlidersHorizontal, AlertCircle, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { searchRentals } from '@/services/zillowService';
import { useToast } from '@/hooks/use-toast';

interface PropertyFeedProps {
  onContactProperty: (property: any) => void;
}

export const PropertyFeed = ({ onContactProperty }: PropertyFeedProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check if API key is configured
  const hasApiKey = !!(
    localStorage.getItem('professional_data_key') || 
    localStorage.getItem('airdna_api_key') || 
    localStorage.getItem('rapidapi_key')
  );

  // Show properties when user has searched (even with just 1 character)
  const hasSearched = searchTerm.length > 0;
  
  const filteredProperties = hasSearched ? properties.filter(property => {
    // ... keep existing code (filtering logic)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = property.title.toLowerCase().includes(searchLower) ||
                         property.address.toLowerCase().includes(searchLower) ||
                         property.city.toLowerCase().includes(searchLower) ||
                         property.amenities.some((amenity: string) => amenity.toLowerCase().includes(searchLower));
    
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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) {
      setProperties([]);
      return;
    }

    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your RapidAPI key in the settings to search for properties.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Extract city and state from search
      const searchLower = searchQuery.toLowerCase();
      let city = '';
      let state = '';

      if (searchLower.includes('san diego')) {
        city = 'San Diego';
        state = 'CA';
      } else if (searchLower.includes('denver')) {
        city = 'Denver';
        state = 'CO';
      } else if (searchLower.includes('seattle')) {
        city = 'Seattle';
        state = 'WA';
      } else if (searchLower.includes('san francisco') || searchLower.includes('sf')) {
        city = 'San Francisco';
        state = 'CA';
      } else if (searchLower.includes('new york') || searchLower.includes('nyc') || searchLower.includes('brooklyn') || searchLower.includes('manhattan')) {
        city = 'New York';
        state = 'NY';
      } else if (searchLower.includes('tampa')) {
        city = 'Tampa';
        state = 'FL';
      } else {
        // Use the search term as city
        city = searchQuery;
        state = 'FL'; // Default state
      }

      console.log('🔍 Searching Zillow for:', { city, state });
      const results = await searchRentals(city, state, 100);
      setProperties(results);
      
      if (results.length === 0) {
        toast({
          title: "No Properties Found",
          description: "The Zillow API returned no rental properties for this location. Try a different city or check your API key.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Properties Found",
          description: `Found ${results.length} rental properties in ${city}`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Unable to fetch properties from Zillow. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const debounceTimer = setTimeout(() => {
        handleSearch(searchTerm);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setProperties([]);
    }
  }, [searchTerm]);

  const handleSaveProperty = (property: any) => {
    console.log('Saving property:', property);
    toast({
      title: "Property Saved",
      description: `${property.title} has been saved to your list.`,
    });
  };

  const getSearchLocation = () => {
    if (searchTerm === '') return 'Search For Rental Properties';
    
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
    if (searchLower.includes('tampa')) {
      return 'Tampa Area';
    }
    
    // If no direct match, capitalize the search term
    return searchTerm.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Area';
  };

  return (
    <div className="space-y-6">
      {/* API Key Warning */}
      {!hasApiKey && (
        <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-red-200 font-semibold">RapidAPI Key Required</h3>
                <p className="text-red-300 text-sm">
                  Configure your RapidAPI key in the settings to search for real properties from Zillow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Header */}
      <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5" />
              <Input
                placeholder="Search for rental properties by city... (Try: San Diego, Denver, Seattle, Tampa, NYC)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg text-white bg-slate-700/50 border-cyan-500/30 placeholder:text-gray-400 focus:border-cyan-400"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400"></div>
                </div>
              )}
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
              {loading ? 'Searching Zillow...' : `${sortedProperties.length} Properties Found`}
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
          {!loading && sortedProperties.length > 0 ? (
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
          ) : !loading ? (
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-white text-lg mb-2">No Rental Properties Found</div>
                <div className="text-gray-300 mb-4">The Zillow API returned no results for this location. Try searching for a different city or verify your API key is configured correctly.</div>
                {!hasApiKey && (
                  <div className="flex items-center justify-center gap-2 text-yellow-400">
                    <Key className="h-4 w-4" />
                    <span className="text-sm">Configure RapidAPI key to search real data</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : (
        <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="text-white text-xl mb-3">Find Rental Properties on Zillow</div>
            <div className="text-gray-300 mb-6">Search for rental properties across major markets using real Zillow data</div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
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
                onClick={() => setSearchTerm('Tampa')}
                className="text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              >
                Tampa
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
              <span>Click a city above or search to find real rental property listings!</span>
            </div>
            {!hasApiKey && (
              <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400">
                <Key className="h-4 w-4" />
                <span className="text-sm">Configure your RapidAPI key to access real Zillow data</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
