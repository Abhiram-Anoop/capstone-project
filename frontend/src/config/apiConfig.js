// Configuration for Hospital API Integration
// Update this file with your actual API credentials

export const API_CONFIG = {
  // Data.gov.in API Configuration
  DATA_GOV: {
    BASE_URL: 'https://api.data.gov.in/resource',
    HOSPITAL_DATASET_ID: '3630721',
    API_KEY: import.meta.env.VITE_DATA_GOV_API_KEY || 'YOUR_API_KEY_HERE',
    DEFAULT_LIMIT: 1000,
    DEFAULT_OFFSET: 0,
  },
  
  // Google Maps Configuration (optional)
  GOOGLE_MAPS: {
    API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  },
  
  // App Configuration
  APP: {
    DEFAULT_SEARCH_RADIUS_KM: 50,
    MAX_RESULTS: 1000,
    DEFAULT_LOCATION: {
      lat: 28.6139, // Delhi coordinates as fallback
      lng: 77.2090
    },
    SUPPORTED_CATEGORIES: [
      'Government',
      'Private', 
      'Trust',
      'Corporate',
      'Charitable',
      'Municipal',
      'ESI',
      'Railway',
      'Defence'
    ]
  }
};

export default API_CONFIG;
