import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Search, Trash2, Edit, Loader2, ArrowRight, Upload } from 'lucide-react';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useToast } from '@/hooks/use-toast';
import { Document } from '@/types';
import { documentService } from '@/services/documentService';

interface DocumentsLibraryProps {
  onBack: () => void;
  onDocumentCountChange: (count: number) => void;
}

export const DocumentsLibrary = ({ onBack, onDocumentCountChange }: DocumentsLibraryProps) => {
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  
  // State management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [categories] = useState<string[]>(['all', 'Documents Library', 'Business Formation', 'Market Research', 'Property Acquisition', 'Operations']);

  // Form state for new document
  const [newDocument, setNewDocument] = useState({
    category: 'Documents Library',
    file: null as File | null
  });
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSavingNewDocument, setIsSavingNewDocument] = useState(false);
  const [isUpdatingDocument, setIsUpdatingDocument] = useState(false);
  const [editForm, setEditForm] = useState({
    filename: '',
    category: 'Documents Library',
    file: null as File | null
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Business Formation': 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      'Market Research': 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      'Property Acquisition': 'bg-purple-500/20 border-purple-500/30 text-purple-300',
      'Operations': 'bg-green-500/20 border-green-500/30 text-green-300',
      'Documents Library': 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
      'Training Replays': 'bg-amber-500/20 border-amber-500/30 text-amber-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 border-gray-500/30 text-gray-300';
  };

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <span className="text-red-400 text-lg">📄</span>;
      case 'spreadsheet':
      case 'excel':
        return <span className="text-green-400 text-lg">📊</span>;
      case 'presentation':
        return <span className="text-orange-400 text-lg">📽️</span>;
      case 'text':
        return <span className="text-blue-300 text-lg">📝</span>;
      default:
        return <span className="text-purple-300 text-lg">📁</span>;
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

  // Also reload when component becomes visible (when user navigates to Documents Library)
  useEffect(() => {
    // Small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      loadDocuments();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Run once when component mounts

  const categoryOptions = categories.filter(category => category !== 'all');

  const handleAddDocument = async () => {
    if (!newDocument.file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (20MB max)
    if (newDocument.file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File must be 20MB or smaller.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSavingNewDocument(true);
      await documentService.createDocument({
        category: newDocument.category
      }, newDocument.file);
      
      // Reload documents to get the updated list
      await loadDocuments();
      
      setNewDocument({ category: 'Documents Library', file: null });
      if (uploadInputRef.current) {
        uploadInputRef.current.value = '';
      }
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
    } finally {
      setIsSavingNewDocument(false);
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

  const handleEditOpen = (document: Document) => {
    setEditingDocument(document);
    setEditForm({
      filename: document.filename,
      category: document.category || 'Documents Library',
      file: null
    });
    if (editFileInputRef.current) {
      editFileInputRef.current.value = '';
    }
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument) return;

    const trimmedFilename = editForm.filename.trim();
    if (!trimmedFilename) {
      toast({
        title: "File name required",
        description: "Please enter a name for the document.",
        variant: "destructive"
      });
      return;
    }

    const payload: { category?: string; filename?: string } = {};
    if (trimmedFilename !== editingDocument.filename) {
      payload.filename = trimmedFilename;
    }
    if (editForm.category && editForm.category !== editingDocument.category) {
      payload.category = editForm.category;
    }

    const replacementFile = editForm.file ?? undefined;

    if (!payload.filename && !payload.category && !replacementFile) {
      toast({
        title: "No changes detected",
        description: "Update the name, category, or upload a new file before saving.",
        variant: "destructive"
      });
      return;
    }

    if (replacementFile && replacementFile.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Replacement file must be 20MB or smaller.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdatingDocument(true);
      await documentService.updateDocument(
        editingDocument._id,
        payload,
        replacementFile
      );
      await loadDocuments();
      toast({
        title: "Document updated",
        description: "Document changes saved successfully."
      });
      setEditingDocument(null);
      setEditForm({
        filename: '',
        category: 'Documents Library',
        file: null
      });
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update the document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingDocument(false);
    }
  };

  const handleUploadDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setNewDocument({ category: 'Documents Library', file: null });
      if (uploadInputRef.current) {
        uploadInputRef.current.value = '';
      }
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setEditingDocument(null);
      setEditForm({
        filename: '',
        category: 'Documents Library',
        file: null
      });
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };

  // Documents are already filtered by backend, no need for client-side filtering

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex w-full items-center gap-2 sm:w-auto sm:items-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
            <span className="hidden sm:inline">Back to Albums</span>
          </Button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-cyan-500/20 text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex w-full gap-2 overflow-x-auto pb-2 sm:w-auto sm:ml-4">
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

      {isAdmin && (
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={handleUploadDialogChange}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-cyan-500/30">
              <DialogHeader>
                <DialogTitle className="text-white">Upload Training Document</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select a file and choose a category to make it available in the library.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Category</Label>
                  <Select
                    value={newDocument.category}
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-slate-800/80 border-cyan-500/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-cyan-500/20 text-white">
                      {categoryOptions.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Document</Label>
                  <Input
                    ref={uploadInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setNewDocument(prev => ({ ...prev, file }));
                    }}
                    className="bg-slate-800/80 border-cyan-500/20 text-white"
                  />
                  {newDocument.file && (
                    <p className="text-xs text-gray-400">
                      Selected: {newDocument.file.name} ({formatFileSize(newDocument.file.size)})
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Maximum file size: 20MB. Supported formats: PDF, Word, Excel, PowerPoint, Text.
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleUploadDialogChange(false)}
                  className="border-gray-600 text-gray-300 hover:bg-slate-800/80"
                  disabled={isSavingNewDocument}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDocument}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  disabled={isSavingNewDocument}
                >
                  {isSavingNewDocument ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

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
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="font-semibold text-white break-words">
                        {document.filename}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                        <Badge className={`${getCategoryColor(document.category)} text-xs sm:text-sm`}>
                          {document.category}
                        </Badge>
                        <span>{formatFileSize(document.size)}</span>
                        <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto sm:justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(document)}
                      className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOpen(document)}
                          className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 sm:w-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteDocument(document._id)}
                          className="w-full bg-red-900/80 hover:bg-red-800 sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
      </div>
      )}

      <Dialog open={!!editingDocument} onOpenChange={handleEditDialogChange}>
        <DialogContent className="bg-slate-900 border-cyan-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Document</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the file name, category, or replace the uploaded file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300" htmlFor="edit-filename">File Name</Label>
              <Input
                id="edit-filename"
                value={editForm.filename}
                onChange={(event) => setEditForm(prev => ({ ...prev, filename: event.target.value }))}
                className="bg-slate-800/80 border-cyan-500/20 text-white"
                placeholder="Enter file name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-slate-800/80 border-cyan-500/20 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-cyan-500/20 text-white">
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Replace File (optional)</Label>
              <Input
                ref={editFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setEditForm(prev => ({ ...prev, file }));
                }}
                className="bg-slate-800/80 border-cyan-500/20 text-white"
              />
              {editForm.file && (
                <p className="text-xs text-gray-400">
                  Selected: {editForm.file.name} ({formatFileSize(editForm.file.size)})
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleEditDialogChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-slate-800/80"
              disabled={isUpdatingDocument}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDocument}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={isUpdatingDocument}
            >
              {isUpdatingDocument ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
