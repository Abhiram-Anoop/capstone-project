import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star, Search, Navigation, ExternalLink, Camera, Users, Filter } from 'lucide-react';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';
import GooglePlacesService from '../services/googlePlacesService';

const Clinics = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('hospital');
  const [sortBy, setSortBy] = useState('distance');
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(10); // km

  // Medical facility types
  const facilityTypes = [
    { value: 'hospital', label: 'Hospitals' },
    { value: 'doctor', label: 'Doctors' },
    { value: 'dentist', label: 'Dentists' },
    { value: 'pharmacy', label: 'Pharmacies' },
    { value: 'physiotherapist', label: 'Physiotherapy' }
  ];

  // Get user location and search hospitals
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🗺️ Getting your location...');
        const location = await GooglePlacesService.getUserLocation();
        
        setUserLocation(location);
        
        if (location.source === 'ip') {
          setError('Using approximate location. For better results, please enable GPS.');
        } else if (location.source === 'default') {
          setError('Using default location (Delhi). Please enable location access.');
        }
        
        console.log('📍 Location obtained, searching nearby hospitals...');
        await searchHospitals(location.lat, location.lng);
        
      } catch (err) {
        console.error('❌ Location error:', err);
        setError('Unable to get your location. Please check your browser settings.');
        setIsLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Search hospitals using Google Places
  const searchHospitals = async (lat, lng) => {
    try {
      setIsLoading(true);
      
      const results = await GooglePlacesService.searchMedicalFacilities(
        lat, lng, selectedType, radius * 1000
      );
      
      console.log(`✅ Found ${results.length} ${selectedType}s`);
      setHospitals(results);
      setFilteredHospitals(results);
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Failed to search for medical facilities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort hospitals
  useEffect(() => {
    let filtered = [...hospitals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort results
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredHospitals(filtered);
  }, [hospitals, searchTerm, sortBy]);

  // Handle type change
  const handleTypeChange = async (newType) => {
    setSelectedType(newType);
    if (userLocation) {
      await searchHospitals(userLocation.lat, userLocation.lng);
    }
  };

  // Handle radius change
  const handleRadiusChange = async (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      await searchHospitals(userLocation.lat, userLocation.lng);
    }
  };

  // Open directions in Google Maps
  const openDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`;
    window.open(url, '_blank');
  };

  // Render hospital card
  const renderHospitalCard = (hospital) => (
    <div key={hospital.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{hospital.distance?.toFixed(1)} km away</span>
            </div>
            {hospital.rating > 0 && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                <span>{hospital.rating.toFixed(1)} ({hospital.userRatingsTotal})</span>
              </div>
            )}
          </div>
        </div>
        {hospital.isOpen !== null && (
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            hospital.isOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {hospital.isOpen ? 'Open Now' : 'Closed'}
          </div>
        )}
      </div>

      {/* Address */}
      <div className="flex items-start mb-4">
        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-gray-600 text-sm">{hospital.address}</p>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {hospital.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-gray-400 mr-2" />
            <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline text-sm">
              {hospital.phone}
            </a>
          </div>
        )}
        {hospital.website && (
          <div className="flex items-center">
            <ExternalLink className="w-4 h-4 text-gray-400 mr-2" />
            <a 
              href={hospital.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Visit Website
            </a>
          </div>
        )}
      </div>

      {/* Photos */}
      {hospital.photos && hospital.photos.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {hospital.photos.slice(0, 3).map((photo, index) => (
            <img
              key={index}
              src={GooglePlacesService.getPhotoUrl(photo.reference, 150)}
              alt={`${hospital.name} photo ${index + 1}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Reviews */}
      {hospital.reviews && hospital.reviews.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Recent Review:</h4>
          <p className="text-sm text-gray-600 italic">"{hospital.reviews[0].text.substring(0, 100)}..."</p>
          <p className="text-xs text-gray-500 mt-1">- {hospital.reviews[0].author_name}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => openDirections(hospital)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </button>
        {hospital.phone && (
          <button
            onClick={() => window.open(`tel:${hospital.phone}`)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Phone className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Nearby Medical Facilities</h1>
          <p className="text-xl text-gray-600">Powered by Google Places - Accurate, Real-time Data</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search hospitals, clinics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {facilityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Radius Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg text-gray-600">Searching nearby facilities...</span>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {filteredHospitals.length} {facilityTypes.find(t => t.value === selectedType)?.label}
              </h2>
              {userLocation && (
                <div className="text-sm text-gray-600">
                  📍 {userLocation.city && `${userLocation.city}, `}{userLocation.country}
                </div>
              )}
            </div>

            {/* Hospital Cards */}
            {filteredHospitals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map(renderHospitalCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No facilities found</h3>
                <p className="text-gray-600">Try adjusting your search radius or location.</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Clinics;
