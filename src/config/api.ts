// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  
  // Timeout for requests (in milliseconds)
  TIMEOUT: 25000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    PROMO_CODES: {
      VERIFY: '/promo-codes/verify',
      BASE: '/promo-codes'
    },
    PROMO_CODE_REQUEST: '/promo-code-requests',
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
      DELETE_ACCOUNT: '/user/account',
      MEMBER_COUNT: '/user/member-count',
    },
    NEWS: {
      BASE: '/news',
      TRENDING: '/news/trending',
      FEATURED: '/news/featured',
      STATS: '/news/stats',
      SEARCH: '/news/search',
      SOURCES: '/news/sources',
      AGGREGATE: '/news/aggregate',
    },
    HEALTH: '/health',
  },
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
