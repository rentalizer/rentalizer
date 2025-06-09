
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Star, Users, DollarSign } from 'lucide-react';

export const PropertyManagement = () => {
  const properties = [
    {
      id: 1,
      name: 'Downtown Loft',
      address: '123 Main St, San Francisco, CA',
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      platforms: ['Airbnb', 'VRBO'],
      status: 'occupied',
      revenue: '$3,200',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Beach House',
      address: '456 Ocean Ave, Santa Monica, CA',
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      platforms: ['Airbnb', 'Booking.com'],
      status: 'available',
      revenue: '$4,100',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Mountain Cabin',
      address: '789 Pine Rd, Lake Tahoe, CA',
      bedrooms: 4,
      bathrooms: 3,
      guests: 8,
      platforms: ['VRBO', 'Booking.com'],
      status: 'cleaning',
      revenue: '$2,800',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your short-term rental properties</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-3 right-3 ${getStatusColor(property.status)}`}>
                {property.status}
              </Badge>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{property.name}</CardTitle>
                  <p className="text-sm text-gray-600">{property.address}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Property Details */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                <span>Max {property.guests} guests</span>
              </div>

              {/* Platforms */}
              <div className="flex gap-1 mb-4">
                {property.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm font-medium">{property.revenue}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{property.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
