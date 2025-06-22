
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  X, 
  Check,
  Wand2,
  AlertTriangle,
  File
} from 'lucide-react';

interface TranscriptFile {
  id: string;
  file: File;
  title: string;
  transcript: string;
  topics: string[];
  status: 'pending' | 'ready' | 'uploaded';
}

interface BulkTranscriptUploadProps {
  onTranscriptsAdded: (transcripts: any[]) => void;
  commonTopics: string[];
}

export const BulkTranscriptUpload = ({ onTranscriptsAdded, commonTopics }: BulkTranscriptUploadProps) => {
  const { toast } = useToast();
  const [transcriptFiles, setTranscriptFiles] = useState<TranscriptFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback(async (files: FileList) => {
    console.log('Files received:', files.length);
    
    const validFiles = Array.from(files).filter(file => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      console.log('Checking file:', fileName, 'Type:', fileType);
      
      return (
        fileType === 'text/plain' ||
        fileName.endsWith('.txt') ||
        fileType === '' // Some systems don't set MIME type for .txt files
      );
    });

    console.log('Valid files:', validFiles.length);

    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload .txt files only",
        variant: "destructive"
      });
      return;
    }

    const newTranscriptFiles: TranscriptFile[] = [];

    for (const file of validFiles) {
      try {
        console.log('Reading file:', file.name);
        const content = await file.text();
        console.log('File content length:', content.length);

        const transcriptFile: TranscriptFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          title: file.name.replace(/\.txt$/i, ''),
          transcript: content,
          topics: [],
          status: 'ready'
        };

        newTranscriptFiles.push(transcriptFile);
      } catch (error) {
        console.error('Error reading file:', file.name, error);
        toast({
          title: "File Error",
          description: `Could not read file: ${file.name}`,
          variant: "destructive"
        });
      }
    }

    console.log('New transcript files created:', newTranscriptFiles.length);
    setTranscriptFiles(prev => [...prev, ...newTranscriptFiles]);

    toast({
      title: "Files Loaded",
      description: `${newTranscriptFiles.length} transcript file${newTranscriptFiles.length > 1 ? 's' : ''} loaded successfully`,
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    console.log('Files dropped:', e.dataTransfer.files.length);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const updateTranscriptFile = (id: string, updates: Partial<TranscriptFile>) => {
    setTranscriptFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  const removeTranscriptFile = (id: string) => {
    setTranscriptFiles(prev => prev.filter(file => file.id !== id));
  };

  const generateTitle = (id: string, transcript: string) => {
    // Simple title generation based on first few words
    const words = transcript.trim().split(/\s+/).slice(0, 8);
    const generatedTitle = words.join(' ').replace(/[^\w\s]/g, '');
    
    updateTranscriptFile(id, { 
      title: generatedTitle || 'Generated Title',
      status: 'ready'
    });

    toast({
      title: "Title Generated",
      description: "Title has been generated from transcript content",
    });
  };

  const toggleTopic = (fileId: string, topic: string) => {
    const file = transcriptFiles.find(f => f.id === fileId);
    if (!file) return;

    const topics = file.topics.includes(topic)
      ? file.topics.filter(t => t !== topic)
      : [...file.topics, topic];

    updateTranscriptFile(fileId, { topics });
  };

  const uploadTranscripts = () => {
    const readyFiles = transcriptFiles.filter(f => f.status === 'ready');
    
    console.log('Uploading transcripts:', readyFiles.length);
    
    if (readyFiles.length === 0) {
      toast({
        title: "No Files Ready",
        description: "Please ensure at least one transcript is ready for upload",
        variant: "destructive"
      });
      return;
    }

    const transcriptContent = readyFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(),
      title: file.title || file.file.name,
      url: 'transcript-upload',
      transcript: file.transcript,
      status: 'completed' as const,
      topics: file.topics.length > 0 ? file.topics : ['Q&A Session'],
      processedAt: new Date()
    }));

    console.log('Calling onTranscriptsAdded with:', transcriptContent);
    onTranscriptsAdded(transcriptContent);

    // Mark files as uploaded
    setTranscriptFiles(prev => prev.map(file => 
      readyFiles.includes(file) ? { ...file, status: 'uploaded' } : file
    ));

    toast({
      title: "Transcripts Uploaded",
      description: `${readyFiles.length} transcript${readyFiles.length > 1 ? 's' : ''} added to knowledge base`,
    });
  };

  const clearUploaded = () => {
    setTranscriptFiles(prev => prev.filter(file => file.status !== 'uploaded'));
  };

  const readyCount = transcriptFiles.filter(f => f.status === 'ready').length;
  const uploadedCount = transcriptFiles.filter(f => f.status === 'uploaded').length;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bulk Transcript Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              Drop transcript files here or click to browse
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Supports .txt files
            </p>
            <Input
              type="file"
              multiple
              accept=".txt,text/plain"
              onChange={(e) => {
                console.log('File input changed:', e.target.files?.length);
                if (e.target.files) {
                  handleFileUpload(e.target.files);
                }
              }}
              className="hidden"
              id="transcript-upload"
            />
            <label htmlFor="transcript-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </label>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Supported formats:</strong> Upload .txt files for immediate processing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Controls */}
      {transcriptFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">
                  {transcriptFiles.length} file{transcriptFiles.length > 1 ? 's' : ''} loaded
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  {readyCount} ready to upload
                </Badge>
                {uploadedCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {uploadedCount} uploaded
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {uploadedCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearUploaded}>
                    Clear Uploaded
                  </Button>
                )}
                <Button 
                  onClick={uploadTranscripts}
                  disabled={readyCount === 0}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {readyCount} Transcript{readyCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      <div className="space-y-4">
        {transcriptFiles.map((file) => (
          <Card key={file.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <File className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{file.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'ready' && (
                        <Badge className="bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      )}
                      {file.status === 'uploaded' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Check className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTranscriptFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Title</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateTitle(file.id, file.transcript)}
                        disabled={!file.transcript.trim()}
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                    <Input
                      value={file.title}
                      onChange={(e) => updateTranscriptFile(file.id, { title: e.target.value })}
                      placeholder="Enter a title for this transcript..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topics</label>
                    <div className="flex flex-wrap gap-1">
                      {commonTopics.map(topic => (
                        <Button
                          key={topic}
                          variant={file.topics.includes(topic) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTopic(file.id, topic)}
                          className="text-xs h-6"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transcript Preview</label>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700">
                        {file.transcript.substring(0, 300)}
                        {file.transcript.length > 300 && '...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
