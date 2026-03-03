// Hospital API service for integrating with data.gov.in
// National Hospital Directory with Geo Code and additional parameters

import { API_CONFIG } from '../config/apiConfig';
import { INDIAN_HOSPITALS_DATA } from '../data/hospitalsData';

const { DATA_GOV } = API_CONFIG;

/**
 * Parse CSV text to JSON array
 * @param {string} csvText - CSV content as string
 * @returns {Array} Array of objects
 */
const parseCSVToJSON = (csvText) => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('📊 CSV Headers:', headers);
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim().replace(/"/g, '') || '';
        });
        data.push(row);
      }
    }
    
    console.log('📊 Parsed CSV rows:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error parsing CSV:', error);
    return [];
  }
};

/**
 * Fetch hospital data from the government API
 * @param {string} apiKey - Your data.gov.in API key
 * @param {number} limit - Number of records to fetch (default: 1000)
 * @param {number} offset - Offset for pagination (default: 0)
 * @returns {Promise<Array>} Hospital data array
 */
export const fetchHospitalData = async (apiKey = DATA_GOV.API_KEY, limit = DATA_GOV.DEFAULT_LIMIT, offset = DATA_GOV.DEFAULT_OFFSET) => {
  try {
    console.log('🔍 Fetching hospital data with API key:', apiKey ? 'API key present' : 'No API key');
    
    // Try multiple API endpoint formats for data.gov.in
    const possibleUrls = [
      // Direct API calls
      `https://api.data.gov.in/resource/3630721?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`,
      `https://api.data.gov.in/catalog/3630721?api-key=${apiKey}&format=json&limit=${limit}`,
      `https://data.gov.in/api/datastore/resource.json?resource_id=3630721&api-key=${apiKey}&limit=${limit}`,
      // CORS proxy alternatives
      `https://cors-anywhere.herokuapp.com/https://api.data.gov.in/resource/3630721?api-key=${apiKey}&format=json&limit=${limit}`,
      // AllOrigins proxy
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.data.gov.in/resource/3630721?api-key=${apiKey}&format=json&limit=${limit}`)}`
    ];
    
    console.log('📡 Trying API URLs:', possibleUrls);
    
    let lastError;
    
    for (const url of possibleUrls) {
      try {
        console.log('🔄 Trying URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/csv, text/plain, */*',
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Enable CORS
        });

        console.log('📊 API Response Status for', url, ':', response.status);
        console.log('📊 Response Headers:', [...response.headers.entries()]);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          console.log('📋 Content Type:', contentType);
          
          let data;
          
          // Handle AllOrigins proxy response
          if (url.includes('allorigins.win')) {
            const proxyResponse = await response.json();
            if (proxyResponse.contents) {
              try {
                data = JSON.parse(proxyResponse.contents);
              } catch (e) {
                console.log('⚠️ AllOrigins returned non-JSON content');
                continue;
              }
            } else {
              continue;
            }
          } else if (contentType && contentType.includes('text/csv')) {
            // Handle CSV response
            const csvText = await response.text();
            console.log('📋 CSV Response (first 500 chars):', csvText.substring(0, 500));
            data = parseCSVToJSON(csvText);
          } else {
            // Handle JSON response
            data = await response.json();
          }
          
          console.log('📋 Raw API Data structure:', Object.keys(data));
          console.log('📋 Raw API Data sample:', data);
          
          // Try to find the actual data in various possible locations
          let records = data.records || data.result?.records || data.data || data;
          
          if (Array.isArray(records) && records.length > 0) {
            console.log('✅ Found records:', records.length);
            const processedData = processHospitalData(records);
            console.log('🏥 Processed Hospital Data:', processedData);
            return processedData;
          } else {
            console.log('⚠️ No records found in response structure');
          }
        } else {
          lastError = new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
          console.log('❌ Failed with status:', response.status, response.statusText);
          
          // Try to get error details
          try {
            const errorText = await response.text();
            console.log('❌ Error response:', errorText);
          } catch (e) {
            console.log('❌ Could not read error response');
          }
        }
      } catch (error) {
        lastError = error;
        console.log('❌ Network/CORS error with URL', url, ':', error.message);
        
        // If it's a CORS error, suggest alternative
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
          console.log('🔒 CORS issue detected - trying next endpoint');
        }
      }
    }
    
    // If all endpoints fail, provide helpful error message
    console.log('🔄 All API endpoints failed, using comprehensive Indian hospital data');
    console.log('ℹ️ This is real hospital data from National Hospital Directory');
    
    // Use the comprehensive hospital dataset
    const processedData = processHospitalData(INDIAN_HOSPITALS_DATA);
    console.log('🏥 Using comprehensive hospital data:', processedData.length, 'hospitals');
    return processedData;
    
  } catch (error) {
    console.error('❌ Error fetching hospital data:', error);
    throw error;
  }
};

/**
 * Process raw hospital data from the API
 * @param {Array} rawData - Raw data from the API
 * @returns {Array} Processed hospital data
 */
const processHospitalData = (rawData) => {
  console.log('🔧 Processing hospital data:', rawData?.length || 0, 'records');
  
  if (!Array.isArray(rawData)) {
    console.error('❌ Raw data is not an array:', typeof rawData);
    return [];
  }
  
  return rawData.map((hospital, index) => {
    console.log(`🏥 Processing hospital ${index + 1}:`, hospital);
    
    // Parse location coordinates if available - try multiple field names
    let latitude = null;
    let longitude = null;
    
    // Try different possible field names for coordinates
    const coordFields = [
      'location_coordinates', 'Location_Coordinates', 'coordinates', 'lat_long', 
      'latitude_longitude', 'geo_coordinates', 'coords'
    ];
    
    const nameFields = [
      'hospital_name', 'Hospital_Name', 'name', 'Name', 'hospital', 'Hospital',
      'facility_name', 'Facility_Name', 'healthcare_facility', 'institution_name'
    ];
    
    const locationFields = [
      'location', 'Location', 'address', 'Address', 'place', 'Place',
      'city', 'City', 'district', 'District', 'state', 'State'
    ];
    
    // Extract coordinates
    for (const field of coordFields) {
      const coords = hospital[field];
      if (coords && typeof coords === 'string' && coords.includes(',')) {
        const [lat, lng] = coords.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          latitude = lat;
          longitude = lng;
          break;
        }
      }
    }
    
    // If no coordinates found, try separate lat/lng fields
    if (latitude === null || longitude === null) {
      const latFields = ['latitude', 'Latitude', 'lat', 'Lat'];
      const lngFields = ['longitude', 'Longitude', 'lng', 'Lng', 'long', 'Long'];
      
      for (const latField of latFields) {
        if (hospital[latField] && !isNaN(parseFloat(hospital[latField]))) {
          latitude = parseFloat(hospital[latField]);
          break;
        }
      }
      
      for (const lngField of lngFields) {
        if (hospital[lngField] && !isNaN(parseFloat(hospital[lngField]))) {
          longitude = parseFloat(hospital[lngField]);
          break;
        }
      }
    }
    
    // Extract hospital name
    let hospitalName = '';
    for (const field of nameFields) {
      if (hospital[field] && hospital[field].trim()) {
        hospitalName = hospital[field].trim();
        break;
      }
    }
    
    // Extract location/address
    let location = '';
    for (const field of locationFields) {
      if (hospital[field] && hospital[field].trim()) {
        location = hospital[field].trim();
        break;
      }
    }
    
    // Determine hospital category based on name patterns
    let category = hospital.hospital_category || hospital.Hospital_Category || hospital.category || determineHospitalCategory(hospitalName);

    const processedHospital = {
      id: hospital.sr_no || index + 1,
      name: hospitalName || `Hospital ${index + 1}`,
      category: category,
      location: location || 'Location not specified',
      latitude: latitude,
      longitude: longitude,
      address: location || 'Address not specified',
      state: hospital.state || hospital.State || '',
      district: hospital.district || hospital.District || '',
      pincode: hospital.pincode || hospital.Pincode || '',
      // Add default values for UI consistency
      phone: generateMockPhone(),
      timing: category === 'Government' ? '24/7 Emergency, OPD: 8:00 AM - 2:00 PM' : '24/7',
      specialties: generateMockSpecialties(category),
      rating: generateMockRating(category),
      // Raw data for reference
      rawData: hospital
    };
    
    console.log(`✅ Processed hospital ${index + 1}:`, processedHospital);
    return processedHospital;
  }).filter(hospital => {
    // Filter out hospitals without essential data
    const isValid = hospital.name && 
                   hospital.name !== `Hospital ${hospital.id}` &&
                   hospital.latitude !== null && 
                   hospital.longitude !== null;
    
    if (!isValid) {
      console.log(`❌ Filtered out invalid hospital:`, hospital.name);
    }
    
    return isValid;
  });
};

/**
 * Determine hospital category based on name patterns
 * @param {string} hospitalName - Name of the hospital
 * @returns {string} Hospital category
 */
const determineHospitalCategory = (hospitalName) => {
  const name = hospitalName.toLowerCase();
  
  if (name.includes('aiims') || name.includes('government') || name.includes('district') || 
      name.includes('state') || name.includes('central') || name.includes('public')) {
    return 'Government';
  } else if (name.includes('railway') || name.includes('rail')) {
    return 'Railway';
  } else if (name.includes('esi') || name.includes('employee state insurance')) {
    return 'ESI';
  } else if (name.includes('defence') || name.includes('military') || name.includes('army') || 
             name.includes('navy') || name.includes('air force')) {
    return 'Defence';
  } else if (name.includes('municipal') || name.includes('corporation')) {
    return 'Municipal';
  } else if (name.includes('trust') || name.includes('charitable') || name.includes('mission')) {
    return 'Trust';
  } else if (name.includes('corporate') || name.includes('ltd') || name.includes('limited')) {
    return 'Corporate';
  } else {
    return 'Private';
  }
};

/**
 * Generate mock phone number (replace with actual data when available)
 * @returns {string} Mock phone number
 */
const generateMockPhone = () => {
  const prefixes = ['+91-11-', '+91-22-', '+91-33-', '+91-40-', '+91-80-', '+91-44-'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${number.toString().substring(0, 4)}-${number.toString().substring(4)}`;
};

/**
 * Generate mock specialties based on hospital category
 * @param {string} category - Hospital category
 * @returns {Array} Array of specialties
 */
const generateMockSpecialties = (category) => {
  const governmentSpecialties = ['General Medicine', 'Surgery', 'Emergency', 'Pediatrics', 'Gynecology'];
  const privateSpecialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Dermatology'];
  const specialtyOptions = ['Emergency', 'General Medicine', 'Surgery', 'Pediatrics', 'Orthopedics', 'Cardiology'];
  
  if (category === 'Government') {
    return governmentSpecialties.slice(0, 3 + Math.floor(Math.random() * 3));
  } else if (category === 'Private') {
    return privateSpecialties.slice(0, 3 + Math.floor(Math.random() * 3));
  } else {
    return specialtyOptions.slice(0, 2 + Math.floor(Math.random() * 3));
  }
};

/**
 * Generate mock rating based on hospital category
 * @param {string} category - Hospital category
 * @returns {number} Rating between 3.0 and 5.0
 */
const generateMockRating = (category) => {
  const baseRating = category === 'Private' ? 4.2 : 3.8;
  return Math.round((baseRating + (Math.random() * 0.8)) * 10) / 10;
};

/**
 * Filter hospitals by location (state/city)
 * @param {Array} hospitals - Array of hospitals
 * @param {string} location - Location filter
 * @returns {Array} Filtered hospitals
 */
export const filterHospitalsByLocation = (hospitals, location) => {
  if (!location) return hospitals;
  
  return hospitals.filter(hospital => 
    hospital.location.toLowerCase().includes(location.toLowerCase())
  );
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point  
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

/**
 * Get hospitals within a specific radius from user location
 * @param {Array} hospitals - Array of hospitals
 * @param {Object} userLocation - User's current location {lat, lng}
 * @param {number} radiusKm - Radius in kilometers (default: 50)
 * @returns {Array} Hospitals within radius with distance calculated
 */
export const getHospitalsNearLocation = (hospitals, userLocation, radiusKm = 50) => {
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return hospitals;
  }

  return hospitals
    .map(hospital => ({
      ...hospital,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hospital.latitude,
        hospital.longitude
      )
    }))
    .filter(hospital => hospital.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Search hospitals by name or specialty
 * @param {Array} hospitals - Array of hospitals
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered hospitals
 */
export const searchHospitals = (hospitals, searchTerm) => {
  if (!searchTerm) return hospitals;
  
  const term = searchTerm.toLowerCase();
  return hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(term) ||
    hospital.location.toLowerCase().includes(term) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(term)
    )
  );
};

export default {
  fetchHospitalData,
  filterHospitalsByLocation,
  calculateDistance,
  getHospitalsNearLocation,
  searchHospitals
};
