
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, User, MessageSquare, Send, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
    contactInfo: {
      phone: string;
      email: string;
    };
  };
}

export const ManualContactDialog = ({ isOpen, onClose, property }: ManualContactDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: `Hi! I'm interested in your property at ${property.address}. Could we schedule a viewing? Thank you!`
  });
  const { toast } = useToast();

  // Comprehensive debugging
  console.log('🔍 ManualContactDialog - Full property object:', JSON.stringify(property, null, 2));
  console.log('🔍 ManualContactDialog - Property contactInfo:', property?.contactInfo);
  console.log('🔍 ManualContactDialog - Phone:', property?.contactInfo?.phone);
  console.log('🔍 ManualContactDialog - Email:', property?.contactInfo?.email);
  console.log('🔍 ManualContactDialog - Property keys:', Object.keys(property || {}));

  const handleCopyPhone = () => {
    if (property?.contactInfo?.phone) {
      navigator.clipboard.writeText(property.contactInfo.phone);
      toast({
        title: "Phone Number Copied",
        description: "Phone number has been copied to clipboard",
      });
    }
  };

  const handleCopyEmail = () => {
    if (property?.contactInfo?.email) {
      navigator.clipboard.writeText(property.contactInfo.email);
      toast({
        title: "Email Copied", 
        description: "Email address has been copied to clipboard",
      });
    }
  };

  const handleSendEmail = () => {
    if (property?.contactInfo?.email) {
      const subject = encodeURIComponent(`Interest in ${property.title}`);
      const body = encodeURIComponent(`${formData.message}\n\nBest regards,\n${formData.name}\n${formData.phone}\n${formData.email}`);
      const mailtoLink = `mailto:${property.contactInfo.email}?subject=${subject}&body=${body}`;
      window.open(mailtoLink);
      
      toast({
        title: "Email Client Opened",
        description: "Your default email client should open with the message pre-filled",
      });
    }
  };

  const handleCall = () => {
    if (property?.contactInfo?.phone) {
      window.open(`tel:${property.contactInfo.phone}`);
    }
  };

  // Safety checks
  const hasContactInfo = property?.contactInfo;
  const hasPhone = hasContactInfo && property.contactInfo.phone;
  const hasEmail = hasContactInfo && property.contactInfo.email;

  console.log('🔍 Contact info checks:', { hasContactInfo, hasPhone, hasEmail });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Contact Property Owner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Debug Info - Remove this after testing */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs">
            <div className="font-semibold text-yellow-800 mb-1">DEBUG INFO:</div>
            <div>Has Contact Info: {hasContactInfo ? 'YES' : 'NO'}</div>
            <div>Phone: {hasPhone ? property.contactInfo.phone : 'MISSING'}</div>
            <div>Email: {hasEmail ? property.contactInfo.email : 'MISSING'}</div>
            <div>Property ID: {property?.id || 'MISSING'}</div>
          </div>

          {/* Property Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <MapPin className="h-4 w-4" />
              {property.address}
            </div>
            <div className="text-lg font-bold text-blue-600">
              ${property.price.toLocaleString()}/mo
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Property Contact Information
            </h4>
            
            {hasContactInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-gray-900 font-medium">
                        {hasPhone ? property.contactInfo.phone : 'No phone provided'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopyPhone} disabled={!hasPhone}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button size="sm" onClick={handleCall} className="bg-green-600 hover:bg-green-700" disabled={!hasPhone}>
                      <Phone className="h-3 w-3" />
                      Call
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-gray-900 font-medium">
                        {hasEmail ? property.contactInfo.email : 'No email provided'}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleCopyEmail} disabled={!hasEmail}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700">
                ERROR: No contact information found for this property!
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Compose Message</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Your Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                placeholder="Hi! I'm interested in your property..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSendEmail} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!hasEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
