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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Plus, 
  Settings, 
  Eye, 
  Share2, 
  BarChart3,
  Edit3,
  Trash2,
  Copy,
  MapPin,
  Home,
  Star,
  ShoppingBag,
  Calendar,
  ExternalLink,
  ImageIcon,
  Video,
  DollarSign,
  Clock,
  Wifi,
  Car,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Guidebook = Tables<"guidebooks">;
type GuidebookSection = Tables<"guidebook_sections">;
type GuidebookCard = Tables<"guidebook_cards">;

interface GuidebookWithSections extends Guidebook {
  sections?: (GuidebookSection & {
    cards?: GuidebookCard[];
  })[];
}

const GuideBook2 = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [guidebooks, setGuidebooks] = useState<GuidebookWithSections[]>([]);
  const [selectedGuidebook, setSelectedGuidebook] = useState<GuidebookWithSections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [newGuidebook, setNewGuidebook] = useState({
    property_name: "",
    property_address: "",
    description: "",
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
        .select(`
          *,
          guidebook_sections (
            *,
            guidebook_cards (*)
          )
        `)
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setGuidebooks(data || []);
      if (data && data.length > 0 && !selectedGuidebook) {
        setSelectedGuidebook(data[0]);
      }
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
          { 
            title: "Check-In Instructions", 
            content: "Welcome! Your check-in process is simple:\n\n1. Arrive anytime after 3:00 PM\n2. Use the keypad code: [ADD CODE]\n3. Find your keys in the lockbox\n4. Welcome package is on the kitchen counter\n\nIf you have any issues, please call or text: [YOUR PHONE]",
            card_type: "text"
          },
          { 
            title: "Getting Here", 
            content: "📍 Address: [YOUR ADDRESS]\n\n🚗 From Airport: Take I-95 North, exit 42\n🚌 Public Transit: Blue Line to Downtown Station\n🚶‍♂️ Walking from train: 5 minutes\n\nParking: Street parking is free after 6 PM and on weekends. There's a paid lot across the street for $10/day.",
            card_type: "text"
          },
          { 
            title: "Wi-Fi & Connectivity", 
            content: `📶 Wi-Fi Network: ${newGuidebook.wifi_name || '[ADD NETWORK NAME]'}\n🔐 Password: ${newGuidebook.wifi_password || '[ADD PASSWORD]'}\n\n📺 Smart TV has Netflix, Hulu, Disney+ already logged in\n💻 Work desk with monitor in the bedroom\n🔌 USB charging stations by each bed`,
            card_type: "text"
          }
        ]
      },
      {
        title: "House Manual",
        description: "Important rules and how things work",
        icon: "home",
        display_order: 1,
        is_expanded_default: false,
        cards: [
          { 
            title: "House Rules & Guidelines", 
            content: "🏠 This is your home away from home! Please:\n\n✅ No smoking inside (balcony is OK)\n✅ Keep noise down after 10 PM\n✅ No parties or events\n✅ Maximum 4 guests\n✅ Check out by 11 AM\n\n🧽 Cleaning fee covers deep cleaning, but please:\n- Wash your dishes\n- Take out trash\n- Don't leave food in the fridge",
            card_type: "text"
          },
          { 
            title: "Appliances & Systems", 
            content: "🌡️ **Thermostat**: Digital panel by the front door. Set between 68-72°F\n\n📺 **TV**: Voice remote - just say 'Netflix' or 'YouTube'\n\n☕ **Coffee Maker**: Keurig on the counter. K-cups in the pantry!\n\n🧺 **Washer/Dryer**: In the closet. Detergent provided.\n\n🍽️ **Dishwasher**: Add soap tablet, press 'Normal Wash'",
            card_type: "text"
          },
          { 
            title: "Emergency & Safety", 
            content: "🚨 **Emergency**: Call 911\n📞 **Host**: [YOUR PHONE NUMBER]\n🏥 **Hospital**: General Hospital (0.5 miles)\n\n🔥 **Fire Extinguisher**: Under kitchen sink\n💨 **Smoke Alarms**: Fresh batteries, test monthly\n🚪 **Emergency Exit**: Front door & bedroom window\n\n⚡ **Circuit Breaker**: In the hallway closet",
            card_type: "text"
          }
        ]
      },
      {
        title: "Local Recommendations",
        description: "Discover the best of our neighborhood",
        icon: "star",
        display_order: 2,
        is_expanded_default: false,
        cards: [
          { 
            title: "Best Coffee Spots ☕", 
            content: "**Brew & Bean** (2 blocks)\nAmazing pastries, great for working\n⭐ Try the maple latte!\n\n**Corner Café** (5 min walk)\nQuiet spot, perfect for morning reading\n⭐ Best croissants in town!",
            card_type: "recommendation",
            category: "coffee",
            button_text: "Get Directions",
            location_distance: "2 blocks"
          },
          { 
            title: "Must-Try Restaurants 🍽️", 
            content: "**The Garden Bistro** (3 blocks)\nFarm-to-table, romantic atmosphere\n💰 $$$ | ⭐ 4.8/5\n⭐ Make reservations!\n\n**Tony's Pizza** (1 block)\nBest slice in the city, open late\n💰 $ | ⭐ 4.6/5\n⭐ Try the margherita!",
            card_type: "recommendation",
            category: "restaurant",
            button_text: "View Menu",
            location_distance: "1-3 blocks"
          },
          { 
            title: "Things to Do 🎯", 
            content: "**Riverside Park** (10 min walk)\nBeautiful trails, perfect for jogging\n🕐 Open 6 AM - 10 PM\n\n**Art District** (15 min walk)\nGalleries, street art, weekend markets\n🎨 Free admission\n\n**Harbor Tours** (20 min drive)\nBoat tours of the bay\n💰 $25/person",
            card_type: "recommendation",
            category: "attraction",
            button_text: "Learn More",
            location_distance: "10-20 min"
          }
        ]
      },
      {
        title: "Marketplace",
        description: "Enhance your stay with premium services",
        icon: "shopping-bag",
        display_order: 3,
        is_expanded_default: false,
        cards: [
          { 
            title: "Early Check-In", 
            content: "Arrive before 3 PM and start your vacation early! Subject to availability - we'll confirm 24 hours before your arrival.\n\n✅ Arrive anytime after 12 PM\n✅ Perfect for early flights\n✅ Same-day confirmation",
            card_type: "text",
            card_subtype: "upsell",
            price_cents: 3500,
            currency: "usd",
            button_text: "Add to Stay",
            button_color: "primary"
          },
          { 
            title: "Late Check-Out", 
            content: "Extend your stay until 2 PM instead of 11 AM. Perfect for late flights or extra relaxation time.\n\n✅ Check out at 2 PM\n✅ No rush on your last day\n✅ Subject to availability",
            card_type: "text",
            card_subtype: "upsell",
            price_cents: 2500,
            currency: "usd",
            button_text: "Add to Stay",
            button_color: "primary"
          },
          { 
            title: "Airport Pickup Service", 
            content: "Skip the taxi and ride in comfort! Our partner driver will pick you up in a luxury sedan.\n\n✅ Professional driver\n✅ Flight tracking\n✅ Meet & greet service\n✅ 30 min wait time included",
            card_type: "text",
            card_subtype: "upsell",
            price_cents: 8500,
            currency: "usd",
            button_text: "Book Now",
            button_color: "primary"
          }
        ]
      },
      {
        title: "Book Again",
        description: "Love this place? Stay connected!",
        icon: "calendar",
        display_order: 4,
        is_expanded_default: false,
        cards: [
          { 
            title: "Book This Property Again", 
            content: "Had an amazing stay? Book your next visit and get 10% off your second booking!\n\n🎯 10% returning guest discount\n📅 Priority booking for popular dates\n💬 Direct line to your host",
            card_type: "text",
            card_subtype: "booking",
            button_text: "Book Again",
            button_color: "secondary",
            external_url: "https://airbnb.com/your-listing"
          },
          { 
            title: "Our Other Properties", 
            content: "Check out our other amazing locations! We have properties in Miami, New York, and Los Angeles.\n\n🏖️ Miami Beach Condo\n🗽 NYC Manhattan Loft\n🌴 LA Hollywood Hills Villa",
            card_type: "text",
            card_subtype: "booking",
            button_text: "View Properties",
            button_color: "secondary",
            external_url: "https://airbnb.com/host-profile"
          }
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
        content: card.content,
        card_type: card.card_type,
        card_subtype: card.card_subtype || null,
        category: card.category || null,
        price_cents: card.price_cents || null,
        currency: card.currency || null,
        button_text: card.button_text || null,
        button_color: card.button_color || null,
        external_url: card.external_url || null,
        location_distance: card.location_distance || null,
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
      const guestSlug = `guide-${Date.now().toString(36)}-${newGuidebook.property_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      
      const { data, error } = await supabase
        .from("guidebooks")
        .insert({
          user_id: user?.id,
          property_name: newGuidebook.property_name,
          property_address: newGuidebook.property_address,
          description: newGuidebook.description,
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

      await createDefaultSectionsAndCards(data.id);
      await fetchGuidebooks();
      setSelectedGuidebook(data);
      setIsCreateDialogOpen(false);
      setNewGuidebook({
        property_name: "",
        property_address: "",
        description: "",
        property_type: "apartment",
        check_in_time: "15:00",
        check_out_time: "11:00",
        wifi_name: "",
        wifi_password: ""
      });

      toast({
        title: "Guidebook Created! 🎉",
        description: "Your guidebook is ready with default sections. Start customizing!",
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
        title: "Link Copied! 📋",
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

  const togglePublishGuidebook = async (guidebook: Guidebook) => {
    try {
      const { error } = await supabase
        .from("guidebooks")
        .update({ is_published: !guidebook.is_published })
        .eq("id", guidebook.id);

      if (error) throw error;

      await fetchGuidebooks();
      toast({
        title: guidebook.is_published ? "Guidebook Unpublished" : "Guidebook Published! 🚀",
        description: guidebook.is_published 
          ? "Your guidebook is now private" 
          : "Your guests can now access your guidebook",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guidebook",
        variant: "destructive",
      });
    }
  };

  const getSectionIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      "map-pin": MapPin,
      "home": Home,
      "star": Star,
      "shopping-bag": ShoppingBag,
      "calendar": Calendar
    };
    return iconMap[iconName] || Home;
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Loading Guidebook Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Guidebook Builder</h1>
                  <p className="text-sm text-muted-foreground">Create stunning guest experiences</p>
                </div>
              </div>
              
              {guidebooks.length > 0 && (
                <div className="flex items-center gap-2 ml-8">
                  <Select 
                    value={selectedGuidebook?.id || ""} 
                    onValueChange={(value) => {
                      const guidebook = guidebooks.find(g => g.id === value);
                      setSelectedGuidebook(guidebook || null);
                    }}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select a guidebook" />
                    </SelectTrigger>
                    <SelectContent>
                      {guidebooks.map((guidebook) => (
                        <SelectItem key={guidebook.id} value={guidebook.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${guidebook.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            {guidebook.property_name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {selectedGuidebook && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyGuestLink(selectedGuidebook)}
                    className="hidden sm:flex"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedGuidebook.guest_link_slug) {
                        window.open(`/guide/${selectedGuidebook.guest_link_slug}`, '_blank');
                      }
                    }}
                    className="hidden sm:flex"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={selectedGuidebook.is_published ? "destructive" : "default"}
                    size="sm"
                    onClick={() => togglePublishGuidebook(selectedGuidebook)}
                  >
                    {selectedGuidebook.is_published ? "Unpublish" : "Publish"}
                  </Button>
                </>
              )}
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Plus className="h-4 w-4 mr-2" />
                    New Guidebook
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Create New Guidebook</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="property_name">Property Name *</Label>
                        <Input
                          id="property_name"
                          value={newGuidebook.property_name}
                          onChange={(e) => setNewGuidebook({...newGuidebook, property_name: e.target.value})}
                          placeholder="Downtown Luxury Apartment"
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
                          placeholder="123 Main St, City, State"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="check_in_time">Check-In</Label>
                          <Input
                            id="check_in_time"
                            type="time"
                            value={newGuidebook.check_in_time}
                            onChange={(e) => setNewGuidebook({...newGuidebook, check_in_time: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="check_out_time">Check-Out</Label>
                          <Input
                            id="check_out_time"
                            type="time"
                            value={newGuidebook.check_out_time}
                            onChange={(e) => setNewGuidebook({...newGuidebook, check_out_time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="wifi_name">Wi-Fi Name</Label>
                          <Input
                            id="wifi_name"
                            value={newGuidebook.wifi_name}
                            onChange={(e) => setNewGuidebook({...newGuidebook, wifi_name: e.target.value})}
                            placeholder="MyWiFi"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wifi_password">Wi-Fi Password</Label>
                          <Input
                            id="wifi_password"
                            value={newGuidebook.wifi_password}
                            onChange={(e) => setNewGuidebook({...newGuidebook, wifi_password: e.target.value})}
                            placeholder="password123"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newGuidebook.description}
                          onChange={(e) => setNewGuidebook({...newGuidebook, description: e.target.value})}
                          placeholder="A beautiful space in the heart of downtown..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={createGuidebook} className="w-full mt-6">
                    Create Guidebook & Generate Default Content
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {guidebooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Guidebook Builder</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create professional, mobile-optimized guidebooks that wow your guests. Include arrival instructions, 
              house rules, local recommendations, upsells, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="text-center p-6">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Arrival Info</h3>
                <p className="text-sm text-muted-foreground">Check-in instructions, directions, parking, and Wi-Fi details</p>
              </Card>
              <Card className="text-center p-6">
                <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Local Recommendations</h3>
                <p className="text-sm text-muted-foreground">Curated suggestions for restaurants, attractions, and hidden gems</p>
              </Card>
              <Card className="text-center p-6">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Revenue Upsells</h3>
                <p className="text-sm text-muted-foreground">Early check-in, late checkout, and premium services</p>
              </Card>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Guidebook
            </Button>
          </div>
        ) : selectedGuidebook ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Guidebook Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedGuidebook.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <CardTitle className="text-lg">{selectedGuidebook.property_name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">{selectedGuidebook.property_type}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Check-in: {selectedGuidebook.check_in_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Check-out: {selectedGuidebook.check_out_time}</span>
                    </div>
                    {selectedGuidebook.wifi_name && (
                      <div className="flex items-center gap-2 text-sm">
                        <Wifi className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGuidebook.wifi_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyGuestLink(selectedGuidebook)}
                      className="w-full justify-start"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Guest Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedGuidebook.guest_link_slug) {
                          window.open(`/guide/${selectedGuidebook.guest_link_slug}`, '_blank');
                        }
                      }}
                      className="w-full justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Badge variant={selectedGuidebook.is_published ? "default" : "secondary"} className="w-full justify-center">
                      {selectedGuidebook.is_published ? "🌐 Published" : "📝 Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Guidebook Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedGuidebook.sections?.length || 0}
                          </div>
                          <p className="text-sm text-muted-foreground">Sections</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            {selectedGuidebook.sections?.reduce((acc, section) => acc + (section.cards?.length || 0), 0) || 0}
                          </div>
                          <p className="text-sm text-muted-foreground">Cards</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedGuidebook.sections?.flatMap(s => s.cards || []).filter(c => c.card_subtype === 'upsell').length || 0}
                          </div>
                          <p className="text-sm text-muted-foreground">Upsells</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4">
                    {selectedGuidebook.sections?.sort((a, b) => a.display_order - b.display_order).map((section) => {
                      const IconComponent = getSectionIcon(section.icon || "home");
                      return (
                        <Card key={section.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <IconComponent className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{section.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground">{section.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {section.cards?.length || 0} cards
                              </Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Manage Sections & Cards</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                  
                  {selectedGuidebook.sections?.sort((a, b) => a.display_order - b.display_order).map((section) => {
                    const IconComponent = getSectionIcon(section.icon || "home");
                    return (
                      <Card key={section.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-5 w-5 text-primary" />
                              <div>
                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-3">
                            {section.cards?.sort((a, b) => a.display_order - b.display_order).map((card) => (
                              <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    {card.card_type === 'recommendation' && <Star className="h-4 w-4 text-yellow-500" />}
                                    {card.card_subtype === 'upsell' && <DollarSign className="h-4 w-4 text-green-500" />}
                                    {card.media_url && <ImageIcon className="h-4 w-4 text-blue-500" />}
                                    {card.video_url && <Video className="h-4 w-4 text-purple-500" />}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{card.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {card.content?.substring(0, 60)}...
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {card.price_cents && (
                                    <Badge variant="secondary">
                                      ${(card.price_cents / 100).toFixed(2)}
                                    </Badge>
                                  )}
                                  <Button variant="outline" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guidebook Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Property Name</Label>
                          <Input defaultValue={selectedGuidebook.property_name} />
                        </div>
                        <div>
                          <Label>Property Type</Label>
                          <Select defaultValue={selectedGuidebook.property_type || ""}>
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
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Analytics Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                        <p className="text-muted-foreground">
                          Track guest engagement, popular sections, and conversion rates.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GuideBook2;