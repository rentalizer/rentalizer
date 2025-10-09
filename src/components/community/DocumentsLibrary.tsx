import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Plus, Search, Eye, Trash2, Edit, Loader2, ArrowRight } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Document } from '@/types';
import { documentService } from '@/services/documentService';

interface DocumentsLibraryProps {
  onBack: () => void;
  onDocumentCountChange: (count: number) => void;
}

export const DocumentsLibrary = ({ onBack, onDocumentCountChange }: DocumentsLibraryProps) => {
  const { isAdmin } = useAdminRole();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [categories] = useState<string[]>(['all', 'Business Formation', 'Market Research', 'Property Acquisition', 'Operations']);

  // Form state for new document
  const [newDocument, setNewDocument] = useState({
    filename: '',
    category: 'Business Formation',
    file: null as File | null
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Business Formation': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Market Research': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Property Acquisition': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Operations': 'bg-green-500/20 border-green-500/30 text-green-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const getFileIcon = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      return <span className="text-red-400 text-lg">📄</span>;
    } else {
      return <span className="text-green-400 text-lg">📊</span>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load documents from backend
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined
      };

      const response = await documentService.getDocuments(filters);
      setDocuments(response.data);
      onDocumentCountChange(response.data.length);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, toast, onDocumentCountChange]);

  // Load documents on mount and when filters change
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleAddDocument = async () => {
    if (!newDocument.file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (3MB max)
    if (newDocument.file.size > 3 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File must be 3MB or smaller.",
        variant: "destructive"
      });
      return;
    }

    try {
      const documentData = {
        filename: newDocument.file.name,
        url: '', // Will be set by backend
        type: newDocument.file.name.endsWith('.pdf') ? 'pdf' as const : 'excel' as const,
        size: newDocument.file.size,
        category: newDocument.category
      };

      await documentService.createDocument(documentData, newDocument.file);
      
      // Reload documents to get the updated list
      await loadDocuments();
      
      setNewDocument({ filename: '', category: 'Business Formation', file: null });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Document added",
        description: "New document has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: "Error",
        description: "Failed to add document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(documentId);
        await loadDocuments(); // Reload documents
        toast({
          title: "Document deleted",
          description: "Document has been deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting document:', error);
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownload = (document: Document) => {
    documentService.downloadDocument(document);
  };

  // Documents are already filtered by backend, no need for client-side filtering

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
                  {/* Back button */}
                  <div className="flex items-center gap-4 mb-6">
                    <Button 
                      variant="outline" 
                      onClick={onBack}
                      className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                      Back to Albums
                    </Button>
                  </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap flex-shrink-0"
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 whitespace-nowrap flex-shrink-0"
              }
            >
              {category === 'all' ? 'All Documents' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-400">Loading documents...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No documents found</h3>
                <p className="text-gray-400">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters' 
                    : 'No documents have been added yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            documents.map(document => (
              <Card key={document._id} className="bg-slate-800/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(document.type)}
                      </div>
                      
                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {document.filename}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <Badge className={getCategoryColor(document.category)}>
                            {document.category}
                  </Badge>
                          <span>{formatFileSize(document.size)}</span>
                          <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(document)}
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      {isAdmin && (
                        <>
                          <Button
                            size="sm"
                    variant="outline" 
                            onClick={() => setEditingDocument(document)}
                            className="border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDocument(document._id)}
                            className="bg-red-900/80 hover:bg-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
              </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
      </div>
      )}
    </div>
  );
};
