
const ZILLOW_API_BASE = 'https://zillow-com1.p.rapidapi.com';
const RAPIDAPI_KEY = '550bdd9779e1471cb9ddcd3505437a95';

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
  console.log('🔍 Searching Zillow API for:', { city, state, limit });
  console.log('🔑 Using API key:', RAPIDAPI_KEY);

  try {
    // Use the search endpoint with proper query parameters
    const searchUrl = `${ZILLOW_API_BASE}/search`;
    const searchParams = new URLSearchParams({
      location: `${city}, ${state}`,
      status: 'forRent',
      home_type: 'Houses,Townhomes,Condos,Apartments'
    });

    const fullUrl = `${searchUrl}?${searchParams.toString()}`;
    console.log('📡 API Request URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      
      if (response.status === 401 || response.status === 403) {
        console.error('🔑 Authentication failed - Invalid RapidAPI key or subscription');
        return generateSampleProperties(city, state, limit);
      }
      
      if (response.status === 429) {
        console.error('⏱️ Rate limit exceeded - too many requests');
        return generateSampleProperties(city, state, limit);
      }
      
      console.error('❌ HTTP Error:', response.status, response.statusText);
      return generateSampleProperties(city, state, limit);
    }

    const data = await response.json();
    console.log('✅ Raw API Response:', JSON.stringify(data, null, 2));

    // Handle different response structures from Zillow API
    let properties = [];
    
    if (data && data.results && Array.isArray(data.results)) {
      properties = data.results;
    } else if (data && data.searchResults && data.searchResults.listResults) {
      properties = data.searchResults.listResults;
    } else if (data && data.props && Array.isArray(data.props)) {
      properties = data.props;
    } else if (data && data.data && Array.isArray(data.data)) {
      properties = data.data;
    } else if (data && data.searchList && Array.isArray(data.searchList)) {
      properties = data.searchList;
    } else if (Array.isArray(data)) {
      properties = data;
    } else {
      console.error('❌ Unexpected response structure:', data);
      
      // If no real data, return sample data for testing
      console.log('🔄 Returning sample data for testing...');
      return generateSampleProperties(city, state, limit);
    }

    console.log(`🎯 Found ${properties.length} properties from Zillow API`);

    if (properties.length === 0) {
      console.log('🔄 No properties found, returning sample data for testing...');
      return generateSampleProperties(city, state, limit);
    }

    // Transform the data
    const transformedProperties = properties.slice(0, limit).map((property: any, index: number) => {
      console.log(`🔧 Processing property ${index + 1}:`, property);
      
      const zpid = property.zpid || property.id || property.listingId || `${city}-${index}-${Date.now()}`;
      const addressData = property.address || {};
      const priceData = property.price || property.rentZestimate || property.unformattedPrice;
      
      return {
        id: zpid.toString(),
        title: property.address?.streetAddress || 
               property.streetAddress || 
               `${addressData.streetAddress || 'Property'} in ${city}`,
        address: `${addressData.streetAddress || property.streetAddress || ''}, ${addressData.city || city}, ${addressData.state || state}`.replace(/^, /, ''),
        price: extractPrice(priceData),
        bedrooms: property.bedrooms || property.beds || 2,
        bathrooms: property.bathrooms || property.baths || 2,
        sqft: property.livingArea || property.finishedSqFt || property.sqft || 1000,
        images: extractImages(property),
        rating: 4.0 + Math.random() * 1,
        amenities: extractAmenities(property),
        availability: 'Available Now',
        contactInfo: {
          phone: property.contactPhone || '(555) 123-4567',
          email: property.contactEmail || 'contact@property.com'
        },
        city: city.toLowerCase(),
        propertyType: property.propertyType || property.homeType || 'Apartment',
        description: property.description || ''
      };
    });

    console.log('✅ Final transformed properties:', transformedProperties);
    return transformedProperties;
    
  } catch (error) {
    console.error('❌ Network error:', error);
    console.log('🔄 Returning sample data due to error...');
    return generateSampleProperties(city, state, limit);
  }
}

// Generate sample properties for testing when API fails
function generateSampleProperties(city: string, state: string, limit: number): ZillowProperty[] {
  console.log(`🎭 Generating ${limit} sample properties for ${city}, ${state}`);
  
  const sampleProperties = [];
  for (let i = 1; i <= Math.min(limit, 20); i++) {
    sampleProperties.push({
      id: `sample-${city}-${i}`,
      title: `${i}${i % 10 === 1 ? 'st' : i % 10 === 2 ? 'nd' : i % 10 === 3 ? 'rd' : 'th'} Street Apartment`,
      address: `${100 + i * 10} Main Street, ${city}, ${state}`,
      price: 1800 + Math.floor(Math.random() * 2000),
      bedrooms: Math.floor(Math.random() * 3) + 1,
      bathrooms: Math.floor(Math.random() * 2) + 1,
      sqft: 800 + Math.floor(Math.random() * 1200),
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'],
      rating: 4.0 + Math.random() * 1,
      amenities: ['Parking', 'Laundry', 'Air Conditioning'],
      availability: 'Available Now',
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'contact@property.com'
      },
      city: city.toLowerCase(),
      propertyType: 'Apartment',
      description: `Beautiful ${Math.floor(Math.random() * 3) + 1} bedroom apartment in ${city}`
    });
  }
  
  return sampleProperties;
}

// Extract price from various formats
function extractPrice(priceData: any): number {
  if (typeof priceData === 'number') return priceData;
  if (typeof priceData === 'string') {
    const price = parseInt(priceData.replace(/[^0-9]/g, ''));
    return price > 0 ? price : 2000;
  }
  return 2000;
}

// Helper function to extract images from property data
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

// Helper function to extract amenities from property data
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
