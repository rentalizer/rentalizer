import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Grid, Plus, MoreHorizontal } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';

interface Listing {
  id: string;
  image: string;
  title: string;
  type: string;
  location: string;
  status: 'Listed' | 'Unlisted';
}

export const Listings = () => {
  const mockListings: Listing[] = [
    {
      id: '1',
      image: '/lovable-uploads/d0f04aff-7c0b-4008-ac0c-7dd5c108ab09.png',
      title: 'La Jolla UTC w/ Pool & Hot Tub, Parking, King Beds',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '2', 
      image: '/lovable-uploads/d21f97f7-ec22-4fdf-9adc-269fa47fec73.png',
      title: 'King Bed Suite w/Gym/Bikes/Roof Top Pool & Hot Tub',
      type: 'Apartment',
      location: 'National City, CA', 
      status: 'Listed'
    },
    {
      id: '3',
      image: '/lovable-uploads/d68927c6-c7f4-4dd4-8d17-979d51a48dad.png',
      title: 'Resort Style Condo w/Pool/Hot Tub, Gym, Game Room',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '4',
      image: '/lovable-uploads/d6a5a46f-caad-4378-8869-7525c7e6f621.png',
      title: 'Classy & Clean Apt w/ Parking, AC, Cable+HBO',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '5',
      image: '/lovable-uploads/e23a9817-2f9e-42bb-8e9c-6fa45ccc8deb.png',
      title: 'Central King Bed Lux Suite w/Pool/HotTub/Gym/Bikes',
      type: 'Apartment',
      location: 'National City, CA',
      status: 'Listed'
    },
    {
      id: '6',
      image: '/lovable-uploads/e5dcd8f4-2858-4789-9448-f876221dedec.png',
      title: 'Sunny Studio Near Restaurants+Attractions',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '7',
      image: '/lovable-uploads/ef710610-2357-4b37-930f-9f6f689c6888.png',
      title: 'Resort Style by Beach w/Pool/Gym/Theater/King Beds',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '8',
      image: '/lovable-uploads/f01a7927-4318-452b-8513-c35042097178.png',
      title: 'Resort Style by Beach + Pool/Hot Tub/Gym/King Beds',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '9',
      image: '/lovable-uploads/f475d8b4-915e-4c34-b435-fe9e431107e3.png',
      title: 'Bright Downtown Apt w/WiFi, Cable, Walk to All',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '10',
      image: '/lovable-uploads/f5ff4f34-560a-42e3-92d3-aea5ceced3a5.png',
      title: 'Modern Close to Airport, Suite w/ WiFi + Cable/HBO',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '11',
      image: '/lovable-uploads/fcf74d36-487a-4dca-bb60-87c5b306b7e0.png',
      title: 'Sunny Downtown Apt: Walk to All, Parking/HBO/WiFi',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    },
    {
      id: '12',
      image: '/lovable-uploads/8f8edc04-6698-4212-8d0d-49e6b8c81e58.png',
      title: 'Sunny Top Floor Old Town Studio by SeaWorld + All',
      type: 'Apartment',
      location: 'San Diego, CA',
      status: 'Listed'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopNavBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Your listings</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create listing
            </Button>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="col-span-5">Listing</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Table Rows */}
          <div className="">
            {mockListings.map((listing) => (
              <div key={listing.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Listing */}
                <div className="col-span-5 flex items-center gap-3">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {listing.title}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">{listing.type}</span>
                </div>

                {/* Location */}
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-600">{listing.location}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      listing.status === 'Listed' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      listing.status === 'Listed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};