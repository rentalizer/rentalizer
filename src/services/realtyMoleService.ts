
const REALTYMOLE_API_BASE = 'https://realty-mole-property-api.p.rapidapi.com';

// Note: This is a public API key for demonstration. In production, this should be stored in Supabase secrets
const RAPIDAPI_KEY = 'your-rapidapi-key-here'; // User will need to replace this

export interface RealtyMoleProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: string;
  listingType: string;
  photos: string[];
  description: string;
  amenities: string[];
  latitude: number;
  longitude: number;
}

export const searchRentals = async (
  city: string,
  state: string,
  limit: number = 50
): Promise<RealtyMoleProperty[]> => {
  try {
    const response = await fetch(
      `${REALTYMOLE_API_BASE}/rentals?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&limit=${limit}&propertyType=apartment,condo,townhouse`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`RealtyMole API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform RealtyMole data to our format
    return data.results?.map((property: any) => ({
      id: property.id || Math.random().toString(),
      title: `${property.propertyType || 'Apartment'} in ${property.city}`,
      address: `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`,
      price: property.price || property.rent || 0,
      bedrooms: property.bedrooms || 1,
      bathrooms: property.bathrooms || 1,
      sqft: property.squareFootage || 800,
      images: property.photos?.slice(0, 5) || [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges'
      ],
      rating: 4.0 + Math.random() * 1,
      amenities: property.amenities || ['Parking', 'Laundry'],
      availability: 'Available Now',
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'contact@property.com'
      },
      city: property.city?.toLowerCase() || city.toLowerCase(),
      propertyType: property.propertyType,
      description: property.description || ''
    })) || [];
  } catch (error) {
    console.error('Error fetching from RealtyMole:', error);
    // Fallback to expanded mock data for apartments only
    return getMockApartmentData(city);
  }
};

// Expanded mock data focused on apartments, condos, and townhouses only
const getMockApartmentData = (searchCity?: string) => {
  const apartments = [
    // San Diego Apartments
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      address: '1234 Broadway St, Downtown, San Diego, CA 92101',
      price: 2800,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=edges',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=edges'
      ],
      rating: 4.7,
      amenities: ['Pool', 'Gym', 'Parking', 'Pet Friendly', 'Concierge'],
      availability: 'Available Now',
      contactInfo: { phone: '(619) 555-0123', email: 'leasing@modernapt.com' },
      city: 'san diego',
      propertyType: 'apartment'
    },
    {
      id: '2',
      title: 'Luxury High-Rise Condo',
      address: '567 Fifth Ave, Gaslamp, San Diego, CA 92101',
      price: 3200,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=edges',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=edges'
      ],
      rating: 4.8,
      amenities: ['Rooftop Deck', 'Fitness Center', 'City Views', 'Concierge'],
      availability: 'Available Dec 15',
      contactInfo: { phone: '(619) 555-0456', email: 'info@luxurycondo.com' },
      city: 'san diego',
      propertyType: 'condo'
    },
    // Denver Apartments  
    {
      id: '4',
      title: 'Urban Apartment With Mountain Views',
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
      contactInfo: { phone: '(303) 555-0234', email: 'info@urbanapt.com' },
      city: 'denver',
      propertyType: 'apartment'
    },
    {
      id: '5',
      title: 'Capitol Hill Modern Condo',
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
      contactInfo: { phone: '(303) 555-0567', email: 'rentals@capitolhill.com' },
      city: 'denver',
      propertyType: 'condo'
    },
    // Seattle Apartments
    {
      id: '6',
      title: 'Belltown Waterfront Apartment',
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
      contactInfo: { phone: '(206) 555-0890', email: 'leasing@belltownapt.com' },
      city: 'seattle',
      propertyType: 'apartment'
    }
    // Add more apartments for other cities...
  ];

  if (searchCity) {
    return apartments.filter(apt => apt.city.includes(searchCity.toLowerCase()));
  }
  return apartments;
};
