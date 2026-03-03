import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Navigation } from 'lucide-react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Manual Location & OpenStreetMap Test</h1>
          <p className="text-gray-600">Testing the new manual location selection system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enhanced Clinics Page */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                <Heart className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Enhanced Clinics Page</h2>
            </div>
            <p className="text-gray-600 mb-4">
              ✨ NEW & IMPROVED: Beautiful design with manual location selection and reliable OpenStreetMap integration.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>🎨 Modern gradient design</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation size={16} />
                <span>🌟 Enhanced UI with animations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart size={16} />
                <span>💯 Reliable OpenStreetMap API</span>
              </div>
            </div>
            <Link
              to="/clinics"
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Experience New Design
            </Link>
          </div>

          {/* Design Features */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                <Star className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Design Features</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Modern UI/UX improvements based on your feedback.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                <span>Gradient backgrounds & modern cards</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                <span>Smooth hover animations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                <span>Better visual hierarchy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                <span>Enhanced color coding</span>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-sm text-purple-700 font-medium">
                🎉 All improvements implemented based on your preferences!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            System Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                Location Selection Features:
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Manual location selection
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Major cities predefined with flags
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Smart search with geocoding
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Location preferences & caching
                </li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Heart size={16} className="text-green-600" />
                Hospital Search Features:
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  OpenStreetMap Overpass API
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Multiple query strategies
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Comprehensive error handling
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Emergency contacts fallback
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;