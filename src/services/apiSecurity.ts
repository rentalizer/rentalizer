
export class ApiSecurityService {
  private static readonly MAX_REQUESTS_PER_MINUTE = 60;
  private static readonly REQUEST_WINDOW_MS = 60000;
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();

  static validateApiKey(key: string, keyType: 'rapidapi' | 'openai'): boolean {
    if (!key || typeof key !== 'string') {
      return false;
    }

    // Basic validation based on key type
    switch (keyType) {
      case 'rapidapi':
        return key.length >= 40 && /^[a-zA-Z0-9]+$/.test(key);
      case 'openai':
        return key.startsWith('sk-') && key.length >= 40;
      default:
        return false;
    }
  }

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters and trim
    return input
      .replace(/[<>'"&]/g, '') // Remove HTML/script injection chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .trim()
      .substring(0, 1000); // Limit length
  }

  static checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requestCounts.get(identifier);

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize counter
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + this.REQUEST_WINDOW_MS
      });
      return true;
    }

    if (userRequests.count >= this.MAX_REQUESTS_PER_MINUTE) {
      return false; // Rate limit exceeded
    }

    userRequests.count++;
    return true;
  }

  static encryptApiKey(key: string): string {
    // Simple base64 encoding for local storage (not cryptographically secure)
    // In production, use proper encryption libraries
    try {
      return btoa(key);
    } catch {
      return key;
    }
  }

  static decryptApiKey(encryptedKey: string): string {
    // Simple base64 decoding
    try {
      return atob(encryptedKey);
    } catch {
      return encryptedKey;
    }
  }

  static validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      // Only allow HTTPS URLs to trusted domains
      return parsed.protocol === 'https:' && 
             (parsed.hostname.includes('openai.com') || 
              parsed.hostname.includes('rapidapi.com') ||
              parsed.hostname === 'localhost');
    } catch {
      return false;
    }
  }

  static logSecurityEvent(event: string, details: any): void {
    console.log(`🛡️ Security Event: ${event}`, {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...details
    });
  }
}
