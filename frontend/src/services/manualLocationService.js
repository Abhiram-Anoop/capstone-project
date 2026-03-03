// Manual Location Service - No automatic detection, user selects location
class ManualLocationService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 60 * 60 * 1000; // 1 hour cache for geocoded locations
  }

  /**
   * Get coordinates for a city/location name using Nominatim
   * @param {string} locationName - City or location name
   * @returns {Promise<Object>} Location coordinates and details
   */
  async geocodeLocation(locationName) {
    try {
      const cacheKey = `geocode_${locationName.toLowerCase()}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('✅ Using cached geocoding result');
        return cached;
      }

      console.log(`🔍 Geocoding location: ${locationName}`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AI-Doctor-Assistant/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error(`Location "${locationName}" not found`);
      }

      const result = data[0];
      
      const location = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: locationName,
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        state: result.address?.state,
        country: result.address?.country,
        countryCode: result.address?.country_code,
        source: 'manual_geocoded',
        timestamp: Date.now()
      };

      // Cache the result
      this.setCache(cacheKey, location);
      
      console.log(`✅ Geocoded "${locationName}" to ${location.lat}, ${location.lng}`);
      return location;
      
    } catch (error) {
      console.error(`❌ Geocoding failed for "${locationName}":`, error.message);
      throw error;
    }
  }

  /**
   * Get predefined major cities with coordinates
   * Focused on Nabha, Punjab and surrounding cities
   * @returns {Array} Array of major cities
   */
  getMajorCities() {
    return [
      // Primary Location - Nabha, Punjab
      { name: 'Nabha', lat: 30.3747, lng: 76.1434, country: 'India', state: 'Punjab' },
      
      // Nearby Cities in Punjab (within 50km of Nabha)
      { name: 'Patiala', lat: 30.3398, lng: 76.3869, country: 'India', state: 'Punjab', distance: '18 km' },
      { name: 'Sangrur', lat: 30.2486, lng: 75.8450, country: 'India', state: 'Punjab', distance: '25 km' },
      { name: 'Rajpura', lat: 30.4789, lng: 76.5950, country: 'India', state: 'Punjab', distance: '35 km' },
      { name: 'Samana', lat: 30.1463, lng: 76.1971, country: 'India', state: 'Punjab', distance: '28 km' },
      { name: 'Khanna', lat: 30.7046, lng: 76.2222, country: 'India', state: 'Punjab', distance: '45 km' },
      
      // Major Punjab Cities
      { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, country: 'India', state: 'Chandigarh', distance: '65 km' },
      { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, country: 'India', state: 'Punjab', distance: '85 km' },
      { name: 'Mohali', lat: 30.7046, lng: 76.7179, country: 'India', state: 'Punjab', distance: '68 km' },
      { name: 'Bathinda', lat: 30.2110, lng: 74.9455, country: 'India', state: 'Punjab', distance: '120 km' },
      { name: 'Amritsar', lat: 31.6340, lng: 74.8723, country: 'India', state: 'Punjab', distance: '160 km' },
      { name: 'Jalandhar', lat: 31.3260, lng: 75.5762, country: 'India', state: 'Punjab', distance: '140 km' },
      
      // Nearby Haryana Cities
      { name: 'Ambala', lat: 30.3783, lng: 76.7767, country: 'India', state: 'Haryana', distance: '70 km' },
      { name: 'Kurukshetra', lat: 29.9693, lng: 76.8783, country: 'India', state: 'Haryana', distance: '85 km' },
      { name: 'Karnal', lat: 29.6857, lng: 76.9905, country: 'India', state: 'Haryana', distance: '110 km' },
      
      // Major Regional Centers
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, country: 'India', state: 'Delhi', distance: '250 km' },
      { name: 'Shimla', lat: 31.1048, lng: 77.1734, country: 'India', state: 'Himachal Pradesh', distance: '140 km' },
      
      // International (if needed)
      { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', state: 'England' },
      { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA', state: 'New York' },
      { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', state: 'Ontario' }
    ].map(city => ({
      ...city,
      source: 'predefined',
      timestamp: Date.now()
    }));
  }

  /**
   * Search cities by name (fuzzy search)
   * @param {string} query - Search query
   * @returns {Array} Matching cities
   */
  searchCities(query) {
    if (!query || query.length < 2) return [];
    
    const cities = this.getMajorCities();
    const lowercaseQuery = query.toLowerCase();
    
    return cities.filter(city => 
      city.name.toLowerCase().includes(lowercaseQuery) ||
      city.state.toLowerCase().includes(lowercaseQuery) ||
      city.country.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 10); // Limit to 10 results
  }

  /**
   * Get cities by country
   * @param {string} country - Country name
   * @returns {Array} Cities in the country
   */
  getCitiesByCountry(country) {
    const cities = this.getMajorCities();
    return cities.filter(city => 
      city.country.toLowerCase() === country.toLowerCase()
    );
  }

  /**
   * Validate location coordinates
   * @param {Object} location - Location object
   * @returns {boolean} Is valid location
   */
  isValidLocation(location) {
    return location && 
           typeof location.lat === 'number' && 
           typeof location.lng === 'number' &&
           location.lat >= -90 && location.lat <= 90 &&
           location.lng >= -180 && location.lng <= 180;
  }

  /**
   * Get user's preferred location from localStorage
   * @returns {Object|null} Saved location or null
   */
  getSavedLocation() {
    try {
      const saved = localStorage.getItem('preferred_location');
      if (saved) {
        const location = JSON.parse(saved);
        if (this.isValidLocation(location)) {
          console.log('✅ Using saved location:', location.name);
          return location;
        }
      }
    } catch (error) {
      console.log('Failed to load saved location:', error);
    }
    return null;
  }

  /**
   * Save user's preferred location to localStorage
   * @param {Object} location - Location to save
   */
  saveLocation(location) {
    try {
      if (this.isValidLocation(location)) {
        localStorage.setItem('preferred_location', JSON.stringify(location));
        console.log('✅ Location saved:', location.name);
      }
    } catch (error) {
      console.log('Failed to save location:', error);
    }
  }

  /**
   * Clear saved location
   */
  clearSavedLocation() {
    try {
      localStorage.removeItem('preferred_location');
      console.log('✅ Saved location cleared');
    } catch (error) {
      console.log('Failed to clear saved location:', error);
    }
  }

  /**
   * Get default location (Nabha, Punjab)
   * @returns {Object} Default location
   */
  getDefaultLocation() {
    const defaultCity = this.getMajorCities().find(city => city.name === 'Nabha');
    return {
      ...defaultCity,
      source: 'default'
    };
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
      return cached.data;
    }
    return null;
  }

  clearCache() {
    this.cache.clear();
    console.log('✅ Location cache cleared');
  }
}

export default new ManualLocationService();