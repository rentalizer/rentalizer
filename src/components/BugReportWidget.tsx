import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bug, Send, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

export const BugReportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/bug-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: formData.subject,
          description: formData.description,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit bug report');
      }

      toast({
        title: "Bug Report Sent! 🐛",
        description: "Thank you for helping us improve. We'll look into this issue.",
      });

      // Reset form and close dialog
      setFormData({ subject: '', description: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting bug report:', error);
      toast({
        title: "Failed to Send",
        description: "Please try again or contact us directly at gelodevelops@gmail.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Bug Report Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
        title="Report a Bug"
      >
        <Bug className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Bug Report Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-red-500/30 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-400" />
              Report a Bug
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-300">
                Subject / Bug Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of the issue"
                className="bg-slate-800 border-red-500/30 text-white placeholder:text-gray-500"
                disabled={isSubmitting}
                maxLength={100}
              />
              <p className="text-xs text-gray-400">
                {formData.subject.length}/100
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe what happened, what you expected, and steps to reproduce..."
                className="bg-slate-800 border-red-500/30 text-white placeholder:text-gray-500 h-32 resize-none"
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-xs text-gray-400">
                {formData.description.length}/500
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400">
                <span className="text-cyan-300">💡 Tip:</span> Include what you were doing when the bug occurred and any error messages you saw.
              </p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Report
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Report goes to: gelodevelops@gmail.com
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

