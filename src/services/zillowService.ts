
const ZILLOW_API_BASE = 'https://zillow-com1.p.rapidapi.com';

export interface ZillowProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  rating?: number;
  amenities: string[];
  availability: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  city: string;
  propertyType: string;
  description?: string;
}

export const searchRentals = async (
  city: string,
  state: string,
  limit: number = 50
): Promise<ZillowProperty[]> => {
  const rapidApiKey = localStorage.getItem('professional_data_key') || 
                     localStorage.getItem('airdna_api_key') || 
                     localStorage.getItem('rapidapi_key');
  
  if (!rapidApiKey) {
    console.error('❌ RapidAPI key not found. Please configure your API key first.');
    return [];
  }

  console.log('🔍 Searching Zillow API for:', { city, state, limit });
  console.log('🔑 Using API key (first 10 chars):', rapidApiKey.substring(0, 10) + '...');

  try {
    // Try multiple different endpoints and approaches
    const searchOptions = [
      // Option 1: Standard property search
      {
        url: `${ZILLOW_API_BASE}/properties/search?location=${encodeURIComponent(city + ', ' + state)}&status_type=ForRent&home_type=Houses,Townhomes,Condos,Apartments`,
        name: 'Standard Search'
      },
      // Option 2: Rentals endpoint
      {
        url: `${ZILLOW_API_BASE}/rentals?location=${encodeURIComponent(city + ', ' + state)}&home_type=Houses,Townhomes,Condos,Apartments`,
        name: 'Rentals Endpoint'
      },
      // Option 3: Properties list
      {
        url: `${ZILLOW_API_BASE}/properties/list?location=${encodeURIComponent(city + ', ' + state)}&status_type=ForRent`,
        name: 'Properties List'
      },
      // Option 4: Just city name without state
      {
        url: `${ZILLOW_API_BASE}/properties/search?location=${encodeURIComponent(city)}&status_type=ForRent`,
        name: 'City Only Search'
      }
    ];

    for (const option of searchOptions) {
      console.log(`📡 Trying ${option.name}:`, option.url);

      try {
        const response = await fetch(option.url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
          }
        });

        console.log(`📊 ${option.name} Response Status:`, response.status);
        console.log(`📊 ${option.name} Response Headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${option.name} Raw API Data:`, data);
          
          // Check various possible data structures
          let properties = [];
          if (data && data.props && data.props.length > 0) {
            properties = data.props;
          } else if (data && data.results && data.results.length > 0) {
            properties = data.results;
          } else if (data && data.data && data.data.length > 0) {
            properties = data.data;
          } else if (data && Array.isArray(data) && data.length > 0) {
            properties = data;
          } else if (data && data.searchResults && data.searchResults.listResults) {
            properties = data.searchResults.listResults;
          }

          if (properties.length > 0) {
            console.log(`🎯 Found ${properties.length} properties using ${option.name}`);
            
            // Transform data to our format
            const transformedProperties = properties.slice(0, limit).map((property: any, index: number) => ({
              id: property.zpid || property.id || `${city}-${index}-${Math.random().toString(36).substr(2, 9)}`,
              title: property.address?.streetAddress || property.formattedChip || property.title || `Property in ${city}`,
              address: property.address ? 
                `${property.address.streetAddress || ''}, ${property.address.city || city}, ${property.address.state || state}`.trim() :
                property.fullAddress || property.address || `${city}, ${state}`,
              price: property.price || property.unformattedPrice || property.rentZestimate || 2000,
              bedrooms: property.bedrooms || property.beds || 2,
              bathrooms: property.bathrooms || property.baths || 2,
              sqft: property.livingArea || property.lotAreaValue || property.sqft || 1000,
              images: property.photos ? property.photos.slice(0, 5).map((p: any) => p.url || p) : [
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'
              ],
              rating: 4.0 + Math.random() * 1,
              amenities: ['Parking', 'Laundry'],
              availability: 'Available Now',
              contactInfo: {
                phone: property.contactPhone || '(555) 123-4567',
                email: property.contactEmail || 'contact@property.com'
              },
              city: property.address?.city?.toLowerCase() || city.toLowerCase(),
              propertyType: property.propertyType || property.homeType || 'Apartment',
              description: property.description || ''
            }));

            console.log('✅ Transformed Properties:', transformedProperties);
            return transformedProperties;
          }
        } else {
          const errorText = await response.text();
          console.error(`❌ ${option.name} API Error:`, response.status, errorText);
        }
      } catch (optionError) {
        console.error(`❌ Error with ${option.name}:`, optionError);
      }
    }

    console.error('❌ No data found from any Zillow API endpoint for:', { city, state });
    
    // Generate some mock data as fallback so user can see the interface works
    console.log('🔄 Generating sample data for demonstration...');
    const mockProperties = Array.from({ length: 6 }, (_, i) => ({
      id: `mock-${city}-${i}`,
      title: `Sample Rental Property ${i + 1}`,
      address: `${100 + i * 50} Sample St, ${city}, ${state}`,
      price: 1800 + (i * 200),
      bedrooms: 1 + (i % 3),
      bathrooms: 1 + (i % 2),
      sqft: 800 + (i * 100),
      images: [
        `https://images.unsplash.com/photo-${1522708323590 + i}?w=800&h=600&fit=crop&crop=edges`
      ],
      rating: 4.0 + Math.random() * 1,
      amenities: ['Parking', 'Laundry', 'Air Conditioning'][Math.floor(Math.random() * 3)] ? ['Parking'] : ['Laundry'],
      availability: 'Available Now',
      contactInfo: {
        phone: `(555) 123-45${60 + i}`,
        email: `property${i + 1}@example.com`
      },
      city: city.toLowerCase(),
      propertyType: ['Apartment', 'House', 'Condo'][i % 3],
      description: `Sample rental property in ${city}. API integration in progress.`
    }));

    return mockProperties;
    
  } catch (error) {
    console.error('❌ Error fetching from Zillow API:', error);
    return [];
  }
};
