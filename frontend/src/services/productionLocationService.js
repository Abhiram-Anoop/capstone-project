// Production Location Service - ipapi.co
class ProductionLocationService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
    this.apiUrl = 'https://ipapi.co/json/';
    this.timeoutMs = 8000; // 8 seconds timeout
  }

  /**
   * Get user's current location with GPS + ipapi.co fallback
   * @returns {Promise<Object>} Location object with lat, lng, city, country, source
   */
  async getUserLocation() {
    try {
      console.log('🗺️ Starting location detection...');
      
      // Try GPS first (most accurate)
      const gpsLocation = await this.getGPSLocation();
      if (gpsLocation) {
        console.log('✅ GPS location obtained');
        return gpsLocation;
      }
    } catch (error) {
      console.log('⚠️ GPS failed, using IP geolocation...');
    }

    // Fallback to ipapi.co
    return await this.getIPLocation();
  }

  /**
   * Get GPS location with enhanced accuracy
   * @returns {Promise<Object|null>} GPS location or null if failed
   */
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

  /**
   * Get location from ipapi.co with caching and error handling
   * @returns {Promise<Object>} IP-based location
   */
  async getIPLocation() {
    try {
      // Check cache first
      const cached = this.getCachedLocation('ipapi');
      if (cached) {
        console.log('✅ Using cached IP location');
        return cached;
      }

      console.log('🌐 Getting location from ipapi.co...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(this.apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Doctor-Assistant/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data.latitude || !data.longitude) {
        throw new Error('Invalid response from ipapi.co');
      }

      const location = {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city || 'Unknown City',
        region: data.region || data.region_code,
        country: data.country_name || data.country,
        countryCode: data.country_code,
        timezone: data.timezone,
        source: 'ipapi',
        timestamp: Date.now(),
        accuracy: 10000 // ~10km accuracy for IP location
      };

      console.log(`✅ ipapi.co location: ${location.city}, ${location.country}`);
      
      // Cache the result
      this.setCachedLocation('ipapi', location);
      
      return location;
      
    } catch (error) {
      console.error('❌ ipapi.co failed:', error.message);
      
      // Ultimate fallback to major cities based on timezone
      return this.getSmartFallbackLocation();
    }
  }

  /**
   * Smart fallback location based on user's timezone
   * @returns {Object} Fallback location
   */
  getSmartFallbackLocation() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userLanguage = navigator.language || 'en';
    
    // Smart defaults based on timezone and language
    const locationMap = {
      // India
      'Asia/Kolkata': { city: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
      'Asia/Mumbai': { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
      
      // USA
      'America/New_York': { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
      'America/Los_Angeles': { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
      'America/Chicago': { city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
      
      // Europe
      'Europe/London': { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
      'Europe/Paris': { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
      'Europe/Berlin': { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
      
      // Asia
      'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
      'Asia/Shanghai': { city: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
      'Asia/Singapore': { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
      
      // Australia
      'Australia/Sydney': { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 }
    };

    let fallbackLocation = locationMap[userTimezone];
    
    // If timezone not found, use language-based fallback
    if (!fallbackLocation) {
      if (userLanguage.startsWith('hi') || userLanguage.startsWith('en-IN')) {
        fallbackLocation = locationMap['Asia/Kolkata'];
      } else if (userLanguage.startsWith('en-US') || userLanguage.startsWith('en')) {
        fallbackLocation = locationMap['America/New_York'];
      } else if (userLanguage.startsWith('en-GB')) {
        fallbackLocation = locationMap['Europe/London'];
      } else {
        // Default to Delhi (major international city)
        fallbackLocation = locationMap['Asia/Kolkata'];
      }
    }

    console.log(`🏠 Using smart fallback: ${fallbackLocation.city}, ${fallbackLocation.country}`);
    
    return {
      ...fallbackLocation,
      source: 'smart_fallback',
      timestamp: Date.now(),
      accuracy: 50000 // ~50km accuracy
    };
  }

  /**
   * Get readable address from coordinates using Nominatim
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object|null>} Address object or null
   */
  async getAddressFromCoords(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AI-Doctor-Assistant/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        formatted: data.display_name,
        street: data.address?.road || data.address?.street,
        area: data.address?.suburb || data.address?.neighbourhood || data.address?.area,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode
      };
      
    } catch (error) {
      console.log('Reverse geocoding failed:', error.message);
      return null;
    }
  }

  /**
   * Cache management - Set cached location
   * @param {string} key - Cache key
   * @param {Object} location - Location data
   */
  setCachedLocation(key, location) {
    this.cache.set(key, {
      ...location,
      cachedAt: Date.now()
    });
  }

  /**
   * Cache management - Get cached location
   * @param {string} key - Cache key
   * @returns {Object|null} Cached location or null
   */
  getCachedLocation(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.cachedAt) < this.cacheDuration) {
      return cached;
    }
    return null;
  }

  /**
   * Clear all cached locations
   */
  clearCache() {
    this.cache.clear();
    console.log('Location cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    return {
      size: this.cache.size,
      entries: entries.map(([key, value]) => ({
        key,
        age: Date.now() - value.cachedAt,
        location: `${value.city || value.lat?.toFixed(4)}, ${value.country || value.lng?.toFixed(4)}`
      }))
    };
  }

  /**
   * Validate location object
   * @param {Object} location - Location to validate
   * @returns {boolean} Is valid location
   */
  isValidLocation(location) {
    return location && 
           typeof location.lat === 'number' && 
           typeof location.lng === 'number' &&
           location.lat >= -90 && location.lat <= 90 &&
           location.lng >= -180 && location.lng <= 180;
  }
}

// Export singleton instance
export default new ProductionLocationService();