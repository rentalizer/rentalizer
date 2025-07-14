
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File, Image, Video, ExternalLink } from 'lucide-react';

interface AttachmentViewerProps {
  attachments: string[];
  className?: string;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments, className = '' }) => {
  if (!attachments || attachments.length === 0) return null;

  const getFileTypeFromUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'mov', 'avi', 'wmv'].includes(extension || '')) return 'video';
    if (['pdf'].includes(extension || '')) return 'pdf';
    return 'file';
  };

  const getFileName = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.split('?')[0]; // Remove query parameters
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return File;
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="text-sm text-gray-400 font-medium">
        {attachments.length} attachment{attachments.length > 1 ? 's' : ''}
      </div>
      
      <div className="grid gap-3">
        {attachments.map((url, index) => {
          const fileType = getFileTypeFromUrl(url);
          const fileName = getFileName(url);
          const Icon = getFileIcon(fileType);

          return (
            <Card key={index} className="bg-slate-700/30 border-slate-600/50 p-3">
              <div className="flex items-center gap-3">
                {fileType === 'image' ? (
                  <div className="relative group">
                    <img 
                      src={url} 
                      alt={fileName}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : fileType === 'video' ? (
                  <div className="relative group">
                    <video 
                      src={url}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200 truncate">{fileName}</div>
                  <div className="text-xs text-gray-500 capitalize">{fileType} file</div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                    className="text-gray-400 hover:text-cyan-300 p-2"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(url, fileName)}
                    className="text-gray-400 hover:text-cyan-300 p-2"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
