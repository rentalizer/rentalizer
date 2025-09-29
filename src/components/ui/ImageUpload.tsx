import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { videoService } from '@/services/videoService';

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
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(() => {
    if (value) {
      return value.startsWith('/uploads/') ? `http://localhost:5000${value}` : value;
    }
    return null;
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update preview when value changes (for edit mode)
  useEffect(() => {
    if (value) {
      // If it's an uploaded file path, construct the full URL
      if (value.startsWith('/uploads/')) {
        setPreview(`http://localhost:5000${value}`);
      } else {
        // It's a regular URL
        setPreview(value);
      }
    } else {
      setPreview(null);
    }
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
        const filePath = response.data.data.path;
        onChange(filePath);
        
        // Update preview to show the uploaded image
        const fullImageUrl = `http://localhost:5000${filePath}`;
        setPreview(fullImageUrl);
        
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
    if (value && value.startsWith('/uploads/')) {
      const filename = value.split('/').pop();
      if (filename) {
        try {
          await videoService.deleteThumbnail(filename);
        } catch (error) {
          console.error('Error deleting uploaded image:', error);
        }
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

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onChange(url);
    setPreview(url);
    setSelectedFile(null);
    onFileSelect?.(null);
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

      {/* URL Input */}
      <div>
        <Label htmlFor="thumbnail-url" className="text-gray-300 text-sm">
          Or enter image URL:
        </Label>
        <Input
          id="thumbnail-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value || ''}
          onChange={handleUrlChange}
          className="bg-slate-800/50 border-cyan-500/20 text-white mt-1"
          disabled={disabled}
        />
      </div>

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
            {selectedFile ? `Selected: ${selectedFile.name}` : (value?.startsWith('/uploads/') ? `Uploaded: ${value.split('/').pop()}` : 'Image URL')}
          </p>
        </div>
      )}
    </div>
  );
};
