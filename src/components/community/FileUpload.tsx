
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, File, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AttachmentFile {
  file: File;
  preview?: string;
  id: string;
}

interface FileUploadProps {
  onFilesChange: (files: AttachmentFile[]) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSizeBytes = 10 * 1024 * 1024 // 10MB
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    return File;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (attachments.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only attach up to ${maxFiles} files`,
        variant: "destructive"
      });
      return;
    }

    const validFiles: AttachmentFile[] = [];

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than ${Math.round(maxSizeBytes / (1024 * 1024))}MB`,
          variant: "destructive"
        });
        continue;
      }

      const attachmentFile: AttachmentFile = {
        file,
        id: Math.random().toString(36).substr(2, 9)
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        attachmentFile.preview = URL.createObjectURL(file);
      }

      validFiles.push(attachmentFile);
    }

    const newAttachments = [...attachments, ...validFiles];
    setAttachments(newAttachments);
    onFilesChange(newAttachments);
  };

  const removeFile = (id: string) => {
    const newAttachments = attachments.filter(att => att.id !== id);
    setAttachments(newAttachments);
    onFilesChange(newAttachments);
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!user || attachments.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const attachment of attachments) {
        const fileExt = attachment.file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('discussion-attachments')
          .upload(fileName, attachment.file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed", 
            description: `Failed to upload ${attachment.file.name}`,
            variant: "destructive"
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('discussion-attachments')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-cyan-300"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || attachments.length >= maxFiles}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const Icon = getFileIcon(attachment.file.type);
            return (
              <div key={attachment.id} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                {attachment.preview ? (
                  <img 
                    src={attachment.preview} 
                    alt={attachment.file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Icon className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-300 flex-1 truncate">
                  {attachment.file.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(attachment.file.size / 1024).toFixed(1)}KB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(attachment.id)}
                  className="text-gray-400 hover:text-red-400 p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export the upload function for use by parent components
export const useFileUpload = () => {
  const uploadFiles = async (attachments: AttachmentFile[], userId: string): Promise<string[]> => {
    if (!userId || attachments.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const attachment of attachments) {
      const fileExt = attachment.file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('discussion-attachments')
        .upload(fileName, attachment.file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('discussion-attachments')
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  return { uploadFiles };
};
