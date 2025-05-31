
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

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(property.contactInfo.phone);
    toast({
      title: "Phone Number Copied",
      description: "Phone number has been copied to clipboard",
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(property.contactInfo.email);
    toast({
      title: "Email Copied", 
      description: "Email address has been copied to clipboard",
    });
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Interest in ${property.title}`);
    const body = encodeURIComponent(`${formData.message}\n\nBest regards,\n${formData.name}\n${formData.phone}\n${formData.email}`);
    const mailtoLink = `mailto:${property.contactInfo.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
    
    toast({
      title: "Email Client Opened",
      description: "Your default email client should open with the message pre-filled",
    });
  };

  const handleCall = () => {
    window.open(`tel:${property.contactInfo.phone}`);
  };

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

          {/* Contact Information Section - This was missing */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Property Contact Information</h4>
            
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-900 font-medium">{property.contactInfo.phone}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopyPhone}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" onClick={handleCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="h-3 w-3" />
                  Call
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-900 font-medium">{property.contactInfo.email}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleCopyEmail}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
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
            <Button onClick={handleSendEmail} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
