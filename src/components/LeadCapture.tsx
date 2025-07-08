import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, User, CheckCircle, Bot } from 'lucide-react';

interface LeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (leadId: string) => void;
}

export const LeadCapture = ({ isOpen, onClose, onSuccess }: LeadCaptureProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to access Ask Richie AI.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if lead already exists
      const { data: existingLead } = await supabase
        .from('lead_captures')
        .select('id, total_questions_asked')
        .eq('email', formData.email.trim())
        .maybeSingle();

      let leadId: string;

      if (existingLead) {
        // Lead exists, use existing ID
        leadId = existingLead.id;
        
        if (existingLead.total_questions_asked >= 10) {
          toast({
            title: "Question Limit Reached",
            description: "You've reached your 10 free questions. Please contact us for more access.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      } else {
        // Create new lead capture
        const { data: newLead, error: dbError } = await supabase
          .from('lead_captures')
          .insert([
            {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim()
            }
          ])
          .select('id')
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        leadId = newLead.id;

        // Send welcome email via edge function
        const { error: emailError } = await supabase.functions.invoke('lead-capture-welcome', {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim()
          }
        });

        if (emailError) {
          console.error('Email error:', emailError);
          // Don't throw here - the signup was successful even if email fails
        }
      }

      setIsSuccessState(true);
      toast({
        title: "Access Granted!",
        description: existingLead 
          ? `Welcome back! You have ${10 - existingLead.total_questions_asked} questions remaining.`
          : "You now have access to Ask Richie AI with 10 free questions.",
      });

      // Pass lead ID to parent and close after short delay
      setTimeout(() => {
        onSuccess(leadId);
        setFormData({ name: '', email: '', phone: '' });
        setIsSuccessState(false);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Lead capture error:', error);
      toast({
        title: "Error",
        description: "Failed to create access. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSuccessState) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-cyan-500/20 max-w-md">
          <div className="text-center py-8">
            <Bot className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Access Granted!</h3>
            <p className="text-gray-300">
              You can now chat with Richie AI. Opening chatbot...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-cyan-500/20 max-w-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogHeader>
          <DialogTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
            <Bot className="h-6 w-6 text-cyan-400" />
            Access Ask Richie AI
          </DialogTitle>
          <div className="text-gray-300 text-sm text-center mt-4 space-y-4">
            <p className="font-medium text-cyan-300">Your on-demand rental arbitrage mentor—powered by AI and trained on over 200 hours of video trainings and coaching calls, plus more than 1,350,000 words of transcripts, guides, checklists, and deal analysis tools.</p>
            
            <p>It pulls directly from my actual content—not generic internet data—so every answer reflects exactly how I teach, analyze, and execute. Whether you're asking about deal criteria, landlord objections, STR licensing, or next steps after a "yes," Ask Richie gives you clear, tactical responses 24/7—just like I would.</p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-cyan-300 flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-cyan-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-cyan-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                required
              />
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              • 10 free questions about rental arbitrage<br/>
              • Expert AI guidance from Richie<br/>
              • No subscription required
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating Access..." : "Get Free Access"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};