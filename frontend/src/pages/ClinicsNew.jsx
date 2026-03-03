import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Clock, Star, AlertCircle, Loader, Heart, Stethoscope, Search } from 'lucide-react';
import LocationSelector from '../components/LocationSelector';
import manualLocationService from '../services/manualLocationService';
import reliableHospitalService from '../services/reliableHospitalService';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';

const Clinics = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Try to load saved location on component mount
    const savedLocation = manualLocationService.getSavedLocation();
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      searchHospitals(savedLocation.lat, savedLocation.lng);
    } else {
      // Set default location to Delhi
      const defaultLocation = manualLocationService.getDefaultLocation();
      setCurrentLocation(defaultLocation);
      searchHospitals(defaultLocation.lat, defaultLocation.lng);
    }
  }, []);

  const handleLocationSelect = (location) => {
    console.log('🎯 New location selected:', location);
    setCurrentLocation(location);
    setError(null);
    searchHospitals(location.lat, location.lng);
  };

  const searchHospitals = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Searching hospitals for coordinates: ${lat}, ${lng}`);
      
      const results = await reliableHospitalService.searchNearbyHospitals(
        lat, 
        lng, 
        searchRadius,
        { maxResults: 50 }
      );
      
      console.log(`✅ Found ${results.length} hospitals`);
      setHospitals(results);
      
      if (results.length === 0) {
        setError('No medical facilities found in this area. Please try a different location or increase the search radius.');
      }
      
    } catch (err) {
      console.error('❌ Failed to search hospitals:', err);
      setError(`Failed to find hospitals: ${err.message}`);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);
    if (currentLocation) {
      searchHospitals(currentLocation.lat, currentLocation.lng);
    }
  };

  const filteredHospitals = hospitals.filter(hospital => {
    if (selectedType === 'all') return true;
    if (selectedType === 'hospital') return hospital.type.toLowerCase().includes('hospital');
    if (selectedType === 'clinic') return hospital.type.toLowerCase().includes('clinic');
    if (selectedType === 'pharmacy') return hospital.type.toLowerCase().includes('pharmacy');
    if (selectedType === 'emergency') return hospital.emergency;
    return true;
  });

  const getTypeIcon = (type) => {
    if (type.toLowerCase().includes('hospital')) 
      return <Heart className="text-red-500" size={22} />;
    if (type.toLowerCase().includes('clinic')) 
      return <Stethoscope className="text-blue-500" size={22} />;
    if (type.toLowerCase().includes('pharmacy')) 
      return <Star className="text-green-500" size={22} />;
    return <MapPin className="text-gray-500" size={22} />;
  };

  const getDistanceColor = (distance) => {
    if (distance < 2) return 'text-green-600 bg-green-50';
    if (distance < 5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTypeColor = (type) => {
    if (type.toLowerCase().includes('hospital')) return 'bg-red-50 text-red-700 border-red-200';
    if (type.toLowerCase().includes('clinic')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (type.toLowerCase().includes('pharmacy')) return 'bg-green-50 text-green-700 border-green-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Find Medical Facilities
              </h1>
              <p className="text-lg text-gray-600 mt-1">Discover hospitals, clinics, and healthcare services near you</p>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <LocationSelector 
          onLocationSelect={handleLocationSelect}
          currentLocation={currentLocation}
        />

        {/* Search Controls */}
        <div className="bg-gradient-to-r from-white to-blue-50/50 rounded-2xl shadow-xl border border-blue-100/50 p-6 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Radius */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Navigation size={14} className="text-blue-600" />
                </div>
                Search Radius: <span className="text-blue-600">{searchRadius} km</span>
              </label>
              <select
                value={searchRadius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <option value={5}>🎯 5 km - Nearby</option>
                <option value={10}>📍 10 km - Local Area</option>
                <option value={15}>🌆 15 km - City Wide</option>
                <option value={25}>🏙️ 25 km - Metro Area</option>
                <option value={50}>🌍 50 km - Extended Region</option>
              </select>
            </div>

            {/* Facility Type Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-green-100 rounded-full">
                  <Stethoscope size={14} className="text-green-600" />
                </div>
                Facility Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <option value="all">🏥 All Types</option>
                <option value="hospital">🏥 Hospitals</option>
                <option value="clinic">🏪 Clinics</option>
                <option value="pharmacy">💊 Pharmacies</option>
                <option value="emergency">🚨 Emergency Services</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={() => currentLocation && searchHospitals(currentLocation.lat, currentLocation.lng)}
                disabled={loading || !currentLocation}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Refresh Results
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {currentLocation && (
          <div className="bg-gradient-to-r from-white to-indigo-50/50 rounded-xl shadow-lg border border-indigo-100/50 p-5 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Navigation className="text-indigo-600" size={20} />
                </div>
                <div>
                  <span className="text-gray-700 font-medium">
                    Showing results near <span className="font-bold text-indigo-700">{currentLocation.name}</span>
                  </span>
                  <div className="text-sm text-gray-500">
                    📍 {currentLocation.state && `${currentLocation.state}, `}{currentLocation.country}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  {filteredHospitals.length} facilities
                </div>
                <div className="text-sm text-gray-500">
                  within {searchRadius}km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-xl p-5 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <div className="font-semibold text-red-800">Something went wrong</div>
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-12 text-center border border-blue-100/50">
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-6">
              <Loader className="animate-spin text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding Medical Facilities</h3>
            <p className="text-gray-600">Searching for the best healthcare options near you...</p>
          </div>
        )}

        {/* Hospital Results */}
        {!loading && filteredHospitals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital, index) => (
              <div
                key={hospital.id || index}
                className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100/50 hover:border-blue-200/50 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Hospital Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      {getTypeIcon(hospital.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 group-hover:text-blue-800 transition-colors duration-200">
                        {hospital.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(hospital.type)}`}>
                        {hospital.type}
                      </span>
                    </div>
                    {hospital.emergency && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm animate-pulse">
                        🚨 Emergency
                      </span>
                    )}
                  </div>

                  {/* Distance Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-gray-100 rounded-full">
                      <MapPin className="text-gray-500" size={14} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDistanceColor(hospital.distance)}`}>
                      📍 {hospital.distance} km away
                    </span>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50/70 rounded-xl p-3 mb-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {hospital.address}
                    </p>
                  </div>

                  {/* Contact Info */}
                  {hospital.phone && (
                    <div className="flex items-center gap-3 mb-4 p-2 bg-blue-50/50 rounded-lg">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <Phone className="text-blue-600" size={14} />
                      </div>
                      <a 
                        href={`tel:${hospital.phone}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors duration-200"
                      >
                        {hospital.phone}
                      </a>
                    </div>
                  )}

                  {/* Specialties */}
                  {hospital.specialties && hospital.specialties.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-200/50"
                          >
                            {specialty}
                          </span>
                        ))}
                        {hospital.specialties.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                            +{hospital.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Navigation size={16} />
                      Get Directions
                    </a>
                    {hospital.phone && (
                      <a
                        href={`tel:${hospital.phone}`}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                      >
                        <Phone size={16} />
                      </a>
                    )}
                  </div>

                  {/* Source Indicator */}
                  <div className="text-xs text-gray-400 mt-3 text-center flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>Source: {hospital.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && hospitals.length === 0 && !error && currentLocation && (
          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-12 text-center border border-blue-100/50">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-inner">
              <MapPin className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Medical Facilities Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
              We couldn't find any medical facilities in this area. 
              Try increasing the search radius or selecting a different location.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleRadiusChange(25)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                🔍 Search Wider Area (25km)
              </button>
              <button
                onClick={() => {
                  const defaultLocation = manualLocationService.getDefaultLocation();
                  setCurrentLocation(defaultLocation);
                  searchHospitals(defaultLocation.lat, defaultLocation.lng);
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                📍 Try Delhi (Default)
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Clinics;
