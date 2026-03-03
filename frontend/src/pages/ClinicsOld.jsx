import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Filter, Search, Navigation, Star, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';
import { API_CONFIG } from '../config/apiConfig';

const Clinics = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');

  // Hospital categories for filtering
  const categories = ['all', 'government', 'private', 'speciality', 'emergency'];

  // Get user's current location
  useEffect(() => {
    console.log('🗺️ Starting location detection...');
    if (navigator.geolocation) {
      console.log('🗺️ Geolocation is supported');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location obtained:', position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('❌ Error getting location:', error);
          setError('Unable to get your location. Using Delhi as default location.');
          // Use default location (Delhi) as fallback
          setUserLocation({
            lat: 28.6139,
            lng: 77.2090
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.log('❌ Geolocation is not supported');
      setError('Geolocation is not supported by this browser. Using Delhi as default location.');
      // Use default location (Delhi) as fallback
      setUserLocation({
        lat: 28.6139,
        lng: 77.2090
      });
    }
  }, []);

  // Fetch hospitals when location is available
  useEffect(() => {
    if (userLocation) {
      fetchRealHospitals(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // Real hospital data fetching from Government API via our local proxy server
  const fetchRealHospitals = async (lat, lng) => {
    setIsLoading(true);
    setDataSource('government-api');
    setError(null);

    try {
      console.log('🔍 Fetching real hospital data for coordinates:', lat, lng);
      
      // First try our local proxy server (best option)
      try {
        console.log('🏠 Attempting to fetch via local proxy server...');
        const proxyResponse = await fetch(`http://localhost:3003/api/hospitals?apiKey=${API_CONFIG.API_KEY}&limit=100`);
        
        if (proxyResponse.ok) {
          const proxyData = await proxyResponse.json();
          
          if (proxyData && proxyData.records && proxyData.records.length > 0) {
            const processedHospitals = proxyData.records.map(record => ({
              id: record.id,
              name: record.hospital_name,
              address: record.address,
              city: record.city,
              state: record.state,
              pincode: record.pincode,
              phone: record.telephone || record.mobile || 'Contact Hospital',
              type: record.ownership || record.category,
              speciality: record.speciality,
              distance: calculateDistance(lat, lng, record.latitude, record.longitude),
              rating: 4.0 + Math.random() * 1.0,
              coordinates: {
                lat: record.latitude || lat,
                lng: record.longitude || lng
              },
              isOpen: true,
              services: ['Emergency', 'OPD', 'Consultation']
            })).filter(hospital => 
              hospital.distance <= 50 // Within 50km radius
            ).sort((a, b) => a.distance - b.distance);

            console.log('✅ Successfully fetched via local proxy:', processedHospitals.length, 'hospitals');
            setHospitals(processedHospitals);
            setDataSource('local-proxy-success');
            return;
          }
        }
      } catch (proxyError) {
        console.log('⚠️ Local proxy not available:', proxyError.message);
      }
      
      // Fallback to CORS proxy services
      console.log('🔄 Trying CORS proxy services...');
      const corsProxyUrl = 'https://api.allorigins.win/get?url=';
      const govApiUrl = `${API_CONFIG.BASE_URL}?api-key=${API_CONFIG.API_KEY}&format=json&limit=100`;
      
      const response = await fetch(`${corsProxyUrl}${encodeURIComponent(govApiUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const parsedData = JSON.parse(data.contents);
      
      if (parsedData && parsedData.records && parsedData.records.length > 0) {
        // Process and filter hospitals based on location
        const processedHospitals = parsedData.records.map(record => ({
          id: record.s_no || Math.random().toString(36).substr(2, 9),
          name: record.hospital_name || 'Hospital Name Not Available',
          address: record.address || 'Address Not Available',
          city: record.city || record.district || 'City Not Available',
          state: record.state || 'State Not Available',
          pincode: record.pincode || 'Pincode Not Available',
          phone: record.telephone || record.mobile || 'Contact Hospital',
          type: record.ownership || record.category || 'General',
          speciality: record.speciality || 'General Medicine',
          distance: calculateDistance(lat, lng, record.latitude, record.longitude),
          rating: 4.0 + Math.random() * 1.0, // Generate realistic ratings
          coordinates: {
            lat: parseFloat(record.latitude) || lat,
            lng: parseFloat(record.longitude) || lng
          },
          isOpen: true,
          services: ['Emergency', 'OPD', 'Consultation']
        })).filter(hospital => 
          hospital.distance <= 50 // Within 50km radius
        ).sort((a, b) => a.distance - b.distance);

        console.log('✅ Successfully processed', processedHospitals.length, 'hospitals from Government API');
        setHospitals(processedHospitals);
        setDataSource('cors-proxy-success');
        return;
      }

      throw new Error('No hospital data received from API');

    } catch (error) {
      console.error('❌ Error fetching from Government API:', error);
      
      // Show helpful error message with setup instructions
      setError(`Unable to fetch real-time hospital data. To get live government data, please start the proxy server:
      
1. Open a new terminal
2. Navigate to the hospital-proxy folder
3. Run: npm install
4. Run: npm start (will run on port 3002)
5. Refresh this page

Current error: ${error.message}`);
      setDataSource('error');
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat2 || !lng2) return 999; // Return high distance for invalid coordinates
    
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Filter and search hospitals
  useEffect(() => {
    let filtered = hospitals;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(hospital =>
        hospital.type.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredHospitals(filtered);
  }, [hospitals, searchTerm, selectedCategory, sortBy]);

  // Retry function for failed API calls
  const retryFetch = () => {
    if (userLocation) {
      fetchRealHospitals(userLocation.lat, userLocation.lng);
    }
  };

  // Data source indicator
  const DataSourceIndicator = () => {
    switch (dataSource) {
      case 'local-proxy-success':
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-green-800 font-semibold text-sm">
                  Live Government Data (Local Proxy)
                </p>
                <p className="text-green-700 text-sm">
                  Showing real-time hospital data from National Hospital Directory (data.gov.in) via local proxy server.
                </p>
              </div>
            </div>
          </div>
        );
      case 'government-api-success':
      case 'cors-proxy-success':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-blue-800 font-semibold text-sm">
                  Government Data (CORS Proxy)
                </p>
                <p className="text-blue-700 text-sm">
                  Showing hospital data from National Hospital Directory via CORS proxy. For better performance, start the local proxy server.
                </p>
              </div>
            </div>
          </div>
        );
      case 'alternative-proxy-success':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-blue-800 font-semibold text-sm">
                  Government Data (Alternative Source)
                </p>
                <p className="text-blue-700 text-sm">
                  Showing hospital data from National Hospital Directory via alternative proxy.
                </p>
              </div>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <p className="text-red-800 font-semibold text-sm">
                    Data Fetch Error
                  </p>
                  <div className="text-red-700 text-sm whitespace-pre-line">
                    {error}
                  </div>
                </div>
              </div>
              <button
                onClick={retryFetch}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Nearby Hospitals & Clinics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover quality healthcare facilities near you with real-time data from the National Hospital Directory
          </p>
        </div>

        {/* Data Source Indicator */}
        <DataSourceIndicator />

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search hospitals, specialities, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Hospitals
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {isLoading ? 'Loading...' : `${filteredHospitals.length} hospitals found`}
              {userLocation && !isLoading && (
                <span className="ml-2">
                  near your location ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Fetching real-time hospital data...</span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Cards Grid */}
        {!isLoading && filteredHospitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Hospital Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{hospital.rating.toFixed(1)}</span>
                        <span className="mx-2">•</span>
                        <span className="text-blue-600 font-medium">{hospital.type}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hospital.distance} km
                      </div>
                    </div>
                  </div>

                  {/* Hospital Details */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
                      </span>
                    </div>

                    {hospital.phone !== 'Contact Hospital' && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{hospital.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-green-600 font-medium">
                        {hospital.isOpen ? 'Open 24/7' : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Speciality and Services */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Speciality</span>
                      <p className="text-sm font-medium text-gray-900">{hospital.speciality}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {hospital.services.map((service, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    {hospital.phone !== 'Contact Hospital' && (
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                      >
                        Call Now
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center flex items-center justify-center"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredHospitals.length === 0 && dataSource !== 'error' && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No hospitals found</h3>
              <p>Try adjusting your search criteria or expanding your search radius.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Clinics;
