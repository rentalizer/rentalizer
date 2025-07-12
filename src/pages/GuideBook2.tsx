import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen, Edit, Share2, Eye, Settings, Trash2, BarChart3, ExternalLink, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Guidebook = Tables<"guidebooks">;

const GuideBook2 = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [guidebooks, setGuidebooks] = useState<Guidebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGuidebook, setNewGuidebook] = useState({
    property_name: "",
    property_address: "",
    description: "",
    cover_photo_url: "",
    property_type: "apartment",
    check_in_time: "15:00",
    check_out_time: "11:00",
    wifi_name: "",
    wifi_password: ""
  });

  useEffect(() => {
    if (user) {
      fetchGuidebooks();
    }
  }, [user]);

  const fetchGuidebooks = async () => {
    try {
      const { data, error } = await supabase
        .from("guidebooks")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setGuidebooks(data || []);
    } catch (error) {
      console.error("Error fetching guidebooks:", error);
      toast({
        title: "Error",
        description: "Failed to load guidebooks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSectionsAndCards = async (guidebookId: string) => {
    const defaultSections = [
      {
        title: "Arrival Info",
        description: "Everything your guests need for check-in",
        icon: "map-pin",
        display_order: 0,
        is_expanded_default: true,
        cards: [
          { title: "Check-In Instructions", description: "Step-by-step check-in process", card_type: "text", card_subtype: "info" },
          { title: "Directions to Property", description: "Getting here from the airport or main roads", card_type: "text", card_subtype: "info" },
          { title: "Parking Information", description: "Where to park and any parking restrictions", card_type: "text", card_subtype: "info" },
          { title: "Wi-Fi Access", description: `Network: ${newGuidebook.wifi_name || '[Add Wi-Fi Name]'}\nPassword: ${newGuidebook.wifi_password || '[Add Password]'}`, card_type: "text", card_subtype: "info" },
          { title: "Keyless Entry", description: "Smart lock instructions and backup key location", card_type: "text", card_subtype: "info" }
        ]
      },
      {
        title: "House Manual",
        description: "Important rules and how things work",
        icon: "home",
        display_order: 1,
        is_expanded_default: false,
        cards: [
          { title: "House Rules", description: "Important guidelines for your stay", card_type: "text", card_subtype: "info" },
          { title: "Trash & Recycling", description: "Collection days and sorting instructions", card_type: "text", card_subtype: "info" },
          { title: "Thermostat", description: "How to adjust temperature and optimal settings", card_type: "text", card_subtype: "info" },
          { title: "Smart TV & Streaming", description: "How to use the TV and access streaming services", card_type: "text", card_subtype: "info" },
          { title: "Kitchen Appliances", description: "Instructions for dishwasher, coffee maker, and other appliances", card_type: "text", card_subtype: "info" },
          { title: "Washer & Dryer", description: "Laundry instructions and detergent location", card_type: "text", card_subtype: "info" }
        ]
      },
      {
        title: "Local Recommendations",
        description: "The best spots recommended by your host",
        icon: "star",
        display_order: 2,
        is_expanded_default: false,
        cards: [
          { title: "Best Coffee Shop", description: "Our favorite local coffee spot - try the signature blend!", card_type: "text", card_subtype: "recommendation", category: "coffee", button_text: "Get Directions" },
          { title: "Top Restaurant", description: "Must-try restaurant within walking distance", card_type: "text", card_subtype: "recommendation", category: "restaurant", button_text: "View Menu" },
          { title: "Nearby Park", description: "Perfect for morning walks or evening relaxation", card_type: "text", card_subtype: "recommendation", category: "attraction", button_text: "Get Directions" }
        ]
      },
      {
        title: "Marketplace",
        description: "Enhance your stay with these optional services",
        icon: "shopping-bag",
        display_order: 3,
        is_expanded_default: false,
        cards: [
          { title: "Early Check-In", description: "Arrive before 3 PM for an additional fee", card_type: "text", card_subtype: "upsell", price_cents: 2500, button_text: "Book Now", button_color: "primary" },
          { title: "Late Check-Out", description: "Stay until 2 PM instead of 11 AM", card_type: "text", card_subtype: "upsell", price_cents: 2000, button_text: "Book Now", button_color: "primary" },
          { title: "Mid-Stay Cleaning", description: "Professional cleaning service during your stay", card_type: "text", card_subtype: "upsell", price_cents: 7500, button_text: "Book Now", button_color: "primary" }
        ]
      },
      {
        title: "Book Again",
        description: "Planning another trip?",
        icon: "calendar",
        display_order: 4,
        is_expanded_default: false,
        cards: [
          { title: "Book This Property Again", description: "Love this place? Book your next stay!", card_type: "text", card_subtype: "booking", button_text: "Book Again", button_color: "secondary" },
          { title: "Our Other Properties", description: "Check out our other amazing locations", card_type: "text", card_subtype: "booking", button_text: "View Properties", button_color: "secondary" }
        ]
      }
    ];

    for (const section of defaultSections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from("guidebook_sections")
        .insert({
          guidebook_id: guidebookId,
          title: section.title,
          description: section.description,
          icon: section.icon,
          display_order: section.display_order,
          is_expanded_default: section.is_expanded_default
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      const cards = section.cards.map((card, index) => ({
        section_id: sectionData.id,
        title: card.title,
        content: card.description,
        card_type: card.card_type,
        card_subtype: card.card_subtype,
        category: card.category || null,
        price_cents: card.price_cents || null,
        button_text: card.button_text || null,
        button_color: card.button_color || null,
        display_order: index
      }));

      const { error: cardsError } = await supabase
        .from("guidebook_cards")
        .insert(cards);

      if (cardsError) throw cardsError;
    }
  };

  const createGuidebook = async () => {
    if (!newGuidebook.property_name.trim()) {
      toast({
        title: "Error",
        description: "Property name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const guestSlug = `guide-${Date.now().toString(36)}`;
      
      const { data, error } = await supabase
        .from("guidebooks")
        .insert({
          user_id: user?.id,
          property_name: newGuidebook.property_name,
          property_address: newGuidebook.property_address,
          description: newGuidebook.description,
          cover_photo_url: newGuidebook.cover_photo_url,
          property_type: newGuidebook.property_type,
          check_in_time: newGuidebook.check_in_time,
          check_out_time: newGuidebook.check_out_time,
          wifi_name: newGuidebook.wifi_name,
          wifi_password: newGuidebook.wifi_password,
          guest_link_slug: guestSlug,
          is_published: false,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Create default sections and cards
      await createDefaultSectionsAndCards(data.id);

      setGuidebooks([data, ...guidebooks]);
      setIsCreateDialogOpen(false);
      setNewGuidebook({
        property_name: "",
        property_address: "",
        description: "",
        cover_photo_url: "",
        property_type: "apartment",
        check_in_time: "15:00",
        check_out_time: "11:00",
        wifi_name: "",
        wifi_password: ""
      });

      toast({
        title: "Success",
        description: "Guidebook created with default sections!",
      });
    } catch (error) {
      console.error("Error creating guidebook:", error);
      toast({
        title: "Error",
        description: "Failed to create guidebook",
        variant: "destructive",
      });
    }
  };

  const copyGuestLink = async (guidebook: Guidebook) => {
    if (!guidebook.guest_link_slug) return;
    
    const guestUrl = `${window.location.origin}/guide/${guidebook.guest_link_slug}`;
    
    try {
      await navigator.clipboard.writeText(guestUrl);
      toast({
        title: "Link Copied!",
        description: "Guest link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const openGuestView = (guidebook: Guidebook) => {
    if (!guidebook.guest_link_slug) return;
    
    const guestUrl = `${window.location.origin}/guide/${guidebook.guest_link_slug}`;
    window.open(guestUrl, '_blank');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your guidebooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                Guidebook Builder
              </h1>
              <p className="text-muted-foreground mt-1">
                Create beautiful, mobile-friendly guidebooks for your guests
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guidebook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Guidebook</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="property_name">Property Name *</Label>
                    <Input
                      id="property_name"
                      value={newGuidebook.property_name}
                      onChange={(e) => setNewGuidebook({...newGuidebook, property_name: e.target.value})}
                      placeholder="e.g., Cozy Downtown Apartment"
                    />
                  </div>
                  <div>
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select value={newGuidebook.property_type} onValueChange={(value) => setNewGuidebook({...newGuidebook, property_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="property_address">Property Address</Label>
                    <Input
                      id="property_address"
                      value={newGuidebook.property_address}
                      onChange={(e) => setNewGuidebook({...newGuidebook, property_address: e.target.value})}
                      placeholder="e.g., 123 Main St, City, State"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="check_in_time">Check-In Time</Label>
                      <Input
                        id="check_in_time"
                        type="time"
                        value={newGuidebook.check_in_time}
                        onChange={(e) => setNewGuidebook({...newGuidebook, check_in_time: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="check_out_time">Check-Out Time</Label>
                      <Input
                        id="check_out_time"
                        type="time"
                        value={newGuidebook.check_out_time}
                        onChange={(e) => setNewGuidebook({...newGuidebook, check_out_time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wifi_name">Wi-Fi Network Name</Label>
                      <Input
                        id="wifi_name"
                        value={newGuidebook.wifi_name}
                        onChange={(e) => setNewGuidebook({...newGuidebook, wifi_name: e.target.value})}
                        placeholder="Network name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wifi_password">Wi-Fi Password</Label>
                      <Input
                        id="wifi_password"
                        value={newGuidebook.wifi_password}
                        onChange={(e) => setNewGuidebook({...newGuidebook, wifi_password: e.target.value})}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newGuidebook.description}
                      onChange={(e) => setNewGuidebook({...newGuidebook, description: e.target.value})}
                      placeholder="Brief description of your property..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cover_photo">Cover Photo URL</Label>
                    <Input
                      id="cover_photo"
                      value={newGuidebook.cover_photo_url}
                      onChange={(e) => setNewGuidebook({...newGuidebook, cover_photo_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  <Button onClick={createGuidebook} className="w-full">
                    Create Guidebook
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {guidebooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">Create Your First Guidebook</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Build a beautiful, mobile-friendly guidebook that your guests will love. Include arrival info, house rules, local recommendations, and upsells.
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Guidebook
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidebooks.map((guidebook) => (
              <Card key={guidebook.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  {guidebook.cover_photo_url && (
                    <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={guidebook.cover_photo_url} 
                        alt={guidebook.property_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                              Image failed to load
                            </div>
                          `;
                        }}
                      />
                    </div>
                  )}
                  <CardTitle className="text-lg">{guidebook.property_name}</CardTitle>
                  {guidebook.property_address && (
                    <p className="text-sm text-muted-foreground">{guidebook.property_address}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guidebook.is_published 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {guidebook.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {guidebook.property_type || 'Property'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {guidebook.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {guidebook.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openGuestView(guidebook)}
                      disabled={!guidebook.guest_link_slug}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyGuestLink(guidebook)}
                      disabled={!guidebook.guest_link_slug}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideBook2;