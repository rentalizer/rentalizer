
export const generateVideoId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const isVideoFile = (file: File) => {
  return file.type.startsWith('video/') || 
    file.name.toLowerCase().includes('.mp4') ||
    file.name.toLowerCase().includes('.mov') ||
    file.name.toLowerCase().includes('.avi');
};

export const formatFileSize = (bytes: number) => {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const generateVideoTitle = async (videoId: string, transcript: string) => {
  if (!transcript.trim()) return null;

  try {
    const response = await fetch('/api/generate-video-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid response from server');
    }
    
    return data.title || `Video ${videoId.substring(0, 8)}`;
  } catch (error) {
    console.error('Error generating title:', error);
    return `Video ${videoId.substring(0, 8)}`;
  }
};
