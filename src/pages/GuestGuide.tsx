import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MapPin, ExternalLink, Star, DollarSign, Calendar, Home, ShoppingBag, Wifi, Clock, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Guidebook = Tables<"guidebooks">;
type GuidebookSection = Tables<"guidebook_sections">;
type GuidebookCard = Tables<"guidebook_cards">;

interface SectionWithCards extends GuidebookSection {
  cards: GuidebookCard[];
}

const GuestGuide = () => {
  const { slug } = useParams<{ slug: string }>();
  const [guidebook, setGuidebook] = useState<Guidebook | null>(null);
  const [sections, setSections] = useState<SectionWithCards[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (slug) {
      fetchGuidebook();
    }
  }, [slug]);

  const fetchGuidebook = async () => {
    try {
      // Fetch guidebook
      const { data: guidebookData, error: guidebookError } = await supabase
        .from("guidebooks")
        .select("*")
        .eq("guest_link_slug", slug)
        .eq("is_published", true)
        .eq("is_active", true)
        .single();

      if (guidebookError) throw guidebookError;
      setGuidebook(guidebookData);

      // Fetch sections with cards
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("guidebook_sections")
        .select(`
          *,
          cards:guidebook_cards(*)
        `)
        .eq("guidebook_id", guidebookData.id)
        .order("display_order", { ascending: true });

      if (sectionsError) throw sectionsError;

      // Sort cards within each section
      const sectionsWithSortedCards = sectionsData.map(section => ({
        ...section,
        cards: (section.cards || []).sort((a, b) => a.display_order - b.display_order)
      }));

      setSections(sectionsWithSortedCards);

      // Set initially expanded sections
      const initiallyExpanded = new Set<string>();
      sectionsWithSortedCards.forEach(section => {
        if (section.is_expanded_default) {
          initiallyExpanded.add(section.id);
        }
      });
      setExpandedSections(initiallyExpanded);

    } catch (error) {
      console.error("Error fetching guidebook:", error);
      toast({
        title: "Error",
        description: "Failed to load guidebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'map-pin': MapPin,
      'home': Home,
      'star': Star,
      'shopping-bag': ShoppingBag,
      'calendar': Calendar,
      'wifi': Wifi,
      'clock': Clock,
      'phone': Phone
    };
    return iconMap[iconName] || Home;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handleCardAction = (card: GuidebookCard) => {
    if (card.card_subtype === 'upsell' && card.price_cents) {
      // Handle upsell payment
      toast({
        title: "Feature Coming Soon",
        description: "Stripe integration for upsells will be available soon!",
      });
    } else if (card.external_url) {
      window.open(card.external_url, '_blank');
    } else if (card.card_subtype === 'recommendation' && card.location_address) {
      // Open in maps
      const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(card.location_address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const renderVideoEmbed = (card: GuidebookCard) => {
    if (!card.video_url) return null;

    if (card.video_type === 'youtube') {
      const videoId = card.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        return (
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-3">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
              title={card.title || 'Video'}
            />
          </div>
        );
      }
    }

    return (
      <div className="w-full aspect-video rounded-lg overflow-hidden mb-3">
        <video 
          src={card.video_url} 
          controls 
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guidebook...</p>
        </div>
      </div>
    );
  }

  if (!guidebook) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Guidebook Not Found</h1>
          <p className="text-muted-foreground">
            This guidebook may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          {guidebook.cover_photo_url && (
            <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img 
                src={guidebook.cover_photo_url} 
                alt={guidebook.property_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {guidebook.property_name}
            </h1>
            {guidebook.property_address && (
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mb-4">
                <MapPin className="h-4 w-4" />
                {guidebook.property_address}
              </p>
            )}
            {guidebook.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">
                {guidebook.description}
              </p>
            )}
            
            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
              {guidebook.check_in_time && (
                <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Check-in: {guidebook.check_in_time}</span>
                </div>
              )}
              {guidebook.check_out_time && (
                <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Check-out: {guidebook.check_out_time}</span>
                </div>
              )}
              {guidebook.wifi_name && (
                <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm">Wi-Fi: {guidebook.wifi_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {sections.map((section) => {
            const IconComponent = getIconComponent(section.icon || 'home');
            const isExpanded = expandedSections.has(section.id);

            return (
              <Card key={section.id} className="w-full">
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-left">{section.title}</CardTitle>
                            {section.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {section.description}
                              </p>
                            )}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {section.cards.map((card) => (
                          <Card key={card.id} className="border-l-4 border-l-primary/20">
                            <CardContent className="pt-4">
                              {card.media_url && (
                                <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                                  <img 
                                    src={card.media_url} 
                                    alt={card.title || 'Card image'}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {renderVideoEmbed(card)}

                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    {card.title}
                                    {card.category && (
                                      <Badge variant="secondary" className="text-xs">
                                        {card.category}
                                      </Badge>
                                    )}
                                    {card.rating && (
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-muted-foreground">
                                          {card.rating}
                                        </span>
                                      </div>
                                    )}
                                  </h4>
                                  {card.content && (
                                    <p className="text-muted-foreground text-sm mb-3 whitespace-pre-line">
                                      {card.content}
                                    </p>
                                  )}
                                  {card.location_distance && (
                                    <p className="text-xs text-muted-foreground mb-3">
                                      📍 {card.location_distance}
                                    </p>
                                  )}
                                </div>
                                {card.price_cents && (
                                  <div className="text-right">
                                    <p className="font-bold text-primary text-lg">
                                      {formatPrice(card.price_cents)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {card.button_text && (
                                <Button 
                                  onClick={() => handleCardAction(card)}
                                  className={`w-full ${
                                    card.card_subtype === 'upsell' 
                                      ? 'bg-primary hover:bg-primary/90' 
                                      : 'bg-secondary hover:bg-secondary/90'
                                  }`}
                                >
                                  {card.card_subtype === 'upsell' && <DollarSign className="h-4 w-4 mr-2" />}
                                  {card.card_subtype === 'recommendation' && <ExternalLink className="h-4 w-4 mr-2" />}
                                  {card.button_text}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-muted-foreground text-sm">
            Powered by Rentalizer Guidebooks
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestGuide;