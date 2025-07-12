import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, BookOpen, Edit, Share2, Eye, Settings, Trash2, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Guidebook = Tables<"guidebooks">;

const GuideBook = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [guidebooks, setGuidebooks] = useState<Guidebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGuidebook, setNewGuidebook] = useState({
    property_name: "",
    property_address: "",
    description: "",
    cover_photo_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchGuidebooks();
    }
  }, [user]);

  const fetchGuidebooks = async () => {
    try {
      // Check if we're in development with a mock user
      if (user?.id === 'dev-user-id') {
        console.log('Development mode: skipping guidebooks fetch');
        setGuidebooks([]);
        setIsLoading(false);
        return;
      }

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

  const createGuidebook = async () => {
    if (!newGuidebook.property_name.trim()) {
      toast({
        title: "Error",
        description: "Property name is required",
        variant: "destructive",
      });
      return;
    }

    // Check if we're in development with a mock user
    if (user?.id === 'dev-user-id') {
      toast({
        title: "Development Mode",
        description: "Database operations are disabled in development mode",
        variant: "destructive",
      });
      return;
    }

    try {
      const shareableLink = `${window.location.origin}/guide/${crypto.randomUUID()}`;
      
      const { data, error } = await supabase
        .from("guidebooks")
        .insert({
          user_id: user?.id,
          property_name: newGuidebook.property_name,
          property_address: newGuidebook.property_address,
          description: newGuidebook.description,
          cover_photo_url: newGuidebook.cover_photo_url,
          shareable_link: shareableLink,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default sections
      const defaultSections = [
        { title: "Welcome & Arrival", description: "Check-in instructions and property overview" },
        { title: "House Rules", description: "Important rules and guidelines" },
        { title: "Local Recommendations", description: "Restaurants, attractions, and activities" },
        { title: "Check-Out", description: "Check-out procedures and instructions" }
      ];

      const { error: sectionsError } = await supabase
        .from("guidebook_sections")
        .insert(
          defaultSections.map((section, index) => ({
            guidebook_id: data.id,
            title: section.title,
            description: section.description,
            display_order: index
          }))
        );

      if (sectionsError) throw sectionsError;

      setGuidebooks([data, ...guidebooks]);
      setIsCreateDialogOpen(false);
      setNewGuidebook({
        property_name: "",
        property_address: "",
        description: "",
        cover_photo_url: ""
      });

      toast({
        title: "Success",
        description: "Guidebook created successfully!",
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

  const deleteGuidebook = async (id: string) => {
    // Check if we're in development with a mock user
    if (user?.id === 'dev-user-id') {
      toast({
        title: "Development Mode", 
        description: "Database operations are disabled in development mode",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("guidebooks")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setGuidebooks(guidebooks.filter(g => g.id !== id));
      toast({
        title: "Success",
        description: "Guidebook deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting guidebook:", error);
      toast({
        title: "Error",
        description: "Failed to delete guidebook",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (guidebook: Guidebook) => {
    // Check if we're in development with a mock user
    if (user?.id === 'dev-user-id') {
      toast({
        title: "Development Mode",
        description: "Database operations are disabled in development mode", 
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("guidebooks")
        .update({ is_published: !guidebook.is_published })
        .eq("id", guidebook.id);

      if (error) throw error;

      setGuidebooks(guidebooks.map(g => 
        g.id === guidebook.id 
          ? { ...g, is_published: !g.is_published }
          : g
      ));

      toast({
        title: "Success",
        description: `Guidebook ${guidebook.is_published ? 'unpublished' : 'published'} successfully`,
      });
    } catch (error) {
      console.error("Error updating guidebook:", error);
      toast({
        title: "Error",
        description: "Failed to update guidebook",
        variant: "destructive",
      });
    }
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
                Guest Guidebooks
              </h1>
              <p className="text-muted-foreground mt-1">
                Create and manage digital guidebooks for your properties
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guidebook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
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
                    <Label htmlFor="property_address">Property Address</Label>
                    <Input
                      id="property_address"
                      value={newGuidebook.property_address}
                      onChange={(e) => setNewGuidebook({...newGuidebook, property_address: e.target.value})}
                      placeholder="e.g., 123 Main St, City, State"
                    />
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">No guidebooks yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create your first digital guidebook to provide guests with all the information they need for their stay.
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
                      onClick={() => togglePublish(guidebook)}
                    >
                      {guidebook.is_published ? <Eye className="h-3 w-3" /> : <Settings className="h-3 w-3" />}
                    </Button>
                    {guidebook.is_published && (
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteGuidebook(guidebook.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
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

export default GuideBook;