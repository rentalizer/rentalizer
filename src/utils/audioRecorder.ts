export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    try {
      console.log('🎤 Starting audio recording...');
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      console.log('✅ Microphone access granted');

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log('📊 Audio chunk received:', event.data.size, 'bytes');
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('🔴 Recording started');
    } catch (error) {
      console.error('❌ Error starting recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      console.log('⏹️ Stopping recording...');

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('✅ Recording stopped, blob size:', audioBlob.size, 'bytes');
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event);
        this.cleanup();
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Converting blob to base64, size:', blob.size, 'type:', blob.type);
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 content
      const base64 = result.split(',')[1];
      console.log('✅ Base64 conversion complete, length:', base64.length);
      resolve(base64);
    };
    reader.onerror = (error) => {
      console.error('❌ Base64 conversion failed:', error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};

export const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audioData = `data:audio/mpeg;base64,${base64Audio}`;
      const audio = new Audio(audioData);
      
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(new Error('Failed to play audio'));
      
      audio.play().catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};