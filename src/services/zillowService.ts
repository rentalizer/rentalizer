
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
    // Updated search options with correct Zillow API endpoints
    const searchOptions = [
      // Option 1: Properties endpoint with correct parameters
      {
        url: `${ZILLOW_API_BASE}/properties?location=${encodeURIComponent(city + ', ' + state)}&status=forRent&sortSelection=priorityScore&doz=any`,
        name: 'Properties Endpoint'
      },
      // Option 2: Property search with different parameters
      {
        url: `${ZILLOW_API_BASE}/property-search?location=${encodeURIComponent(city + ', ' + state)}&status_type=ForRent&home_type=Houses,Townhomes,Condos,Apartments&sort=Price_Low_High`,
        name: 'Property Search'
      },
      // Option 3: Direct search endpoint
      {
        url: `${ZILLOW_API_BASE}/search?location=${encodeURIComponent(city + ', ' + state)}&statusType=ForRent&homeType=Houses,Townhomes,Condos,Apartments`,
        name: 'Search Endpoint'
      },
      // Option 4: Rentals specific endpoint
      {
        url: `${ZILLOW_API_BASE}/for-rent?location=${encodeURIComponent(city + ', ' + state)}&homeType=Houses,Townhomes,Condos,Apartments`,
        name: 'For Rent Endpoint'
      }
    ];

    for (const option of searchOptions) {
      console.log(`📡 Trying ${option.name}:`, option.url);

      try {
        const response = await fetch(option.url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
            'Accept': 'application/json'
          }
        });

        console.log(`📊 ${option.name} Response Status:`, response.status);
        console.log(`📊 ${option.name} Response Headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${option.name} Raw API Data:`, data);
          
          // Check various possible data structures from Zillow API
          let properties = [];
          
          // Common Zillow API response structures
          if (data && data.searchResults && data.searchResults.listResults) {
            properties = data.searchResults.listResults;
          } else if (data && data.props && Array.isArray(data.props)) {
            properties = data.props;
          } else if (data && data.results && Array.isArray(data.results)) {
            properties = data.results;
          } else if (data && data.data && Array.isArray(data.data)) {
            properties = data.data;
          } else if (data && data.properties && Array.isArray(data.properties)) {
            properties = data.properties;
          } else if (data && data.listings && Array.isArray(data.listings)) {
            properties = data.listings;
          } else if (Array.isArray(data)) {
            properties = data;
          }

          console.log(`🔍 Found ${properties.length} raw properties from ${option.name}`);

          if (properties.length > 0) {
            console.log(`🎯 Processing ${properties.length} properties using ${option.name}`);
            console.log('📋 Sample property structure:', properties[0]);
            
            // Transform data to our format with better field mapping
            const transformedProperties = properties.slice(0, limit).map((property: any, index: number) => {
              // Handle different Zillow property data structures
              const zpid = property.zpid || property.id || property.listingId || `${city}-${index}-${Date.now()}`;
              const addressData = property.address || property.addressStreet || property.location || {};
              const priceData = property.price || property.rentZestimate || property.unformattedPrice || 0;
              
              return {
                id: zpid.toString(),
                title: property.address?.streetAddress || 
                       property.streetAddress || 
                       property.title || 
                       `${addressData.streetAddress || 'Property'} in ${city}`,
                address: `${addressData.streetAddress || property.streetAddress || ''}, ${addressData.city || city}, ${addressData.state || state}`.replace(/^, /, ''),
                price: typeof priceData === 'string' ? parseInt(priceData.replace(/[^0-9]/g, '')) || 2000 : priceData || 2000,
                bedrooms: property.bedrooms || property.beds || property.bedroomCount || 2,
                bathrooms: property.bathrooms || property.baths || property.bathroomCount || 2,
                sqft: property.livingArea || property.finishedSqFt || property.sqft || property.lotAreaValue || 1000,
                images: this.extractImages(property),
                rating: 4.0 + Math.random() * 1,
                amenities: this.extractAmenities(property),
                availability: 'Available Now',
                contactInfo: {
                  phone: property.contactPhone || property.phone || '(555) 123-4567',
                  email: property.contactEmail || property.email || 'contact@property.com'
                },
                city: (addressData.city || city).toLowerCase(),
                propertyType: property.propertyType || property.homeType || property.type || 'Apartment',
                description: property.description || property.remarks || ''
              };
            });

            console.log('✅ Final transformed properties:', transformedProperties);
            return transformedProperties;
          }
        } else {
          const errorText = await response.text();
          console.error(`❌ ${option.name} API Error:`, response.status, response.statusText);
          console.error(`❌ Error details:`, errorText);
          
          // Check if it's an authentication error
          if (response.status === 401 || response.status === 403) {
            console.error('🔑 Authentication failed - check your RapidAPI key');
          }
        }
      } catch (optionError) {
        console.error(`❌ Network error with ${option.name}:`, optionError);
      }
    }

    console.error('❌ No data found from any Zillow API endpoint for:', { city, state });
    console.error('💡 This could be due to:');
    console.error('   - Invalid or expired RapidAPI key');
    console.error('   - Zillow API endpoint changes');
    console.error('   - Rate limiting');
    console.error('   - Location not found in Zillow database');
    
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from Zillow API:', error);
    return [];
  }
}

// Helper method to extract images from property data
function extractImages(property: any): string[] {
  if (property.photos && Array.isArray(property.photos)) {
    return property.photos.slice(0, 5).map((photo: any) => {
      if (typeof photo === 'string') return photo;
      return photo.url || photo.href || photo.src || '';
    }).filter(Boolean);
  }
  
  if (property.images && Array.isArray(property.images)) {
    return property.images.slice(0, 5);
  }
  
  if (property.photo) {
    return [property.photo];
  }
  
  // Fallback image
  return ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'];
}

// Helper method to extract amenities from property data
function extractAmenities(property: any): string[] {
  const amenities = [];
  
  if (property.hasParking || property.parking) amenities.push('Parking');
  if (property.hasLaundry || property.laundry) amenities.push('Laundry');
  if (property.hasAC || property.airConditioning) amenities.push('Air Conditioning');
  if (property.hasPool || property.pool) amenities.push('Pool');
  if (property.hasFitness || property.gym) amenities.push('Fitness Center');
  if (property.petFriendly || property.pets) amenities.push('Pet Friendly');
  
  if (property.amenities && Array.isArray(property.amenities)) {
    amenities.push(...property.amenities);
  }
  
  return amenities.length > 0 ? amenities : ['Parking', 'Laundry'];
}
