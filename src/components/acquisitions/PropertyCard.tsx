
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, DollarSign, Star, Heart } from 'lucide-react';
import { ManualContactDialog } from './ManualContactDialog';

interface PropertyCardProps {
  property: {
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
  };
  onContact: (property: any) => void;
  onSaveProperty: (property: any) => void;
}

export const PropertyCard = ({ property, onContact, onSaveProperty }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [showContactDialog, setShowContactDialog] = React.useState(false);

  const handleContactClick = () => {
    setShowContactDialog(true);
  };

  return (
    <>
      <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-4">
          {/* Price and Rating */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                ${property.price.toLocaleString()}/mo
              </span>
              {property.rating && (
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{property.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {property.availability}
              </Badge>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white p-2 rounded-full hover:bg-gray-50 border border-gray-200"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-4 mb-3 text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} bath</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Title and Address */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.address}</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              onClick={handleContactClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Contact Owner
            </Button>
            <Button 
              onClick={() => onSaveProperty(property)}
              variant="outline" 
              className="flex-1"
            >
              Save Property
            </Button>
          </div>
        </CardContent>
      </Card>

      <ManualContactDialog
        isOpen={showContactDialog}
        onClose={() => setShowContactDialog(false)}
        property={property}
      />
    </>
  );
};
