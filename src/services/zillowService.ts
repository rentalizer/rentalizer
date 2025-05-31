
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
    // Try Zillow property search endpoint
    const searchUrl = `${ZILLOW_API_BASE}/properties/search?location=${encodeURIComponent(city + ', ' + state)}&status_type=ForRent&home_type=Houses,Townhomes,Condos,Apartments`;
    
    console.log('📡 Trying Zillow search endpoint:', searchUrl);

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
      }
    });

    console.log('📊 Zillow Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Raw Zillow API Data:', data);
      
      // Check if we have results
      if (data && data.props && data.props.length > 0) {
        console.log(`🎯 Found ${data.props.length} properties from Zillow`);
        
        // Transform Zillow data to our format
        const properties = data.props.slice(0, limit).map((property: any, index: number) => ({
          id: property.zpid || `${city}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          title: property.address?.streetAddress || property.formattedChip || `Property in ${city}`,
          address: property.address ? 
            `${property.address.streetAddress || ''}, ${property.address.city || city}, ${property.address.state || state}`.trim() :
            `${city}, ${state}`,
          price: property.price || property.unformattedPrice || 2000,
          bedrooms: property.bedrooms || 2,
          bathrooms: property.bathrooms || 2,
          sqft: property.livingArea || property.lotAreaValue || 1000,
          images: property.photos ? property.photos.slice(0, 5).map((p: any) => p.url || p) : [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'
          ],
          rating: 4.0 + Math.random() * 1,
          amenities: property.description ? ['Parking', 'Laundry'] : ['Parking'],
          availability: 'Available Now',
          contactInfo: {
            phone: property.contactPhone || '(555) 123-4567',
            email: property.contactEmail || 'contact@property.com'
          },
          city: property.address?.city?.toLowerCase() || city.toLowerCase(),
          propertyType: property.propertyType || property.homeType || 'Apartment',
          description: property.description || ''
        }));

        console.log('✅ Transformed Zillow Properties:', properties);
        return properties;
      } else {
        console.log('⚠️ Zillow returned no results:', data);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Zillow API Error:', response.status, errorText);
    }

    console.error('❌ No data found from Zillow API for:', { city, state });
    return [];
    
  } catch (error) {
    console.error('❌ Error fetching from Zillow API:', error);
    return [];
  }
};
