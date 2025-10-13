import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { videoService } from '@/services/videoService';
import { API_CONFIG } from '@/config/api';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onFileSelect,
  className = '',
  disabled = false
}) => {
  const resolvePreview = (input?: string) => {
    if (!input) return null;
    if (input.startsWith('http')) return input;
    if (input.startsWith('/uploads/')) {
      return `${API_CONFIG.BASE_URL.replace('/api', '')}${input}`;
    }
    return input;
  };

  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(() => resolvePreview(value));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update preview when value changes (for edit mode)
  useEffect(() => {
    setPreview(resolvePreview(value));
  }, [value]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, GIF, WebP).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      // Automatically upload the file after preview is created
      handleUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    try {
      const response = await videoService.uploadThumbnail(fileToUpload);
      
      if (response.data.success) {
        const { url } = response.data.data;
        onChange(url);
        setPreview(url);
        
        toast({
          title: "Image uploaded",
          description: "Thumbnail image has been uploaded successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    // If there's an uploaded file, try to delete it from server
    if (value) {
      try {
        await videoService.deleteThumbnail({ url: value });
      } catch (error) {
        console.error('Error deleting uploaded image:', error);
      }
    }
    
    setSelectedFile(null);
    setPreview(null);
    onChange('');
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-gray-300">Thumbnail</Label>
      
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? 'Uploading...' : (preview ? 'Change Image' : 'Select Image')}
        </Button>
        
        {(preview || value) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {/* File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />


      {/* Preview */}
      {preview && (
        <div className="relative">
          <div className="relative w-full h-48 bg-slate-800/50 rounded-lg overflow-hidden border border-cyan-500/20">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-contain"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                  <span className="text-white text-sm">Uploading...</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {selectedFile ? `Selected: ${selectedFile.name}` : (value ? `Uploaded: ${value.split('/').pop()}` : 'Image')}
          </p>
        </div>
      )}
    </div>
  );
};
