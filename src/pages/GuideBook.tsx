import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Share2, 
  Eye, 
  Settings, 
  Trash2, 
  BarChart3,
  QrCode,
  Copy,
  Globe,
  MapPin,
  Home,
  Users,
  Phone,
  Clock,
  Wifi,
  Car,
  Camera,
  Video,
  FileText,
  Star,
  Heart,
  Coffee,
  Utensils,
  ShoppingBag,
  Map,
  Search,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  Upload,
  Languages,
  Zap,
  MessageCircle,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Guidebook = Tables<"guidebooks">;
type GuidebookSection = Tables<"guidebook_sections">;
type GuidebookCard = Tables<"guidebook_cards">;

interface GuidebookWithContent extends Guidebook {
  sections?: (GuidebookSection & {
    cards?: GuidebookCard[];
  })[];
}

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  content: string;
  cardType: string;
  tags: string[];
}

const contentTemplates: ContentTemplate[] = [
  {
    id: "welcome-intro",
    title: "Welcome Message",
    description: "Warm greeting and property introduction",
    icon: Heart,
    category: "welcome",
    content: "Welcome to [Property Name]! We're thrilled to have you as our guest. This guidebook contains everything you need for an amazing stay. Please don't hesitate to reach out if you have any questions. Enjoy your time here!",
    cardType: "text",
    tags: ["welcome", "introduction", "greeting"]
  },
  {
    id: "check-in-basic",
    title: "Check-in Instructions",
    description: "Basic check-in process and key information",
    icon: Home,
    category: "arrival",
    content: "🏠 **Check-in Time**: 3:00 PM onwards\n\n🔐 **Access Code**: [YOUR CODE]\n📍 **Address**: [FULL ADDRESS]\n\n**Step-by-Step Check-in:**\n1. Arrive at the property\n2. Locate the smart lock/keypad\n3. Enter access code: [CODE]\n4. Welcome package inside on kitchen counter\n\nIf you have any issues, call/text: [PHONE]",
    cardType: "text",
    tags: ["check-in", "access", "arrival", "keys"]
  },
  {
    id: "house-rules-comprehensive",
    title: "House Rules & Policies",
    description: "Comprehensive house rules for guest behavior",
    icon: CheckCircle,
    category: "rules",
    content: "🏡 **House Rules**\n\n✅ **Allowed:**\n• Quiet enjoyment until 10 PM\n• Use of all provided amenities\n• Guests registered in booking\n• Smoking on balcony/patio only\n\n❌ **Not Allowed:**\n• Parties or loud gatherings\n• Smoking indoors\n• Pets (unless pre-approved)\n• Unregistered guests\n• Moving furniture\n\n**Respect our neighbors and keep noise down after 10 PM. Thank you!**",
    cardType: "text",
    tags: ["rules", "policies", "behavior", "restrictions"]
  },
  {
    id: "wifi-tech",
    title: "Wi-Fi & Technology",
    description: "Internet, TV, and technology instructions",
    icon: Wifi,
    category: "amenities",
    content: "📶 **Wi-Fi Network**: [NETWORK NAME]\n🔐 **Password**: [WIFI PASSWORD]\n\n📺 **Smart TV Instructions:**\n• Voice remote - say 'Netflix' or 'YouTube'\n• All major streaming apps pre-installed\n• Your accounts will remain private\n\n💻 **Work Setup:**\n• High-speed internet (100+ Mbps)\n• Dedicated work desk in [LOCATION]\n• External monitor available\n\n🔌 **Charging Stations:**\n• USB ports by each bed\n• Wireless charging pad on nightstand",
    cardType: "text",
    tags: ["wifi", "internet", "tv", "technology", "work"]
  },
  {
    id: "parking-transport",
    title: "Parking & Transportation",
    description: "Parking options and local transportation",
    icon: Car,
    category: "arrival",
    content: "🚗 **Parking Options:**\n\n**Free Street Parking:**\n• Available after 6 PM weekdays\n• Free all day weekends\n• 2-hour limit during business hours\n\n**Paid Options:**\n• Parking garage across street: $10/day\n• Metered spots: $2/hour (8 AM - 6 PM)\n\n🚌 **Public Transportation:**\n• Blue Line station: 5-minute walk\n• Bus stop #42: 2 blocks away\n• Ride-share pickup zone: Main entrance",
    cardType: "text",
    tags: ["parking", "transportation", "car", "public-transport"]
  },
  {
    id: "emergency-contacts",
    title: "Emergency & Important Contacts",
    description: "Emergency information and key contacts",
    icon: Phone,
    category: "safety",
    content: "🚨 **Emergency Services**: 911\n\n📞 **Your Host**: [PHONE NUMBER]\n💬 **Text preferred for non-emergencies**\n\n🏥 **Nearest Hospital**: \nGeneral Hospital - 0.5 miles\n123 Medical Ave\n\n🚓 **Police Department**:\nLocal PD - (555) 123-4567\n\n⚡ **Utilities Emergency**:\n• Power: (555) 111-1111\n• Gas: (555) 222-2222\n• Water: (555) 333-3333\n\n🔧 **Building Management**: (555) 444-4444",
    cardType: "text",
    tags: ["emergency", "contacts", "safety", "hospital", "police"]
  },
  {
    id: "appliances-guide",
    title: "Appliances & Systems",
    description: "How to use appliances and home systems",
    icon: Settings,
    category: "amenities",
    content: "🌡️ **Thermostat**: Digital panel by front door\n• Summer: 72-75°F recommended\n• Winter: 68-72°F recommended\n• Away mode: Press 'Away' button\n\n☕ **Coffee Station**:\n• Keurig machine with K-cups provided\n• French press available in cabinet\n• Coffee beans in freezer\n\n🧺 **Laundry**:\n• Washer/dryer in hall closet\n• Detergent pods provided\n• Dryer sheets in basket above\n\n🍽️ **Kitchen**:\n• Dishwasher: Add tablet, press 'Normal'\n• Microwave: Standard operation\n• Oven: Preheat using digital display",
    cardType: "text",
    tags: ["appliances", "thermostat", "coffee", "laundry", "kitchen"]
  },
  {
    id: "local-dining",
    title: "Best Local Restaurants",
    description: "Curated dining recommendations nearby",
    icon: Utensils,
    category: "recommendations",
    content: "🍽️ **Must-Try Restaurants**\n\n**The Garden Bistro** (3 blocks) ⭐⭐⭐⭐⭐\n• Farm-to-table, romantic atmosphere\n• Try: Seasonal tasting menu\n• Price: $$$ | Reservations recommended\n\n**Tony's Pizza** (1 block) ⭐⭐⭐⭐\n• Best slice in the city, open until 2 AM\n• Try: Margherita or pepperoni\n• Price: $ | No reservations needed\n\n**Café Luna** (2 blocks) ⭐⭐⭐⭐\n• Perfect for breakfast/brunch\n• Try: Avocado toast, cold brew\n• Price: $$ | Usually busy weekends",
    cardType: "recommendation",
    tags: ["restaurants", "dining", "food", "local", "recommendations"]
  },
  {
    id: "coffee-cafes",
    title: "Coffee Shops & Cafés",
    description: "Local coffee culture and working spots",
    icon: Coffee,
    category: "recommendations",
    content: "☕ **Best Coffee Spots**\n\n**Brew & Bean** (2 blocks) ⭐⭐⭐⭐⭐\n• Artisan roasters, amazing pastries\n• Perfect for laptop work\n• Try: Maple cortado, almond croissant\n• Hours: 6 AM - 8 PM\n\n**Corner Café** (5 min walk) ⭐⭐⭐⭐\n• Quiet, cozy atmosphere\n• Great for reading/meetings\n• Try: Pour-over coffee, homemade muffins\n• Hours: 7 AM - 6 PM\n\n**Express Coffee** (1 block)\n• Quick grab-and-go option\n• Drive-through available\n• Hours: 5:30 AM - 10 PM",
    cardType: "recommendation",
    tags: ["coffee", "cafes", "work", "wifi", "pastries"]
  },
  {
    id: "attractions-activities",
    title: "Attractions & Activities",
    description: "Things to do and places to visit",
    icon: Star,
    category: "recommendations",
    content: "🎯 **Top Attractions & Activities**\n\n**Riverside Park** (10 min walk) ⭐⭐⭐⭐⭐\n• Beautiful walking trails\n• Perfect for jogging or picnics\n• Free outdoor concerts Sundays\n• Open: 6 AM - 10 PM\n\n**Art District** (15 min walk) ⭐⭐⭐⭐\n• Local galleries and street art\n• Weekend farmers market\n• Free admission to most galleries\n• Best visited: Saturday afternoons\n\n**Harbor Tours** (20 min drive) ⭐⭐⭐⭐\n• Scenic boat tours of the bay\n• 1-hour or 3-hour options\n• Price: $25-$65 per person\n• Book online for discounts",
    cardType: "recommendation",
    tags: ["attractions", "activities", "entertainment", "sightseeing", "tours"]
  },
  {
    id: "shopping-groceries",
    title: "Shopping & Groceries",
    description: "Where to shop for essentials and more",
    icon: ShoppingBag,
    category: "recommendations",
    content: "🛒 **Shopping & Groceries**\n\n**Fresh Market** (3 blocks) ⭐⭐⭐⭐⭐\n• Full-service grocery store\n• Organic produce, deli counter\n• Open: 7 AM - 10 PM daily\n• Self-checkout available\n\n**Corner Store** (1 block) ⭐⭐⭐\n• Quick essentials, snacks, drinks\n• ATM inside\n• Open: 24/7\n\n**Downtown Mall** (10 min drive) ⭐⭐⭐⭐\n• Major retailers, food court\n• Target, Best Buy, clothing stores\n• Free parking for 3 hours\n\n**Farmers Market** (Saturdays) ⭐⭐⭐⭐⭐\n• Local produce, artisan goods\n• Main Square, 8 AM - 2 PM\n• Cash preferred, some accept cards",
    cardType: "recommendation",
    tags: ["shopping", "groceries", "market", "essentials", "mall"]
  },
  {
    id: "checkout-procedures",
    title: "Check-out Instructions",
    description: "Step-by-step checkout process",
    icon: Clock,
    category: "departure",
    content: "⏰ **Check-out Time**: 11:00 AM\n\n✅ **Before You Leave:**\n\n**Kitchen:**\n• Wash and put away dishes\n• Wipe down counters\n• Empty dishwasher if running\n\n**General:**\n• Take out trash to bins outside\n• Turn off all lights and electronics\n• Ensure windows/doors are locked\n• Set thermostat to 'Away' mode\n\n**Personal Items:**\n• Check all rooms for belongings\n• Look under beds and in bathrooms\n• Check electrical outlets for chargers\n\n**Keys:**\n• Leave keys on kitchen counter\n• Close door firmly - it auto-locks\n\n**Thank you for being a wonderful guest! ⭐**",
    cardType: "text",
    tags: ["checkout", "departure", "cleaning", "instructions"]
  },
  {
    id: "faq-troubleshooting",
    title: "FAQs & Troubleshooting",
    description: "Common questions and solutions",
    icon: MessageCircle,
    category: "help",
    content: "❓ **Frequently Asked Questions**\n\n**Q: Wi-Fi isn't working**\nA: Unplug router (black box by TV) for 30 seconds, plug back in. Wait 2 minutes.\n\n**Q: Can't figure out the TV**\nA: Press the Netflix button on remote or say 'Netflix' out loud.\n\n**Q: Thermostat won't change**\nA: Press 'Home' icon first, then adjust temperature.\n\n**Q: Shower has low pressure**\nA: Remove shower head and rinse - likely mineral buildup.\n\n**Q: Can't find extra towels**\nA: Hall closet, top shelf. Extra bedding there too.\n\n**Q: Garbage disposal isn't working**\nA: Reset button underneath sink. If still issues, text host.\n\n**Q: Smoke alarm beeping**\nA: Usually low battery. Text host immediately.",
    cardType: "text",
    tags: ["faq", "troubleshooting", "problems", "solutions", "help"]
  }
];

const sectionTemplates = [
  {
    id: "welcome",
    title: "Welcome & Introduction",
    description: "Welcome message and property overview",
    icon: Heart,
    defaultCards: ["welcome-intro"]
  },
  {
    id: "arrival",
    title: "Arrival & Check-in",
    description: "Check-in instructions, parking, and access information",
    icon: Home,
    defaultCards: ["check-in-basic", "parking-transport"]
  },
  {
    id: "rules",
    title: "House Rules & Policies",
    description: "Important rules and guidelines for the property",
    icon: CheckCircle,
    defaultCards: ["house-rules-comprehensive"]
  },
  {
    id: "amenities",
    title: "Amenities & Instructions",
    description: "How to use property features and amenities",
    icon: Settings,
    defaultCards: ["wifi-tech", "appliances-guide"]
  },
  {
    id: "safety",
    title: "Emergency & Safety Info",
    description: "Emergency contacts and safety information",
    icon: Phone,
    defaultCards: ["emergency-contacts"]
  },
  {
    id: "recommendations",
    title: "Local Recommendations",
    description: "Restaurants, attractions, and local favorites",
    icon: Star,
    defaultCards: ["local-dining", "coffee-cafes", "attractions-activities", "shopping-groceries"]
  },
  {
    id: "departure",
    title: "Check-out Procedures",
    description: "Check-out instructions and procedures",
    icon: Clock,
    defaultCards: ["checkout-procedures"]
  },
  {
    id: "help",
    title: "FAQs & Troubleshooting",
    description: "Common questions and solutions",
    icon: MessageCircle,
    defaultCards: ["faq-troubleshooting"]
  }
];

const GuideBook = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [guidebooks, setGuidebooks] = useState<GuidebookWithContent[]>([]);
  const [selectedGuidebook, setSelectedGuidebook] = useState<GuidebookWithContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
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

  const createDefaultContent = async (guidebookId: string) => {
    for (const sectionTemplate of sectionTemplates) {
      const { data: sectionData, error: sectionError } = await supabase
        .from("guidebook_sections")
        .insert({
          guidebook_id: guidebookId,
          title: sectionTemplate.title,
          description: sectionTemplate.description,
          icon: sectionTemplate.icon.name.toLowerCase(),
          display_order: sectionTemplates.indexOf(sectionTemplate),
          is_expanded_default: sectionTemplate.id === "welcome" || sectionTemplate.id === "arrival"
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      // Create default cards for this section
      const defaultCards = contentTemplates.filter(template => 
        sectionTemplate.defaultCards.includes(template.id)
      );

      for (const [index, cardTemplate] of defaultCards.entries()) {
        const { error: cardError } = await supabase
          .from("guidebook_cards")
          .insert({
            section_id: sectionData.id,
            title: cardTemplate.title,
            content: cardTemplate.content,
            card_type: cardTemplate.cardType,
            display_order: index
          });

        if (cardError) throw cardError;
      }
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

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to create a guidebook",
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

      await createDefaultContent(data.id);
      await fetchGuidebooks();
      setSelectedGuidebook(data);
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
        title: "Guidebook Created! 🎉",
        description: "Your comprehensive guidebook is ready with professional content templates!",
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

  const copyShareableLink = async (guidebook: Guidebook) => {
    if (!guidebook.guest_link_slug) return;
    
    const guestUrl = `${window.location.origin}/guide/${guidebook.guest_link_slug}`;
    
    try {
      await navigator.clipboard.writeText(guestUrl);
      toast({
        title: "Link Copied! 📋",
        description: "Shareable guest link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = (guidebook: Guidebook) => {
    if (!guidebook.guest_link_slug) return;
    
    const guestUrl = `${window.location.origin}/guide/${guidebook.guest_link_slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(guestUrl)}`;
    
    // Open QR code in new window
    window.open(qrUrl, '_blank');
    
    toast({
      title: "QR Code Generated! 📱",
      description: "QR code opened in new window - save or print for guests",
    });
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
          : "Your guests can now access your comprehensive guidebook",
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
      "heart": Heart,
      "home": Home,
      "checkcircle": CheckCircle,
      "settings": Settings,
      "phone": Phone,
      "star": Star,
      "clock": Clock,
      "messagecircle": MessageCircle
    };
    return iconMap[iconName] || Home;
  };

  const filteredTemplates = contentTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(contentTemplates.map(t => t.category)));

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold mb-2">Loading Guidebook Builder</h3>
          <p className="text-muted-foreground">Preparing your comprehensive guidebook tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Enhanced Header */}
      <div className="border-b bg-card/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Professional Guidebook Builder</h1>
                  <p className="text-sm text-muted-foreground">Create comprehensive, engaging guest experiences</p>
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
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Select a guidebook" />
                    </SelectTrigger>
                    <SelectContent>
                      {guidebooks.map((guidebook) => (
                        <SelectItem key={guidebook.id} value={guidebook.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${guidebook.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <span className="font-medium">{guidebook.property_name}</span>
                            <Badge variant="outline" className="ml-2">
                              {guidebook.property_type}
                            </Badge>
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
                    onClick={() => copyShareableLink(selectedGuidebook)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateQRCode(selectedGuidebook)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedGuidebook.guest_link_slug) {
                        window.open(`/guide/${selectedGuidebook.guest_link_slug}`, '_blank');
                      }
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={selectedGuidebook.is_published ? "destructive" : "default"}
                    size="sm"
                    onClick={() => togglePublishGuidebook(selectedGuidebook)}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {selectedGuidebook.is_published ? "Unpublish" : "Publish"}
                  </Button>
                </>
              )}
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Guidebook
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Create Professional Guidebook</DialogTitle>
                    <p className="text-muted-foreground">
                      Build a comprehensive guidebook with pre-designed content templates
                    </p>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="property_name">Property Name *</Label>
                        <Input
                          id="property_name"
                          value={newGuidebook.property_name}
                          onChange={(e) => setNewGuidebook({...newGuidebook, property_name: e.target.value})}
                          placeholder="Luxury Downtown Apartment"
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
                            <SelectItem value="loft">Loft</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="property_address">Full Address</Label>
                        <Input
                          id="property_address"
                          value={newGuidebook.property_address}
                          onChange={(e) => setNewGuidebook({...newGuidebook, property_address: e.target.value})}
                          placeholder="123 Main Street, City, State, ZIP"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Property Description</Label>
                        <Textarea
                          id="description"
                          value={newGuidebook.description}
                          onChange={(e) => setNewGuidebook({...newGuidebook, description: e.target.value})}
                          placeholder="A beautiful, modern space in the heart of downtown..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="check_in_time">Check-in Time</Label>
                          <Input
                            id="check_in_time"
                            type="time"
                            value={newGuidebook.check_in_time}
                            onChange={(e) => setNewGuidebook({...newGuidebook, check_in_time: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="check_out_time">Check-out Time</Label>
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
                          <Label htmlFor="wifi_name">Wi-Fi Network</Label>
                          <Input
                            id="wifi_name"
                            value={newGuidebook.wifi_name}
                            onChange={(e) => setNewGuidebook({...newGuidebook, wifi_name: e.target.value})}
                            placeholder="MyWiFi_Network"
                          />
                        </div>
                        <div>
                          <Label htmlFor="wifi_password">Wi-Fi Password</Label>
                          <Input
                            id="wifi_password"
                            value={newGuidebook.wifi_password}
                            onChange={(e) => setNewGuidebook({...newGuidebook, wifi_password: e.target.value})}
                            placeholder="SecurePassword123"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cover_photo_url">Cover Photo URL</Label>
                        <Input
                          id="cover_photo_url"
                          value={newGuidebook.cover_photo_url}
                          onChange={(e) => setNewGuidebook({...newGuidebook, cover_photo_url: e.target.value})}
                          placeholder="https://example.com/property-photo.jpg"
                        />
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          What's Included
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 8 Pre-designed content sections</li>
                          <li>• 13 Professional content templates</li>
                          <li>• Mobile-optimized guest view</li>
                          <li>• Shareable links & QR codes</li>
                          <li>• Local recommendations framework</li>
                          <li>• Emergency contact templates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Button onClick={createGuidebook} className="w-full mt-6" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Professional Guidebook
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
            <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl w-40 h-40 mx-auto mb-8 flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Professional Guidebook Builder</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create stunning, comprehensive digital guidebooks that elevate your guest experience. 
              Include everything from arrival instructions to local recommendations, all optimized for mobile.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="p-4 bg-primary/10 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Professional Templates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  13 pre-designed content templates covering arrival, amenities, local recommendations, and more
                </p>
              </Card>
              
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="p-4 bg-primary/10 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Sharing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate shareable links and QR codes for seamless guest access on any device
                </p>
              </Card>
              
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="p-4 bg-primary/10 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Guest Experience</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mobile-first design with intuitive navigation and engaging visual content
                </p>
              </Card>
            </div>
            
            <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">What's Included in Every Guidebook</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {sectionTemplates.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={section.id} className="text-center">
                      <div className="p-3 bg-background rounded-xl w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-sm">{section.title}</h4>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-6 text-lg"
            >
              <Plus className="h-6 w-6 mr-3" />
              Create Your Professional Guidebook
            </Button>
          </div>
        ) : selectedGuidebook ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${selectedGuidebook.is_published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{selectedGuidebook.property_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedGuidebook.property_type}
                        </Badge>
                        <Badge variant={selectedGuidebook.is_published ? "default" : "secondary"} className="text-xs">
                          {selectedGuidebook.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedGuidebook.cover_photo_url && (
                    <div className="w-full h-32 bg-muted rounded-lg overflow-hidden mb-3">
                      <img 
                        src={selectedGuidebook.cover_photo_url} 
                        alt={selectedGuidebook.property_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
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
                        <span className="truncate">{selectedGuidebook.wifi_name}</span>
                      </div>
                    )}
                    {selectedGuidebook.property_address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs leading-tight">{selectedGuidebook.property_address}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyShareableLink(selectedGuidebook)}
                      className="w-full justify-start"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Guest Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateQRCode(selectedGuidebook)}
                      className="w-full justify-start"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
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

                  <Separator />

                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedGuidebook.sections?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Sections</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {selectedGuidebook.sections?.reduce((acc, section) => acc + (section.cards?.length || 0), 0) || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Content Cards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Guidebook Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-primary/5 rounded-lg border">
                            <div className="text-3xl font-bold text-primary mb-1">
                              {selectedGuidebook.sections?.length || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Sections</p>
                          </div>
                          <div className="text-center p-4 bg-blue-500/5 rounded-lg border">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {selectedGuidebook.sections?.reduce((acc, section) => acc + (section.cards?.length || 0), 0) || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Content Cards</p>
                          </div>
                          <div className="text-center p-4 bg-green-500/5 rounded-lg border">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                              {selectedGuidebook.sections?.flatMap(s => s.cards || []).filter(c => c.card_type === 'recommendation').length || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Recommendations</p>
                          </div>
                          <div className="text-center p-4 bg-purple-500/5 rounded-lg border">
                            <div className="text-3xl font-bold text-purple-600 mb-1">
                              {selectedGuidebook.is_published ? "LIVE" : "DRAFT"}
                            </div>
                            <p className="text-sm text-muted-foreground">Status</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4">
                      {selectedGuidebook.sections?.sort((a, b) => a.display_order - b.display_order).map((section) => {
                        const IconComponent = getSectionIcon(section.icon || "home");
                        return (
                          <Card key={section.id} className="hover:shadow-md transition-shadow">
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
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {section.cards?.length || 0} cards
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Content Management</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Content
                      </Button>
                    </div>
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
                              <Switch defaultChecked={section.is_expanded_default} />
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
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
                              <div key={card.id} className="flex items-start justify-between p-4 border rounded-lg bg-muted/20">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="flex items-center gap-2 mt-1">
                                    {card.card_type === 'recommendation' && <Star className="h-4 w-4 text-yellow-500" />}
                                    {card.media_url && <Camera className="h-4 w-4 text-blue-500" />}
                                    {card.video_url && <Video className="h-4 w-4 text-purple-500" />}
                                    {card.card_type === 'text' && <FileText className="h-4 w-4 text-gray-500" />}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{card.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {card.content?.substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {card.card_type}
                                      </Badge>
                                      {card.card_subtype && (
                                        <Badge variant="outline" className="text-xs">
                                          {card.card_subtype}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Copy className="h-3 w-3" />
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

                <TabsContent value="templates" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Content Templates</h3>
                      <p className="text-muted-foreground">Pre-designed content to enhance your guidebook</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                      >
                        {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search templates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                    {filteredTemplates.map((template) => {
                      const IconComponent = template.icon;
                      return (
                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                                <IconComponent className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-base">{template.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{template.description}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {template.category}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {template.cardType}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                              {template.content.substring(0, 120)}...
                            </p>
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="flex-1">
                                <Plus className="h-3 w-3 mr-1" />
                                Add to Guidebook
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guidebook Settings</CardTitle>
                      <p className="text-sm text-muted-foreground">Configure your guidebook properties and preferences</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                              <SelectItem value="loft">Loft</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Property Address</Label>
                        <Input defaultValue={selectedGuidebook.property_address || ""} />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea defaultValue={selectedGuidebook.description || ""} rows={3} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Check-in Time</Label>
                          <Input type="time" defaultValue={selectedGuidebook.check_in_time || ""} />
                        </div>
                        <div>
                          <Label>Check-out Time</Label>
                          <Input type="time" defaultValue={selectedGuidebook.check_out_time || ""} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Wi-Fi Network</Label>
                          <Input defaultValue={selectedGuidebook.wifi_name || ""} />
                        </div>
                        <div>
                          <Label>Wi-Fi Password</Label>
                          <Input defaultValue={selectedGuidebook.wifi_password || ""} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Publishing Options</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Published Status</Label>
                            <p className="text-sm text-muted-foreground">Make guidebook accessible to guests</p>
                          </div>
                          <Switch defaultChecked={selectedGuidebook.is_published} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Multi-language Support</Label>
                            <p className="text-sm text-muted-foreground">Enable automatic translation for international guests</p>
                          </div>
                          <Switch />
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
                        <TrendingUp className="h-5 w-5" />
                        Analytics & Insights
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Track guest engagement and optimize your guidebook</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16">
                        <div className="p-8 bg-muted/50 rounded-2xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                          <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Analytics Coming Soon</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Track guest engagement, popular sections, feedback, and optimize your guidebook content 
                          based on real usage data.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground mb-1">📊</div>
                            <p className="text-sm text-muted-foreground">Views & Engagement</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground mb-1">⭐</div>
                            <p className="text-sm text-muted-foreground">Guest Feedback</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground mb-1">🔥</div>
                            <p className="text-sm text-muted-foreground">Popular Content</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground mb-1">💡</div>
                            <p className="text-sm text-muted-foreground">Optimization Tips</p>
                          </div>
                        </div>
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

export default GuideBook;