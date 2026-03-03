import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Filter, Search, Navigation, Star, AlertCircle, CheckCircle, ExternalLink, Users, RefreshCw, Wifi, WifiOff, Zap, Shield } from 'lucide-react';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';
import ProductionLocationService from '../services/productionLocationService';
import ProductionHospitalService from '../services/productionHospitalService';

const Clinics = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [error, setError] = useState(null);
  const [locationSource, setLocationSource] = useState('detecting');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [searchPerformance, setSearchPerformance] = useState(null);

  // Hospital types for filtering
  const hospitalTypes = ['all', 'Government', 'Private', 'Hospital', 'Clinic', 'Emergency'];
  
  // Common specialties
  const specialties = [
    'all', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 
    'Pediatrics', 'Gynecology', 'General Medicine', 'Emergency Medicine', 'Surgery'
  ];

  // Get user's current location using production service
  useEffect(() => {
    const getLocation = async () => {
      try {
        setLocationSource('detecting');
        setError(null);
        console.log('🗺️ Starting production location detection...');
        
        const startTime = Date.now();
        const location = await ProductionLocationService.getUserLocation();
        const locationTime = Date.now() - startTime;
        
        console.log('📍 Production location obtained:', location);
        setUserLocation(location);
        setLocationSource(location.source);
        
        // Get readable address for GPS locations
        if (location.source === 'gps') {
          try {
            const address = await ProductionLocationService.getAddressFromCoords(location.lat, location.lng);
            if (address) {
              setUserLocation(prev => ({ 
                ...prev, 
                address: address.formatted, 
                city: address.city || prev.city,
                area: address.area
              }));
            }
          } catch (err) {
            console.log('Address lookup failed:', err.message);
          }
        }
        
        // Set appropriate status messages
        if (location.source === 'smart_fallback') {
          setError(`Using default location (${location.city}). Enable location services for precise results.`);
        } else if (location.source === 'ipapi') {
          setError(`Using approximate location from your internet connection (${location.city}).`);
        } else if (location.source === 'gps') {
          setError(null); // Clear any previous errors for successful GPS
        }
        
        // Store performance metrics
        setSearchPerformance(prev => ({ ...prev, locationTime }));
        
      } catch (err) {
        console.error('❌ Production location detection failed:', err);
        setError('Unable to detect your location. Please check your internet connection and try again.');
        
        // Ultimate fallback
        setUserLocation({ 
          lat: 28.6139, 
          lng: 77.2090, 
          city: 'Delhi', 
          country: 'India',
          source: 'emergency_fallback' 
        });
        setLocationSource('emergency_fallback');
      }
    };

    getLocation();
    
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('📵 Connection lost');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [retryCount]);

  // Fetch hospitals when location is available
  useEffect(() => {
    if (userLocation) {
      fetchHospitals();
    }
  }, [userLocation]);

  // Search hospitals using production service
  const fetchHospitals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏥 Fetching hospitals using production Overpass service...');
      
      const startTime = Date.now();
      const options = {
        radiusKm: 15, // 15km radius for better coverage
        maxResults: 50
      };

      const hospitalData = await ProductionHospitalService.searchNearbyHospitals(
        userLocation.lat, 
        userLocation.lng, 
        options
      );

      const searchTime = Date.now() - startTime;
      setSearchPerformance(prev => ({ ...prev, hospitalSearchTime: searchTime }));

      console.log(`✅ Production search completed in ${searchTime}ms, found ${hospitalData.length} hospitals`);
      
      // Analyze data sources
      const sources = [...new Set(hospitalData.map(h => h.source))];
      const osmCount = hospitalData.filter(h => h.source === 'openstreetmap').length;
      const fallbackCount = hospitalData.filter(h => h.source === 'fallback').length;
      
      if (hospitalData.length === 0) {
        setError('No hospitals found in your area. This might be due to limited data coverage or connectivity issues.');
      } else if (fallbackCount === hospitalData.length) {
        setError('Showing sample data due to connectivity issues. Please check your internet connection for real hospital data.');
      } else if (osmCount > 0) {
        setError(null); // Clear error for successful real data
        console.log(`✅ Real data: ${osmCount} hospitals from OpenStreetMap`);
      }
      
      setHospitals(hospitalData);
      setFilteredHospitals(hospitalData);
      
    } catch (err) {
      console.error('❌ Production hospital search failed:', err);
      setError('Failed to load hospital data. Please check your internet connection and try again.');
      
      // Emergency fallback
      try {
        const fallbackData = ProductionHospitalService.getFallbackData(userLocation.lat, userLocation.lng, 15);
        setHospitals(fallbackData);
        setFilteredHospitals(fallbackData);
        console.log('🔄 Using emergency fallback data');
      } catch (fallbackErr) {
        console.error('❌ Even fallback data failed:', fallbackErr);
        setHospitals([]);
        setFilteredHospitals([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search hospitals
  useEffect(() => {
    let filtered = [...hospitals];

    // Search by name or address
    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(hospital => hospital.type === selectedType);
    }

    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(hospital =>
        hospital.specialties.some(specialty =>
          specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        )
      );
    }

    // Sort hospitals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredHospitals(filtered);
  }, [hospitals, searchTerm, selectedType, selectedSpecialty, sortBy]);

  const handleRetryLocation = async () => {
    setError(null);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
    
    try {
      console.log('🔄 Retrying location detection...');
      
      // Clear cache to force fresh location detection
      ProductionLocationService.clearCache();
      
      const location = await ProductionLocationService.getUserLocation();
      setUserLocation(location);
      setLocationSource(location.source);
      
      if (location.source === 'gps') {
        setError(null);
        console.log('✅ Retry successful - GPS location obtained');
      } else {
        setError(`Location updated using ${location.source === 'ipapi' ? 'internet connection' : 'fallback'}.`);
      }
    } catch (err) {
      console.error('❌ Retry failed:', err);
      setError('Still unable to get precise location. Using best available location.');
    } finally {
      setIsLoading(false);
    }
  };

  // Performance testing for development
  const runPerformanceTest = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧪 Running performance test...');
      
      const tests = [];
      
      // Test location service
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await ProductionLocationService.getUserLocation();
        tests.push({ type: 'location', time: Date.now() - start });
      }
      
      // Test hospital service
      for (let i = 0; i < 2; i++) {
        const start = Date.now();
        await ProductionHospitalService.searchNearbyHospitals(userLocation.lat, userLocation.lng, { radiusKm: 5 });
        tests.push({ type: 'hospital', time: Date.now() - start });
      }
      
      console.table(tests);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {locationSource === 'detecting' ? 'Detecting Your Location...' : 'Finding Nearby Hospitals'}
              </h2>
              <p className="text-gray-500 mb-4">
                {locationSource === 'detecting' 
                  ? 'Getting your location for better results...' 
                  : 'Searching multiple sources for hospital data...'
                }
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                {isOnline ? (
                  <><Wifi className="h-4 w-4" /> Online</>
                ) : (
                  <><WifiOff className="h-4 w-4" /> Offline</>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with Production Badge */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              🏥 Nearby Hospitals & Clinics
            </h1>
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4 mr-1" />
              Production Ready
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find verified healthcare facilities near you using{' '}
            <span className="font-semibold text-blue-600">ipapi.co</span> location detection and{' '}
            <span className="font-semibold text-green-600">OpenStreetMap</span> hospital data.
          </p>
          
          {/* Performance Indicator */}
          {searchPerformance && (
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
              {searchPerformance.locationTime && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Location: {searchPerformance.locationTime}ms
                </div>
              )}
              {searchPerformance.hospitalSearchTime && (
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Search: {searchPerformance.hospitalSearchTime}ms
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Location Info with Production Status */}
        {userLocation && (
          <div className={`border rounded-lg p-4 mb-6 ${
            locationSource === 'gps' 
              ? 'bg-green-50 border-green-200' 
              : locationSource === 'ipapi' 
                ? 'bg-blue-50 border-blue-200'
                : locationSource === 'smart_fallback'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className={`h-5 w-5 mr-2 ${
                  locationSource === 'gps' 
                    ? 'text-green-600' 
                    : locationSource === 'ipapi' 
                      ? 'text-blue-600'
                      : locationSource === 'smart_fallback'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                }`} />
                <div>
                  <span className={`font-medium ${
                    locationSource === 'gps' 
                      ? 'text-green-800' 
                      : locationSource === 'ipapi' 
                        ? 'text-blue-800'
                        : locationSource === 'smart_fallback'
                          ? 'text-yellow-800'
                          : 'text-red-800'
                  }`}>
                    {locationSource === 'gps' && '📍 Precise GPS location'}
                    {locationSource === 'ipapi' && '🌐 ipapi.co location'}
                    {locationSource === 'smart_fallback' && '🏠 Smart fallback location'}
                    {locationSource === 'emergency_fallback' && '⚠️ Emergency fallback'}
                    {userLocation.city && ` - ${userLocation.city}`}
                    {userLocation.region && `, ${userLocation.region}`}
                    {userLocation.country && `, ${userLocation.country}`}
                  </span>
                  {userLocation.address && locationSource === 'gps' && (
                    <div className="text-xs opacity-75 mt-1 max-w-md truncate">
                      {userLocation.address}
                    </div>
                  )}
                  {userLocation.accuracy && (
                    <div className="text-xs opacity-75 mt-1">
                      Accuracy: ~{Math.round(userLocation.accuracy / 1000)}km
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isOnline && (
                  <div className="flex items-center text-red-600 text-sm bg-red-100 px-2 py-1 rounded">
                    <WifiOff className="h-4 w-4 mr-1" />
                    Offline
                  </div>
                )}
                {isOnline && (
                  <div className="flex items-center text-green-600 text-sm bg-green-100 px-2 py-1 rounded">
                    <Wifi className="h-4 w-4 mr-1" />
                    Online
                  </div>
                )}
                {locationSource !== 'gps' && (
                  <button
                    onClick={handleRetryLocation}
                    className="flex items-center text-blue-600 hover:text-blue-800 underline text-sm bg-white px-2 py-1 rounded border"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Get precise location
                  </button>
                )}
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={runPerformanceTest}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Test Performance
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">{error}</span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Hospital Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {hospitalTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredHospitals.length}</span> hospitals
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Hospital List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              {/* Hospital Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-green-800">
                        {hospital.rating.toFixed(1)}
                      </span>
                    </div>
                    {hospital.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" title="Verified" />
                    )}
                    {hospital.source === 'openstreetmap' && (
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        OSM Verified
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm line-clamp-2">{hospital.address}</span>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {hospital.distance} km away
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    hospital.category === 'Government' 
                      ? 'bg-green-100 text-green-800' 
                      : hospital.category === 'Private'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {hospital.category || hospital.type}
                  </span>
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-2 flex-wrap">
                  {hospital.emergency && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                      🚨 Emergency
                    </span>
                  )}
                  {hospital.isOpen24x7 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      🕐 24/7
                    </span>
                  )}
                  {hospital.beds && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      🛏️ {hospital.beds} beds
                    </span>
                  )}
                  {hospital.accessibility?.wheelchair && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      ♿ Accessible
                    </span>
                  )}
                </div>
              </div>

              {/* Hospital Details */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {hospital.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-green-500 mr-2" />
                      <a 
                        href={`tel:${hospital.phone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {hospital.phone}
                      </a>
                    </div>
                  )}
                  {hospital.website && (
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 text-blue-500 mr-2" />
                      <a 
                        href={hospital.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Timings */}
                <div className="flex items-center mb-4">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {hospital.timings.isOpen24x7 ? (
                      <span className="text-green-600 font-medium">Open 24/7</span>
                    ) : (
                      hospital.timings.schedule
                    )}
                  </span>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        +{hospital.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hospital.services.map((service, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Doctors */}
                {hospital.doctors && hospital.doctors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Doctors Available:
                    </h4>
                    <div className="space-y-2">
                      {hospital.doctors.slice(0, 2).map((doctor, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                          <div className="font-medium text-gray-800">{doctor.name}</div>
                          <div className="text-gray-600">{doctor.specialty}</div>
                          <div className="text-gray-500 text-xs">{doctor.timings}</div>
                        </div>
                      ))}
                      {hospital.doctors.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{hospital.doctors.length - 2} more doctors
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Directions
                  </button>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Book Appointment
                  </button>
                </div>

                {/* Data Source & Metadata */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>Source: {
                      hospital.source === 'openstreetmap' ? '🗺️ OpenStreetMap' : 
                      hospital.source === 'fallback' ? '📝 Sample Data' : 
                      '🏥 Database'
                    }</span>
                    {hospital.lastUpdated && (
                      <span>• Updated: {new Date(hospital.lastUpdated).toLocaleDateString()}</span>
                    )}
                  </div>
                  {hospital.sourceId && (
                    <span className="text-gray-400">ID: {hospital.sourceId}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredHospitals.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No hospitals found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or expanding the search radius.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedSpecialty('all');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Clinics;
