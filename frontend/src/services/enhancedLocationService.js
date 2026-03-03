// Enhanced Location Service - Multiple Free & Reliable Sources
class EnhancedLocationService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
    this.fallbackOrder = [
      'gps',
      'ipapi_co',
      'ip_api_com', 
      'ipgeolocation_io',
      'default'
    ];
  }

  // Main location detection method
  async getUserLocation() {
    try {
      console.log('🗺️ Starting enhanced location detection...');
      
      // Try GPS first (most accurate)
      const gpsLocation = await this.getGPSLocation();
      if (gpsLocation) {
        console.log('✅ GPS location successful');
        return gpsLocation;
      }
    } catch (error) {
      console.log('⚠️ GPS failed, trying IP geolocation...');
    }

    // Fallback to IP geolocation with multiple services
    return await this.getIPLocation();
  }

  // Enhanced GPS detection with better error handling
  async getGPSLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000 // 5 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'gps',
            timestamp: Date.now()
          };
          
          // Cache the GPS location
          this.setCachedLocation('gps', location);
          resolve(location);
        },
        (error) => {
          console.log(`GPS Error: ${error.message}`);
          reject(error);
        },
        options
      );
    });
  }

  // Multi-service IP geolocation with smart fallback
  async getIPLocation() {
    const services = [
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parser: (data) => ({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          city: data.city,
          region: data.region,
          country: data.country_name,
          source: 'ipapi_co'
        }),
        validator: (data) => data.latitude && data.longitude
      },
      {
        name: 'ip-api.com',
        url: 'https://ip-api.com/json/?fields=status,lat,lon,city,regionName,country',
        parser: (data) => ({
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          city: data.city,
          region: data.regionName,
          country: data.country,
          source: 'ip_api_com'
        }),
        validator: (data) => data.status === 'success' && data.lat && data.lon
      },
      {
        name: 'ipgeolocation.io',
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        parser: (data) => ({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
          city: data.city,
          region: data.state_prov,
          country: data.country_name,
          source: 'ipgeolocation_io'
        }),
        validator: (data) => data.latitude && data.longitude
      }
    ];

    for (const service of services) {
      try {
        console.log(`🌐 Trying ${service.name}...`);
        
        const cached = this.getCachedLocation(service.name);
        if (cached) {
          console.log(`✅ Using cached ${service.name} location`);
          return cached;
        }

        const response = await fetch(service.url, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AI-Doctor-Assistant/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (service.validator(data)) {
          const location = {
            ...service.parser(data),
            timestamp: Date.now(),
            accuracy: 10000 // ~10km accuracy for IP location
          };
          
          console.log(`✅ ${service.name} location successful:`, location.city);
          this.setCachedLocation(service.name, location);
          return location;
        }
        
      } catch (error) {
        console.log(`❌ ${service.name} failed:`, error.message);
        continue;
      }
    }

    // Final fallback - major cities based on common locations
    console.log('🏠 Using smart default location...');
    return this.getSmartDefaultLocation();
  }

  // Smart default based on common user patterns
  getSmartDefaultLocation() {
    const smartDefaults = [
      { city: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
      { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
      { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
      { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
      { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 }
    ];

    // Could add logic to detect user's likely region from browser language/timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    let defaultLocation = smartDefaults[0]; // Default to Delhi
    
    if (userTimezone.includes('America')) {
      defaultLocation = smartDefaults[3]; // New York
    } else if (userTimezone.includes('Europe')) {
      defaultLocation = smartDefaults[4]; // London
    }

    return {
      ...defaultLocation,
      source: 'smart_default',
      timestamp: Date.now(),
      accuracy: 50000 // ~50km accuracy
    };
  }

  // Cache management
  setCachedLocation(service, location) {
    this.cache.set(service, {
      ...location,
      cachedAt: Date.now()
    });
  }

  getCachedLocation(service) {
    const cached = this.cache.get(service);
    if (cached && (Date.now() - cached.cachedAt) < this.cacheDuration) {
      return cached;
    }
    return null;
  }

  // Get readable address from coordinates (reverse geocoding)
  async getAddressFromCoords(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AI-Doctor-Assistant/1.0'
          }
        }
      );
      
      const data = await response.json();
      return {
        formatted: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        area: data.address?.suburb || data.address?.neighbourhood,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode
      };
    } catch (error) {
      console.log('Reverse geocoding failed:', error);
      return null;
    }
  }

  // Test location service reliability
  async testLocationServices() {
    const results = {};
    
    for (const service of ['ipapi_co', 'ip_api_com', 'ipgeolocation_io']) {
      try {
        const start = Date.now();
        const location = await this.getIPLocation();
        const duration = Date.now() - start;
        
        results[service] = {
          success: true,
          duration,
          location: location ? `${location.city}, ${location.country}` : 'Unknown'
        };
      } catch (error) {
        results[service] = {
          success: false,
          error: error.message
        };
      }
    }
    
    return results;
  }
}

export default new EnhancedLocationService();