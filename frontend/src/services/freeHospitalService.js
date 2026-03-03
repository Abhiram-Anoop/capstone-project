// Free Hospital Service - Using OpenStreetMap + Custom Database
import FREE_HOSPITAL_API_CONFIG from '../config/freeHospitalApiConfig.js';

class FreeHospitalService {
  constructor() {
    this.config = FREE_HOSPITAL_API_CONFIG;
    this.cache = new Map();
  }

  // Get user's current location
  async getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve(this.getLocationFromIP()); // Fallback to IP-based location
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'gps'
          });
        },
        async (error) => {
          console.log('GPS failed, trying IP location...');
          const ipLocation = await this.getLocationFromIP();
          resolve(ipLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Get location from IP (free service with multiple fallbacks)
  async getLocationFromIP() {
    // Multiple free IP location services for better reliability
    const freeServices = [
      {
        url: 'https://ip-api.com/json/?fields=lat,lon,city,country,status',
        parser: (data) => data.status === 'success' ? data : null
      },
      {
        url: 'https://ipapi.co/json/',
        parser: (data) => data.latitude ? { lat: data.latitude, lon: data.longitude, city: data.city, country: data.country_name } : null
      },
      {
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        parser: (data) => data.latitude ? { lat: parseFloat(data.latitude), lon: parseFloat(data.longitude), city: data.city, country: data.country_name } : null
      }
    ];

    for (const service of freeServices) {
      try {
        console.log(`🌐 Trying IP location service: ${service.url.split('//')[1].split('/')[0]}`);
        const response = await fetch(service.url);
        const data = await response.json();
        const parsed = service.parser(data);
        
        if (parsed && parsed.lat && parsed.lon) {
          console.log(`✅ IP location success: ${parsed.city}, ${parsed.country}`);
          return {
            lat: parsed.lat,
            lng: parsed.lon,
            city: parsed.city,
            country: parsed.country,
            source: 'ip'
          };
        }
      } catch (error) {
        console.log(`❌ IP service failed: ${service.url.split('//')[1].split('/')[0]}`);
        continue;
      }
    }
    
    console.log('🏠 All IP services failed, using default Delhi location');
    return {
      lat: 28.6139,
      lng: 77.2090,
      city: 'Delhi',
      country: 'India',
      source: 'default'
    };
  }

  // Search hospitals using OpenStreetMap Overpass API (Free) with enhanced query
  async searchHospitalsOSM(lat, lng, radiusKm = 10) {
    try {
      const cacheKey = `osm_${lat}_${lng}_${radiusKm}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Enhanced Overpass query for better hospital coverage
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          node["amenity"="clinic"](around:${radiusKm * 1000},${lat},${lng});
          node["amenity"="doctors"](around:${radiusKm * 1000},${lat},${lng});
          node["healthcare"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          node["healthcare"="clinic"](around:${radiusKm * 1000},${lat},${lng});
          node["healthcare"="centre"](around:${radiusKm * 1000},${lat},${lng});
          node["healthcare"="doctor"](around:${radiusKm * 1000},${lat},${lng});
          way["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          way["amenity"="clinic"](around:${radiusKm * 1000},${lat},${lng});
          way["healthcare"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          way["healthcare"="clinic"](around:${radiusKm * 1000},${lat},${lng});
          relation["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          relation["healthcare"="hospital"](around:${radiusKm * 1000},${lat},${lng});
        );
        out center meta;
      `;

      console.log(`🔍 Searching OpenStreetMap within ${radiusKm}km radius...`);
      
      const response = await fetch(this.config.OVERPASS.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'AI-Doctor-Assistant/1.0'
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      const hospitals = this.processOSMResults(data.elements, lat, lng);
      
      this.setCachedData(cacheKey, hospitals);
      return hospitals;
    } catch (error) {
      console.error('OSM search failed:', error);
      return [];
    }
  }

  // Process OpenStreetMap results
  processOSMResults(elements, userLat, userLng) {
    return elements
      .filter(element => element.tags && element.tags.name) // Only elements with names
      .map(element => {
        const lat = element.lat || (element.center && element.center.lat);
        const lng = element.lon || (element.center && element.center.lon);
        
        if (!lat || !lng) return null;

        return {
          id: `osm_${element.id}`,
          name: element.tags.name,
          address: this.buildAddress(element.tags),
          location: { lat, lng },
          distance: this.calculateDistance(userLat, userLng, lat, lng),
          phone: element.tags.phone || element.tags['contact:phone'] || null,
          website: element.tags.website || element.tags['contact:website'] || null,
          email: element.tags.email || element.tags['contact:email'] || null,
          type: this.determineHospitalType(element.tags),
          specialties: this.extractSpecialties(element.tags),
          services: this.extractServices(element.tags),
          isOpen: true, // Will be enhanced with timing data
          rating: 4.0 + Math.random() * 1, // Mock rating for now
          source: 'openstreetmap',
          verified: false,
          doctors: [], // Will be populated from custom database
          timings: this.parseOpeningHours(element.tags.opening_hours)
        };
      })
      .filter(hospital => hospital !== null)
      .sort((a, b) => a.distance - b.distance);
  }

  // Search government health data (free for many countries)
  async searchGovernmentHealthData(lat, lng, radiusKm = 10) {
    try {
      // For India - using data.gov.in or other open data sources
      const governmentSources = [
        {
          name: 'India Health Data',
          url: `https://data.gov.in/api/datastore/resource.json?resource_id=hospitals-directory&filters[state]=&limit=100`,
          parser: this.parseIndiaHealthData.bind(this)
        }
        // Add more countries as needed
      ];

      for (const source of governmentSources) {
        try {
          console.log(`🏛️ Trying government data: ${source.name}`);
          const response = await fetch(source.url);
          if (response.ok) {
            const data = await response.json();
            const hospitals = source.parser(data, lat, lng, radiusKm);
            if (hospitals.length > 0) {
              console.log(`✅ Found ${hospitals.length} hospitals from ${source.name}`);
              return hospitals;
            }
          }
        } catch (error) {
          console.log(`❌ Government source failed: ${source.name}`);
          continue;
        }
      }
    } catch (error) {
      console.log('Government health data search failed:', error);
    }
    return [];
  }

  // Parse India government health data
  parseIndiaHealthData(data, userLat, userLng, radiusKm) {
    if (!data.records) return [];
    
    return data.records
      .filter(record => record.latitude && record.longitude)
      .map(record => {
        const distance = this.calculateDistance(
          userLat, userLng, 
          parseFloat(record.latitude), 
          parseFloat(record.longitude)
        );
        
        if (distance > radiusKm) return null;
        
        return {
          id: `gov_in_${record.id || Math.random()}`,
          name: record.hospital_name || record.name,
          address: record.address,
          location: { 
            lat: parseFloat(record.latitude), 
            lng: parseFloat(record.longitude) 
          },
          distance,
          phone: record.phone || record.contact_number,
          type: record.type || 'Government',
          specialties: record.specialties ? record.specialties.split(',') : [],
          source: 'government_india',
          verified: true,
          rating: 4.2,
          doctors: []
        };
      })
      .filter(hospital => hospital !== null)
      .sort((a, b) => a.distance - b.distance);
  }

  // Main search function combining multiple FREE sources
  async searchNearbyHospitals(lat, lng, options = {}) {
    const {
      radiusKm = this.config.SEARCH_CONFIG.DEFAULT_RADIUS_KM,
      specialty = null,
      maxResults = this.config.SEARCH_CONFIG.MAX_RESULTS,
      includeOSM = true,
      includeGovernment = true,
      includeMock = true
    } = options;

    try {
      console.log('🔍 Searching for hospitals near:', lat, lng);
      console.log('📍 Using 100% FREE data sources...');
      
      const searchPromises = [];

      // Search OpenStreetMap data (completely free)
      if (includeOSM) {
        console.log('🗺️ Searching OpenStreetMap...');
        searchPromises.push(this.searchHospitalsOSM(lat, lng, radiusKm));
      }

      // Search government health data (free)
      if (includeGovernment) {
        console.log('🏛️ Searching government health databases...');
        searchPromises.push(this.searchGovernmentHealthData(lat, lng, radiusKm));
      }

      // Add mock data for demonstration (free)
      if (includeMock) {
        console.log('📋 Adding sample hospital data...');
        searchPromises.push(Promise.resolve(this.getMockHospitalData(lat, lng)));
      }

      const results = await Promise.allSettled(searchPromises);
      
      // Combine results from all free sources
      const allHospitals = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allHospitals.push(...result.value);
          console.log(`✅ Source ${index + 1} returned ${result.value.length} hospitals`);
        } else {
          console.log(`❌ Source ${index + 1} failed:`, result.reason);
        }
      });

      // Remove duplicates and sort by distance
      const uniqueHospitals = this.removeDuplicates(allHospitals);
      const sortedHospitals = uniqueHospitals
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxResults);

      console.log(`🏥 Found ${sortedHospitals.length} unique hospitals`);
      return sortedHospitals;

    } catch (error) {
      console.error('Hospital search failed:', error);
      return this.getMockHospitalData(lat, lng);
    }
  }

  // Helper functions
  buildAddress(tags) {
    const parts = [];
    if (tags['addr:housename']) parts.push(tags['addr:housename']);
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  determineHospitalType(tags) {
    if (tags.operator && tags.operator.toLowerCase().includes('government')) return 'Government';
    if (tags.healthcare && tags.healthcare.includes('hospital')) return 'Hospital';
    if (tags.amenity === 'clinic') return 'Clinic';
    if (tags.emergency === 'yes') return 'Emergency';
    return 'Hospital';
  }

  extractSpecialties(tags) {
    const specialties = [];
    if (tags['healthcare:speciality']) {
      specialties.push(...tags['healthcare:speciality'].split(';'));
    }
    if (tags.speciality) {
      specialties.push(...tags.speciality.split(';'));
    }
    return specialties.length > 0 ? specialties : ['General Medicine'];
  }

  extractServices(tags) {
    const services = ['OPD', 'Consultation'];
    if (tags.emergency === 'yes') services.push('Emergency');
    if (tags.beds) services.push('Inpatient');
    if (tags['healthcare:speciality']?.includes('surgery')) services.push('Surgery');
    return services;
  }

  parseOpeningHours(openingHours) {
    if (!openingHours) {
      return {
        isOpen24x7: false,
        schedule: 'Contact hospital for timings',
        openNow: true
      };
    }

    return {
      isOpen24x7: openingHours === '24/7',
      schedule: openingHours,
      openNow: true // Would need complex parsing for exact times
    };
  }

  removeDuplicates(hospitals) {
    const seen = new Set();
    return hospitals.filter(hospital => {
      const key = `${hospital.name}_${hospital.location.lat}_${hospital.location.lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.SEARCH_CONFIG.CACHE_DURATION_MS) {
      console.log('📦 Using cached data for:', key);
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock data for complete fallback
  getMockHospitalData(lat, lng) {
    return [
      {
        id: 'mock_apollo',
        name: 'Apollo Hospital',
        address: 'Sarita Vihar, New Delhi',
        location: { lat: lat + 0.02, lng: lng + 0.02 },
        distance: 2.3,
        phone: '+91-11-2692-5858',
        website: 'https://www.apollohospitals.com',
        type: 'Private',
        specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
        services: ['Emergency', 'ICU', 'Surgery', 'Lab Tests', 'Radiology'],
        isOpen: true,
        rating: 4.5,
        source: 'mock',
        verified: true,
        doctors: [
          { 
            name: 'Dr. Rajesh Kumar', 
            specialty: 'Cardiology', 
            experience: '15 years',
            timings: 'Mon-Sat: 9 AM - 5 PM'
          },
          { 
            name: 'Dr. Priya Sharma', 
            specialty: 'Neurology', 
            experience: '12 years',
            timings: 'Mon-Fri: 10 AM - 6 PM'
          }
        ],
        timings: {
          isOpen24x7: true,
          schedule: 'Open 24 hours',
          openNow: true
        }
      },
      {
        id: 'mock_aiims',
        name: 'AIIMS New Delhi',
        address: 'Ansari Nagar, New Delhi',
        location: { lat: lat - 0.01, lng: lng - 0.01 },
        distance: 1.8,
        phone: '+91-11-2659-3333',
        website: 'https://www.aiims.edu',
        type: 'Government',
        specialties: ['All Specialties', 'Emergency Medicine', 'Surgery'],
        services: ['Emergency', 'ICU', 'Surgery', 'Lab Tests', 'Trauma Center'],
        isOpen: true,
        rating: 4.7,
        source: 'mock',
        verified: true,
        doctors: [
          { 
            name: 'Dr. Amit Singh', 
            specialty: 'Emergency Medicine', 
            experience: '20 years',
            timings: '24x7 Emergency'
          },
          { 
            name: 'Dr. Sunita Jain', 
            specialty: 'General Surgery', 
            experience: '18 years',
            timings: 'Mon-Fri: 8 AM - 4 PM'
          }
        ],
        timings: {
          isOpen24x7: true,
          schedule: 'Emergency 24x7, OPD: Mon-Sat 8 AM - 2 PM',
          openNow: true
        }
      },
      {
        id: 'mock_fortis',
        name: 'Fortis Healthcare',
        address: 'Sector 62, Noida',
        location: { lat: lat + 0.03, lng: lng + 0.05 },
        distance: 4.1,
        phone: '+91-120-500-9999',
        website: 'https://www.fortishealthcare.com',
        type: 'Private',
        specialties: ['Cardiology', 'Oncology', 'Gastroenterology', 'Nephrology'],
        services: ['Emergency', 'ICU', 'Surgery', 'Dialysis', 'Pharmacy'],
        isOpen: true,
        rating: 4.3,
        source: 'mock',
        verified: true,
        doctors: [
          { 
            name: 'Dr. Vikram Malhotra', 
            specialty: 'Cardiology', 
            experience: '22 years',
            timings: 'Mon-Sat: 10 AM - 6 PM'
          },
          { 
            name: 'Dr. Meera Agarwal', 
            specialty: 'Oncology', 
            experience: '14 years',
            timings: 'Tue-Sat: 11 AM - 5 PM'
          }
        ],
        timings: {
          isOpen24x7: false,
          schedule: 'Mon-Sat: 8 AM - 8 PM, Emergency 24x7',
          openNow: true
        }
      }
    ];
  }
}

export default new FreeHospitalService();
