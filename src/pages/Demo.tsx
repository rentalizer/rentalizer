
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Demo = () => {
  console.log('Demo component is rendering');
  const navigate = useNavigate();

  console.log('Demo component navigate function:', navigate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {console.log('Demo component main div rendering')}
      
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => {
                console.log('Back button clicked');
                navigate('/');
              }}
              className="mb-8 text-cyan-300 hover:text-cyan-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center justify-center gap-4 mb-6">
              <BarChart3 className="h-12 w-12 text-cyan-400" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                RENTALIZER DEMO
              </h1>
            </div>
            <p className="text-lg text-cyan-300/80 font-medium mb-8">By Richie Matthews</p>
            <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Book a personalized demo to see how Rentalizer can help you earn rental income without a mortgage
            </p>
          </div>

          {/* Calendly Embed */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-cyan-500/20 backdrop-blur-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-cyan-300 flex items-center justify-center gap-3">
                  <Calendar className="h-8 w-8" />
                  Schedule Your Demo Call
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[700px] w-full">
                  {console.log('About to render Calendly iframe')}
                  <iframe
                    src="https://calendly.com/richies-schedule/scale"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Schedule Demo Call"
                    className="rounded-b-lg"
                    onLoad={() => console.log('Calendly iframe loaded successfully')}
                    onError={(e) => console.error('Calendly iframe error:', e)}
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
