
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ContactChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message) {
      toast({
        title: "Missing Information",
        description: "Please enter your message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save contact message to database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: 'Member', // Default name since they're logged in
          email: '', // No email needed for DM format
          message: message.trim(),
        });

      if (error) {
        console.error('Error saving contact message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Call edge function to send notification
      try {
        await supabase.functions.invoke('send-contact-notification', {
          body: {
            name: 'Member',
            email: '',
            message: message.trim(),
          },
        });
      } catch (emailError) {
        console.error('Error sending notification:', emailError);
        // Don't show error to user since message was saved successfully
      }

      toast({
        title: "Message Sent!",
        description: "Your message has been delivered. We'll get back to you soon.",
      });

      // Reset form and close dialog
      setMessage('');
      setIsOpen(false);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/10"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Direct Message Us
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-cyan-300 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Send Direct Message
          </DialogTitle>
        </DialogHeader>
        
        {/* DM Format Interface */}
        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-lg p-4 min-h-[120px]">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="bg-transparent border-none resize-none text-white placeholder-gray-400 focus-visible:ring-0 p-0"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
