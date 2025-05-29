
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, Clock, Mail, Target, Zap, Play, Pause, Settings } from 'lucide-react';

interface EmailSequence {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  emails: {
    day: number;
    subject: string;
    content: string;
  }[];
  recipients: number;
  openRate: number;
  responseRate: number;
}

// Mock email sequences
const mockSequences: EmailSequence[] = [
  {
    id: '1',
    name: 'Initial Property Inquiry',
    status: 'active',
    trigger: 'Property Contact Form',
    emails: [
      {
        day: 0,
        subject: 'Thank you for your interest in {{property_name}}',
        content: 'Hi {{contact_name}}, Thanks for reaching out about {{property_name}}...'
      },
      {
        day: 3,
        subject: 'Still interested in {{property_name}}?',
        content: 'Hi {{contact_name}}, I wanted to follow up about the property...'
      }
    ],
    recipients: 45,
    openRate: 78,
    responseRate: 23
  }
];

interface AIEmailAgentProps {
  selectedProperty?: any;
}

export const AIEmailAgent = ({ selectedProperty }: AIEmailAgentProps) => {
  const { toast } = useToast();
  const [sequences, setSequences] = useState<EmailSequence[]>(mockSequences);
  const [isCreatingSequence, setIsCreatingSequence] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  
  // New sequence form
  const [newSequence, setNewSequence] = useState({
    name: '',
    trigger: '',
    emails: [{ day: 0, subject: '', content: '' }]
  });

  const handleCreateSequence = () => {
    if (!newSequence.name || !newSequence.trigger) {
      toast({
        title: "Missing Information",
        description: "Please fill in sequence name and trigger.",
        variant: "destructive",
      });
      return;
    }

    const sequence: EmailSequence = {
      id: Date.now().toString(),
      name: newSequence.name,
      status: 'draft',
      trigger: newSequence.trigger,
      emails: newSequence.emails.filter(email => email.subject && email.content),
      recipients: 0,
      openRate: 0,
      responseRate: 0
    };

    setSequences([...sequences, sequence]);
    setNewSequence({ name: '', trigger: '', emails: [{ day: 0, subject: '', content: '' }] });
    setIsCreatingSequence(false);
    
    toast({
      title: "Sequence Created",
      description: "Your email sequence has been created successfully.",
    });
  };

  const toggleSequenceStatus = (id: string) => {
    setSequences(sequences.map(seq => 
      seq.id === id 
        ? { ...seq, status: seq.status === 'active' ? 'paused' : 'active' }
        : seq
    ));
  };

  const addEmailToSequence = () => {
    setNewSequence({
      ...newSequence,
      emails: [...newSequence.emails, { day: 0, subject: '', content: '' }]
    });
  };

  const updateEmail = (index: number, field: string, value: string | number) => {
    const updatedEmails = newSequence.emails.map((email, i) => 
      i === index ? { ...email, [field]: value } : email
    );
    setNewSequence({ ...newSequence, emails: updatedEmails });
  };

  const removeEmail = (index: number) => {
    const updatedEmails = newSequence.emails.filter((_, i) => i !== index);
    setNewSequence({ ...newSequence, emails: updatedEmails });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Email Agent</h2>
            <p className="text-gray-600">Automated IFTTT email sequences for property outreach</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsCreatingSequence(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          Create Sequence
        </Button>
      </div>

      {/* Active Sequences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sequences.map((sequence) => (
          <Card key={sequence.id} className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{sequence.name}</CardTitle>
                <Badge 
                  variant={sequence.status === 'active' ? 'default' : sequence.status === 'paused' ? 'secondary' : 'outline'}
                  className={
                    sequence.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : sequence.status === 'paused' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {sequence.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-1" />
                {sequence.trigger}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Sequence Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{sequence.recipients}</div>
                    <div className="text-xs text-gray-500">Recipients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{sequence.openRate}%</div>
                    <div className="text-xs text-gray-500">Open Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{sequence.responseRate}%</div>
                    <div className="text-xs text-gray-500">Response Rate</div>
                  </div>
                </div>

                {/* Email Timeline */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email Timeline</Label>
                  {sequence.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600">Day {email.day}:</span>
                      <span className="text-gray-900 truncate">{email.subject}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={sequence.status === 'active' ? 'secondary' : 'default'}
                    onClick={() => toggleSequenceStatus(sequence.id)}
                    className="flex-1"
                  >
                    {sequence.status === 'active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Sequence Modal */}
      {isCreatingSequence && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Create New Email Sequence
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sequence-name">Sequence Name</Label>
                <Input
                  id="sequence-name"
                  placeholder="e.g., Property Follow-up"
                  value={newSequence.name}
                  onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="trigger">Trigger Event</Label>
                <Select value={newSequence.trigger} onValueChange={(value) => setNewSequence({ ...newSequence, trigger: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property-contact">Property Contact Form</SelectItem>
                    <SelectItem value="property-view">Property Page View</SelectItem>
                    <SelectItem value="manual-add">Manual Add to Sequence</SelectItem>
                    <SelectItem value="webhook">Custom Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Email Sequence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Email Sequence</Label>
                <Button size="sm" variant="outline" onClick={addEmailToSequence}>
                  <Mail className="h-4 w-4 mr-1" />
                  Add Email
                </Button>
              </div>

              {newSequence.emails.map((email, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Email {index + 1}</Label>
                      {newSequence.emails.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeEmail(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <Label htmlFor={`day-${index}`}>Send on Day</Label>
                        <Input
                          id={`day-${index}`}
                          type="number"
                          min="0"
                          value={email.day}
                          onChange={(e) => updateEmail(index, 'day', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label htmlFor={`subject-${index}`}>Subject Line</Label>
                        <Input
                          id={`subject-${index}`}
                          placeholder="Enter email subject..."
                          value={email.subject}
                          onChange={(e) => updateEmail(index, 'subject', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`content-${index}`}>Email Content</Label>
                      <Textarea
                        id={`content-${index}`}
                        placeholder="Enter email content... Use {{contact_name}}, {{property_name}}, etc. for personalization"
                        rows={4}
                        value={email.content}
                        onChange={(e) => updateEmail(index, 'content', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleCreateSequence} className="bg-purple-600 hover:bg-purple-700">
                <Send className="h-4 w-4 mr-2" />
                Create Sequence
              </Button>
              <Button variant="outline" onClick={() => setIsCreatingSequence(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
