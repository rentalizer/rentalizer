import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  doc_type: string;
  text_content: string;
  created_at: string;
  file_size: number;
}

export const RichieAdminPanel = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    docType: 'pdf',
    textContent: '',
    url: ''
  });

  const docTypes = [
    { value: 'pdf', label: 'PDF Guide' },
    { value: 'transcript', label: 'Video Transcript' },
    { value: 'checklist', label: 'Checklist/SOP' },
    { value: 'market_data', label: 'Market Data' },
    { value: 'qa', label: 'Q&A Archive' },
    { value: 'other', label: 'Other' }
  ];

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('richie_docs')
        .select('id, title, doc_type, text_content, created_at, file_size')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    }
  };

  const uploadDocument = async () => {
    if (!uploadForm.title.trim() || !uploadForm.textContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data, error } = await supabase.functions.invoke('embed-document', {
        body: {
          title: uploadForm.title.trim(),
          docType: uploadForm.docType,
          textContent: uploadForm.textContent.trim(),
          url: uploadForm.url.trim() || null,
          metadata: {
            uploaded_by: user?.id,
            upload_date: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message || "Document embedded successfully"
      });

      // Reset form
      setUploadForm({
        title: '',
        docType: 'pdf',
        textContent: '',
        url: ''
      });

      // Reload documents
      loadDocuments();

    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('richie_docs')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Document Deleted",
        description: "Document removed from knowledge base"
      });

      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      loadDocuments();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Admin Access Required</h3>
          <p className="text-gray-400">You need admin privileges to manage Richie's knowledge base.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Knowledge Base Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Document Title</label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Houston Market Guide"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Document Type</label>
              <Select 
                value={uploadForm.docType} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, docType: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {docTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">URL (Optional)</label>
            <Input
              value={uploadForm.url}
              onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/document.pdf"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-2 block">Content</label>
            <Textarea
              value={uploadForm.textContent}
              onChange={(e) => setUploadForm(prev => ({ ...prev, textContent: e.target.value }))}
              placeholder="Paste the full text content here..."
              className="bg-slate-700 border-slate-600 text-white min-h-[200px]"
            />
          </div>

          <Button
            onClick={uploadDocument}
            disabled={isUploading || !uploadForm.title.trim() || !uploadForm.textContent.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Embed
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Knowledge Base ({documents.length} documents)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{doc.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {docTypes.find(t => t.value === doc.doc_type)?.label || doc.doc_type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {(doc.file_size / 1000).toFixed(1)}k chars • {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {doc.text_content.substring(0, 100)}...
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDocument(doc.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-3" />
                <p>No documents uploaded yet</p>
                <p className="text-sm">Upload your first training material above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};