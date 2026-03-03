// Free Hospital API Configuration - 100% FREE Services Only
export const FREE_HOSPITAL_API_CONFIG = {
  // OpenStreetMap Nominatim (Free geocoding & search)
  NOMINATIM: {
    BASE_URL: 'https://nominatim.openstreetmap.org',
    ENDPOINTS: {
      SEARCH: '/search',
      REVERSE: '/reverse'
    },
    USER_AGENT: 'AI-Doctor-Assistant/1.0'
  },

  // Overpass API (Free OpenStreetMap data)
  OVERPASS: {
    BASE_URL: 'https://overpass-api.de/api/interpreter',
    TIMEOUT: 25 // seconds
  },

  // Free IP Location Services (no API keys required)
  IP_LOCATION: {
    SERVICES: [
      'https://ip-api.com/json/?fields=lat,lon,city,country,status',
      'https://ipapi.co/json/',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free'
    ]
  },

  // Free Government Health Data APIs
  GOVERNMENT_DATA: {
    INDIA: 'https://data.gov.in/api/datastore/resource.json?resource_id=hospitals-directory',
    // Add more countries as needed
  },

  // Search configuration
  SEARCH_CONFIG: {
    DEFAULT_RADIUS_KM: 10,
    MAX_RADIUS_KM: 50,
    MAX_RESULTS: 50,
    CACHE_DURATION_MS: 30 * 60 * 1000, // 30 minutes
  },

  // Hospital data structure
  HOSPITAL_FIELDS: [
    'name',
    'address', 
    'city',
    'state',
    'pincode',
    'phone',
    'email',
    'website',
    'type', // government, private, specialty
    'services', // emergency, icu, maternity, etc
    'specialties',
    'doctors',
    'timings',
    'coordinates',
    'rating',
    'verified'
  ]
};

export default FREE_HOSPITAL_API_CONFIG;
