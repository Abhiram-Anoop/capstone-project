// New Hospital/Clinic API Configuration
export const HOSPITAL_API_CONFIG = {
  // Primary API - Google Places
  GOOGLE_PLACES: {
    API_KEY: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'YOUR_GOOGLE_PLACES_API_KEY',
    BASE_URL: 'https://maps.googleapis.com/maps/api/place',
    ENDPOINTS: {
      NEARBY_SEARCH: '/nearbysearch/json',
      PLACE_DETAILS: '/details/json',
      PLACE_PHOTOS: '/photo'
    },
    SEARCH_PARAMS: {
      radius: 10000, // 10km default
      type: 'hospital',
      keyword: 'hospital clinic medical center'
    }
  },

  // Fallback API - Foursquare
  FOURSQUARE: {
    API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'YOUR_FOURSQUARE_API_KEY',
    BASE_URL: 'https://api.foursquare.com/v3/places',
    CATEGORIES: {
      HOSPITALS: '4bf58dd8d48988d196941735',
      DOCTORS: '4bf58dd8d48988d17f941735',
      MEDICAL_CENTERS: '4bf58dd8d48988d104941735'
    }
  },

  // Backend API for doctor information
  BACKEND: {
    BASE_URL: import.meta.env.VITE_BACKEND_URL || 'https://your-backend.com/api',
    ENDPOINTS: {
      HOSPITALS: '/hospitals',
      DOCTORS: '/doctors',
      SPECIALTIES: '/specialties'
    }
  },

  // Search configuration
  SEARCH_CONFIG: {
    DEFAULT_RADIUS_KM: 10,
    MAX_RADIUS_KM: 50,
    MAX_RESULTS: 20,
    SUPPORTED_SPECIALTIES: [
      'Cardiology',
      'Dermatology', 
      'Gynecology',
      'Orthopedics',
      'Pediatrics',
      'Neurology',
      'Oncology',
      'Psychiatry',
      'General Medicine',
      'Emergency Medicine'
    ]
  }
};

export default HOSPITAL_API_CONFIG;
