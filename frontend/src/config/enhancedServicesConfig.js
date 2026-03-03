// Enhanced Services Configuration
export const LOCATION_CONFIG = {
  // GPS Settings
  GPS: {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 300000, // 5 minutes cache
  },

  // IP Geolocation Services (Free)
  IP_SERVICES: [
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/json/',
      monthlyLimit: 1000,
      reliability: 'high',
      priority: 1
    },
    {
      name: 'ip-api.com', 
      url: 'https://ip-api.com/json/?fields=status,lat,lon,city,regionName,country',
      monthlyLimit: 'unlimited',
      reliability: 'high',
      priority: 2
    },
    {
      name: 'ipgeolocation.io',
      url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
      monthlyLimit: 1000,
      reliability: 'medium',
      priority: 3
    }
  ],

  // Cache settings
  CACHE: {
    duration: 30 * 60 * 1000, // 30 minutes
    maxSize: 100 // maximum cached locations
  }
};

export const HOSPITAL_CONFIG = {
  // Search settings
  SEARCH: {
    defaultRadiusKm: 10,
    maxRadiusKm: 50,
    maxResults: 50,
    timeout: 25000 // 25 seconds
  },

  // Data sources (in order of preference)
  DATA_SOURCES: [
    {
      name: 'OpenStreetMap Overpass',
      type: 'overpass',
      url: 'https://overpass-api.de/api/interpreter',
      cost: 'free',
      reliability: 'high',
      coverage: 'global',
      enabled: true
    },
    {
      name: 'Foursquare Places',
      type: 'foursquare',
      url: 'https://api.foursquare.com/v3/places/search',
      cost: 'freemium', // 100k requests/month free
      reliability: 'high',
      coverage: 'global',
      enabled: false, // Requires API key
      apiKeyRequired: true
    },
    {
      name: 'Nominatim Geocoding',
      type: 'nominatim',
      url: 'https://nominatim.openstreetmap.org/search',
      cost: 'free',
      reliability: 'medium',
      coverage: 'global', 
      enabled: true,
      rateLimit: 1000 // 1 second between requests
    },
    {
      name: 'Mock Data',
      type: 'mock',
      cost: 'free',
      reliability: 'low',
      coverage: 'sample',
      enabled: true // Always enabled as fallback
    }
  ],

  // Cache settings
  CACHE: {
    duration: 30 * 60 * 1000, // 30 minutes
    maxSize: 500 // maximum cached hospital searches
  },

  // Default hospital specialties
  SPECIALTIES: [
    'General Medicine',
    'Emergency Medicine',
    'Cardiology',
    'Neurology', 
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Oncology',
    'Surgery',
    'Dermatology',
    'Psychiatry',
    'Radiology'
  ],

  // Hospital types
  TYPES: [
    'Hospital',
    'Clinic', 
    'Medical Center',
    'Polyclinic',
    'Health Center',
    'Specialty Clinic',
    'Emergency Center'
  ]
};

export const API_ENDPOINTS = {
  // Free APIs that don't require keys
  FREE_APIS: {
    overpass: 'https://overpass-api.de/api/interpreter',
    nominatim: 'https://nominatim.openstreetmap.org',
    ipapi: 'https://ipapi.co/json/',
    ip_api: 'https://ip-api.com/json/'
  },

  // Premium APIs (require keys but have free tiers)
  PREMIUM_APIS: {
    foursquare: 'https://api.foursquare.com/v3',
    google_places: 'https://maps.googleapis.com/maps/api/place',
    mapbox: 'https://api.mapbox.com'
  }
};

// Feature flags for easy enable/disable
export const FEATURES = {
  GPS_LOCATION: true,
  IP_LOCATION: true,
  REVERSE_GEOCODING: true,
  HOSPITAL_CACHING: true,
  OFFLINE_FALLBACK: true,
  MOCK_DATA_FALLBACK: true,
  LOCATION_RETRY: true,
  SERVICE_TESTING: true // Enable testing endpoints
};

// User preferences (can be stored in localStorage)
export const USER_PREFERENCES = {
  preferredRadius: 10, // km
  maxResults: 20,
  sortBy: 'distance', // distance, rating, name
  showOnlyVerified: false,
  enableNotifications: true
};

export default {
  LOCATION_CONFIG,
  HOSPITAL_CONFIG, 
  API_ENDPOINTS,
  FEATURES,
  USER_PREFERENCES
};