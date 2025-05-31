
const REALTYMOLE_API_BASE = 'https://realty-mole-property-api.p.rapidapi.com';

export interface RealtyMoleProperty {
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
): Promise<RealtyMoleProperty[]> => {
  // Get API key from localStorage (same key used for AirDNA and other RapidAPI services)
  const rapidApiKey = localStorage.getItem('professional_data_key') || 
                     localStorage.getItem('airdna_api_key') || 
                     localStorage.getItem('rapidapi_key');
  
  if (!rapidApiKey) {
    console.error('❌ RapidAPI key not found. Please configure your API key first.');
    return [];
  }

  console.log('🔍 Searching RealtyMole API for:', { city, state, limit });
  console.log('🔑 Using API key (first 10 chars):', rapidApiKey.substring(0, 10) + '...');

  try {
    // Try multiple API endpoints to find data
    const endpoints = [
      `${REALTYMOLE_API_BASE}/rentals?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=${limit}`,
      `${REALTYMOLE_API_BASE}/properties?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=${limit}&propertyType=rental`,
      `${REALTYMOLE_API_BASE}/saleListings?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=${limit}`
    ];

    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`📡 Trying endpoint ${i + 1}:`, endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        }
      });

      console.log(`📊 Response ${i + 1} Status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Raw API Data from endpoint ${i + 1}:`, data);
        
        // Check if we have results
        if (data && ((data.results && data.results.length > 0) || (Array.isArray(data) && data.length > 0))) {
          const results = data.results || data;
          console.log(`🎯 Found ${results.length} properties from endpoint ${i + 1}`);
          
          // Transform data to our format
          const properties = results.slice(0, limit).map((property: any, index: number) => ({
            id: property.id || `${city}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            title: property.formattedAddress || property.address || `Property in ${city}`,
            address: property.formattedAddress || property.address || `${city}, ${state}`,
            price: property.price || property.rent || property.listPrice || 2000 + Math.floor(Math.random() * 2000),
            bedrooms: property.bedrooms || property.beds || 2,
            bathrooms: property.bathrooms || property.baths || 2,
            sqft: property.squareFootage || property.sqft || property.livingArea || 1000 + Math.floor(Math.random() * 1000),
            images: property.photos?.slice(0, 5) || property.images?.slice(0, 5) || [
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'
            ],
            rating: 4.0 + Math.random() * 1,
            amenities: property.amenities || ['Parking', 'Laundry'],
            availability: 'Available Now',
            contactInfo: {
              phone: property.contactPhone || '(555) 123-4567',
              email: property.contactEmail || 'contact@property.com'
            },
            city: property.city?.toLowerCase() || city.toLowerCase(),
            propertyType: property.propertyType || 'Apartment',
            description: property.description || ''
          }));

          console.log('✅ Transformed Properties:', properties);
          return properties;
        } else {
          console.log(`⚠️ Endpoint ${i + 1} returned no results:`, data);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Endpoint ${i + 1} Error:`, response.status, errorText);
      }
    }

    // If no endpoints returned data
    console.error('❌ No data found from any endpoint for:', { city, state });
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from RealtyMole API:', error);
    return [];
  }
};
