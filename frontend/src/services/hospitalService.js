// Hospital Service - New implementation with multiple API support
import HOSPITAL_API_CONFIG from '../config/hospitalApiConfig.js';

class HospitalService {
  constructor() {
    this.config = HOSPITAL_API_CONFIG;
  }

  // Get user's current location
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to IP-based location or default
          resolve({
            lat: 28.6139, // Delhi default
            lng: 77.2090,
            accuracy: null,
            isDefault: true
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Search hospitals using Google Places API
  async searchHospitalsGooglePlaces(lat, lng, radius = 10000, specialty = null) {
    try {
      const keyword = specialty ? `hospital ${specialty}` : 'hospital clinic medical center';
      
      // Note: This would typically go through your backend to hide API keys
      const backendUrl = `${this.config.BACKEND.BASE_URL}/hospitals/search`;
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: { lat, lng },
          radius,
          keyword,
          specialty
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return this.processGooglePlacesResults(data.results, lat, lng);
    } catch (error) {
      console.error('Google Places API error:', error);
      throw error;
    }
  }

  // Process Google Places results
  processGooglePlacesResults(results, userLat, userLng) {
    return results.map(place => ({
      id: place.place_id,
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
      rating: place.rating || 4.0,
      totalRatings: place.user_ratings_total || 0,
      isOpen: place.opening_hours?.open_now ?? true,
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) || [],
      types: place.types || [],
      priceLevel: place.price_level || null,
      // Will be enhanced with doctor data from backend
      doctors: [],
      specialties: [],
      services: ['Emergency', 'OPD', 'Consultation'],
      timings: this.parseOpeningHours(place.opening_hours)
    }));
  }

  // Search hospitals using Foursquare (fallback)
  async searchHospitalsFoursquare(lat, lng, radius = 10000) {
    try {
      const url = `${this.config.FOURSQUARE.BASE_URL}/search`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.config.FOURSQUARE.API_KEY,
          'Accept': 'application/json'
        },
        params: new URLSearchParams({
          ll: `${lat},${lng}`,
          radius: radius,
          categories: this.config.FOURSQUARE.CATEGORIES.HOSPITALS,
          limit: 20
        })
      });

      const data = await response.json();
      return this.processFoursquareResults(data.results, lat, lng);
    } catch (error) {
      console.error('Foursquare API error:', error);
      throw error;
    }
  }

  // Main search function with fallbacks
  async searchNearbyHospitals(lat, lng, options = {}) {
    const {
      radius = this.config.SEARCH_CONFIG.DEFAULT_RADIUS_KM * 1000,
      specialty = null,
      maxResults = this.config.SEARCH_CONFIG.MAX_RESULTS
    } = options;

    try {
      // Try Google Places first
      console.log('🔍 Searching with Google Places API...');
      const hospitals = await this.searchHospitalsGooglePlaces(lat, lng, radius, specialty);
      
      // Enhance with doctor information from backend
      const enhancedHospitals = await this.enhanceWithDoctorData(hospitals);
      
      return enhancedHospitals.slice(0, maxResults);
    } catch (error) {
      console.log('⚠️ Google Places failed, trying Foursquare...');
      
      try {
        const hospitals = await this.searchHospitalsFoursquare(lat, lng, radius);
        return hospitals.slice(0, maxResults);
      } catch (fallbackError) {
        console.error('All APIs failed:', fallbackError);
        // Return mock data or cached data
        return this.getMockHospitalData(lat, lng);
      }
    }
  }

  // Enhance hospital data with doctor information from backend
  async enhanceWithDoctorData(hospitals) {
    try {
      const hospitalIds = hospitals.map(h => h.id);
      
      const response = await fetch(`${this.config.BACKEND.BASE_URL}/hospitals/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hospitalIds })
      });

      if (response.ok) {
        const doctorData = await response.json();
        
        return hospitals.map(hospital => ({
          ...hospital,
          doctors: doctorData[hospital.id]?.doctors || [],
          specialties: doctorData[hospital.id]?.specialties || [],
          timings: doctorData[hospital.id]?.timings || hospital.timings
        }));
      }
    } catch (error) {
      console.log('⚠️ Could not enhance with doctor data:', error);
    }
    
    return hospitals;
  }

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  // Parse opening hours from Google Places
  parseOpeningHours(openingHours) {
    if (!openingHours?.weekday_text) {
      return {
        isOpen24x7: false,
        schedule: 'Hours not available'
      };
    }

    return {
      isOpen24x7: openingHours.weekday_text.some(day => day.includes('24 hours')),
      schedule: openingHours.weekday_text,
      openNow: openingHours.open_now
    };
  }

  // Mock data for fallback
  getMockHospitalData(lat, lng) {
    return [
      {
        id: 'mock_1',
        name: 'City General Hospital',
        address: 'Near your location',
        location: { lat: lat + 0.01, lng: lng + 0.01 },
        distance: 1.2,
        rating: 4.2,
        totalRatings: 156,
        isOpen: true,
        phone: '+91-XXX-XXX-XXXX',
        doctors: [
          { name: 'Dr. Amit Sharma', specialty: 'Cardiology', experience: '15 years' },
          { name: 'Dr. Priya Singh', specialty: 'General Medicine', experience: '8 years' }
        ],
        specialties: ['Cardiology', 'General Medicine', 'Emergency'],
        services: ['Emergency', 'OPD', 'ICU', 'Lab Tests'],
        timings: {
          isOpen24x7: true,
          schedule: 'Open 24 hours',
          openNow: true
        }
      }
    ];
  }
}

export default new HospitalService();
