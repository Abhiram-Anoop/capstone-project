// Google Places API Service - Free Tier ($200 monthly credit)
class GooglePlacesService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
  }

  // Get user's current location with high accuracy
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      console.log('🗺️ Getting precise GPS location...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('✅ GPS location obtained');
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'gps'
          });
        },
        async (error) => {
          console.log('❌ GPS failed, trying IP geolocation...');
          try {
            const ipLocation = await this.getLocationFromIP();
            resolve(ipLocation);
          } catch (ipError) {
            reject(new Error('Unable to determine location'));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    });
  }

  // Fallback IP location
  async getLocationFromIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        console.log('✅ IP location obtained:', data.city, data.country);
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          country: data.country,
          source: 'ip'
        };
      }
      throw new Error('Invalid IP location data');
    } catch (error) {
      console.log('🏠 Using default location (Delhi)');
      return {
        lat: 28.6139,
        lng: 77.2090,
        city: 'Delhi',
        country: 'India',
        source: 'default'
      };
    }
  }

  // Search nearby hospitals using Google Places API
  async searchNearbyHospitals(lat, lng, radiusMeters = 10000) {
    try {
      if (!this.apiKey) {
        throw new Error('Google Places API key not configured');
      }

      const cacheKey = `places_${lat}_${lng}_${radiusMeters}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        console.log('📋 Using cached Google Places data');
        return cached;
      }

      console.log('🔍 Searching Google Places for nearby hospitals...');

      // Google Places Nearby Search API
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.searchParams.append('location', `${lat},${lng}`);
      url.searchParams.append('radius', radiusMeters.toString());
      url.searchParams.append('type', 'hospital');
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      console.log(`✅ Found ${data.results?.length || 0} hospitals from Google Places`);

      const hospitals = await this.processGooglePlacesResults(data.results || [], lat, lng);
      
      // Cache the results
      this.setCachedData(cacheKey, hospitals);
      
      return hospitals;
    } catch (error) {
      console.error('❌ Google Places search failed:', error);
      throw error;
    }
  }

  // Process Google Places results and get detailed information
  async processGooglePlacesResults(places, userLat, userLng) {
    const hospitals = [];

    for (const place of places) {
      try {
        const hospital = {
          id: `gplaces_${place.place_id}`,
          name: place.name,
          address: place.vicinity || place.formatted_address,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          distance: this.calculateDistance(
            userLat, userLng,
            place.geometry.location.lat,
            place.geometry.location.lng
          ),
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          priceLevel: place.price_level,
          isOpen: place.opening_hours?.open_now ?? null,
          photos: place.photos ? place.photos.slice(0, 3).map(photo => ({
            reference: photo.photo_reference,
            width: photo.width,
            height: photo.height
          })) : [],
          placeId: place.place_id,
          types: place.types || [],
          source: 'google_places',
          verified: true
        };

        // Get detailed place information
        const details = await this.getPlaceDetails(place.place_id);
        if (details) {
          hospital.phone = details.formatted_phone_number;
          hospital.website = details.website;
          hospital.openingHours = details.opening_hours?.weekday_text;
          hospital.reviews = details.reviews?.slice(0, 3);
          hospital.types = details.types || hospital.types;
        }

        hospitals.push(hospital);
      } catch (error) {
        console.error('Error processing place:', place.name, error);
      }
    }

    return hospitals.sort((a, b) => a.distance - b.distance);
  }

  // Get detailed place information
  async getPlaceDetails(placeId) {
    try {
      if (!this.apiKey) return null;

      const cacheKey = `place_details_${placeId}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      url.searchParams.append('place_id', placeId);
      url.searchParams.append('fields', 'formatted_phone_number,website,opening_hours,reviews,types');
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        this.setCachedData(cacheKey, data.result);
        return data.result;
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }
    return null;
  }

  // Get photo URL from Google Places
  getPhotoUrl(photoReference, maxWidth = 400) {
    if (!this.apiKey || !photoReference) return null;
    
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  // Search for specific types of medical facilities
  async searchMedicalFacilities(lat, lng, type = 'hospital', radiusMeters = 10000) {
    const validTypes = [
      'hospital',
      'doctor',
      'dentist',
      'pharmacy',
      'physiotherapist',
      'veterinary_care'
    ];

    if (!validTypes.includes(type)) {
      type = 'hospital';
    }

    try {
      const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
      url.searchParams.append('location', `${lat},${lng}`);
      url.searchParams.append('radius', radiusMeters.toString());
      url.searchParams.append('type', type);
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return await this.processGooglePlacesResults(data.results, lat, lng);
      }
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
    }
    return [];
  }

  // Text search for hospitals
  async searchHospitalsByText(query, lat, lng, radiusMeters = 10000) {
    try {
      if (!this.apiKey) throw new Error('API key required');

      const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
      url.searchParams.append('query', `${query} hospital near me`);
      url.searchParams.append('location', `${lat},${lng}`);
      url.searchParams.append('radius', radiusMeters.toString());
      url.searchParams.append('key', this.apiKey);

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return await this.processGooglePlacesResults(data.results, lat, lng);
      }
    } catch (error) {
      console.error('Text search failed:', error);
    }
    return [];
  }

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  degToRad(deg) {
    return deg * (Math.PI/180);
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export default new GooglePlacesService();
