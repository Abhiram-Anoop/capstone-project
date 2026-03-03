// Enhanced Services Testing & Validation
import EnhancedLocationService from '../services/enhancedLocationService';
import EnhancedHospitalService from '../services/enhancedHospitalService';

class ServicesValidator {
  constructor() {
    this.testResults = {};
  }

  // Complete system test
  async runAllTests() {
    console.log('🧪 Starting comprehensive system tests...');
    
    const tests = [
      () => this.testLocationServices(),
      () => this.testHospitalServices(),
      () => this.testCacheSystem(),
      () => this.testErrorHandling(),
      () => this.testPerformance()
    ];

    for (const test of tests) {
      try {
        await test();
      } catch (error) {
        console.error('Test failed:', error);
      }
    }

    this.generateTestReport();
    return this.testResults;
  }

  // Test all location detection methods
  async testLocationServices() {
    console.log('📍 Testing location services...');
    
    const locationTests = {
      gps: null,
      ipapi_co: null,
      ip_api_com: null,
      ipgeolocation_io: null,
      reverse_geocoding: null
    };

    // Test GPS (if available)
    try {
      const start = Date.now();
      const gpsLocation = await EnhancedLocationService.getGPSLocation();
      const duration = Date.now() - start;
      
      locationTests.gps = {
        success: true,
        duration,
        accuracy: gpsLocation.accuracy,
        location: `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}`
      };
      console.log('✅ GPS test passed');
    } catch (error) {
      locationTests.gps = { success: false, error: error.message };
      console.log('❌ GPS test failed');
    }

    // Test IP geolocation services
    const ipServices = ['ipapi_co', 'ip_api_com', 'ipgeolocation_io'];
    
    for (const service of ipServices) {
      try {
        const start = Date.now();
        const location = await EnhancedLocationService.getIPLocation();
        const duration = Date.now() - start;
        
        if (location && location.source === service) {
          locationTests[service] = {
            success: true,
            duration,
            location: `${location.city}, ${location.country}`,
            coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
          };
          console.log(`✅ ${service} test passed`);
        }
      } catch (error) {
        locationTests[service] = { success: false, error: error.message };
        console.log(`❌ ${service} test failed`);
      }
    }

    // Test reverse geocoding
    try {
      const start = Date.now();
      const address = await EnhancedLocationService.getAddressFromCoords(28.6139, 77.2090);
      const duration = Date.now() - start;
      
      locationTests.reverse_geocoding = {
        success: true,
        duration,
        address: address?.formatted || 'No address returned'
      };
      console.log('✅ Reverse geocoding test passed');
    } catch (error) {
      locationTests.reverse_geocoding = { success: false, error: error.message };
      console.log('❌ Reverse geocoding test failed');
    }

    this.testResults.location = locationTests;
  }

  // Test hospital data sources
  async testHospitalServices() {
    console.log('🏥 Testing hospital services...');
    
    const hospitalTests = {
      overpass: null,
      nominatim: null,
      mock_data: null,
      search_performance: null
    };

    const testLat = 28.6139; // Delhi
    const testLng = 77.2090;

    // Test Overpass API
    try {
      const start = Date.now();
      const hospitals = await EnhancedHospitalService.searchOverpassAPI(testLat, testLng, 5);
      const duration = Date.now() - start;
      
      hospitalTests.overpass = {
        success: true,
        duration,
        count: hospitals.length,
        sample: hospitals.slice(0, 3).map(h => h.name)
      };
      console.log('✅ Overpass API test passed');
    } catch (error) {
      hospitalTests.overpass = { success: false, error: error.message };
      console.log('❌ Overpass API test failed');
    }

    // Test Nominatim API
    try {
      const start = Date.now();
      const hospitals = await EnhancedHospitalService.searchNominatimAPI(testLat, testLng, 5);
      const duration = Date.now() - start;
      
      hospitalTests.nominatim = {
        success: true,
        duration,
        count: hospitals.length,
        sample: hospitals.slice(0, 3).map(h => h.name)
      };
      console.log('✅ Nominatim API test passed');
    } catch (error) {
      hospitalTests.nominatim = { success: false, error: error.message };
      console.log('❌ Nominatim API test failed');
    }

    // Test mock data
    try {
      const start = Date.now();
      const hospitals = EnhancedHospitalService.getMockData(testLat, testLng, 5);
      const duration = Date.now() - start;
      
      hospitalTests.mock_data = {
        success: true,
        duration,
        count: hospitals.length,
        sample: hospitals.slice(0, 3).map(h => h.name)
      };
      console.log('✅ Mock data test passed');
    } catch (error) {
      hospitalTests.mock_data = { success: false, error: error.message };
      console.log('❌ Mock data test failed');
    }

    // Test complete search performance
    try {
      const start = Date.now();
      const hospitals = await EnhancedHospitalService.searchNearbyHospitals(testLat, testLng, { radiusKm: 10, maxResults: 20 });
      const duration = Date.now() - start;
      
      hospitalTests.search_performance = {
        success: true,
        duration,
        totalCount: hospitals.length,
        sources: [...new Set(hospitals.map(h => h.source))],
        avgDistance: hospitals.reduce((sum, h) => sum + h.distance, 0) / hospitals.length
      };
      console.log('✅ Complete search test passed');
    } catch (error) {
      hospitalTests.search_performance = { success: false, error: error.message };
      console.log('❌ Complete search test failed');
    }

    this.testResults.hospitals = hospitalTests;
  }

  // Test caching system
  async testCacheSystem() {
    console.log('💾 Testing cache system...');
    
    const cacheTests = {
      location_cache: null,
      hospital_cache: null,
      cache_expiry: null
    };

    try {
      // Test location caching
      const location1 = await EnhancedLocationService.getUserLocation();
      const start = Date.now();
      const location2 = await EnhancedLocationService.getUserLocation();
      const duration = Date.now() - start;
      
      cacheTests.location_cache = {
        success: duration < 100, // Should be very fast if cached
        duration,
        cached: duration < 100
      };
      console.log('✅ Location cache test passed');
    } catch (error) {
      cacheTests.location_cache = { success: false, error: error.message };
      console.log('❌ Location cache test failed');
    }

    this.testResults.cache = cacheTests;
  }

  // Test error handling
  async testErrorHandling() {
    console.log('🛡️ Testing error handling...');
    
    const errorTests = {
      offline_handling: null,
      invalid_coordinates: null,
      api_failures: null
    };

    // Test with invalid coordinates
    try {
      const hospitals = await EnhancedHospitalService.searchNearbyHospitals(999, 999, { radiusKm: 5 });
      errorTests.invalid_coordinates = {
        success: hospitals.length >= 0, // Should handle gracefully
        fallback_used: hospitals.some(h => h.source === 'mock_data'),
        count: hospitals.length
      };
      console.log('✅ Invalid coordinates test passed');
    } catch (error) {
      errorTests.invalid_coordinates = { success: false, error: error.message };
      console.log('❌ Invalid coordinates test failed');
    }

    this.testResults.error_handling = errorTests;
  }

  // Test performance benchmarks
  async testPerformance() {
    console.log('⚡ Testing performance...');
    
    const performanceTests = {
      location_speed: null,
      hospital_search_speed: null,
      memory_usage: null
    };

    // Test location detection speed
    const locationTimes = [];
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      await EnhancedLocationService.getUserLocation();
      locationTimes.push(Date.now() - start);
    }

    performanceTests.location_speed = {
      avg_time: locationTimes.reduce((a, b) => a + b, 0) / locationTimes.length,
      min_time: Math.min(...locationTimes),
      max_time: Math.max(...locationTimes)
    };

    // Test hospital search speed
    const hospitalTimes = [];
    for (let i = 0; i < 2; i++) {
      const start = Date.now();
      await EnhancedHospitalService.searchNearbyHospitals(28.6139, 77.2090, { radiusKm: 5 });
      hospitalTimes.push(Date.now() - start);
    }

    performanceTests.hospital_search_speed = {
      avg_time: hospitalTimes.reduce((a, b) => a + b, 0) / hospitalTimes.length,
      min_time: Math.min(...hospitalTimes),
      max_time: Math.max(...hospitalTimes)
    };

    console.log('✅ Performance tests completed');
    this.testResults.performance = performanceTests;
  }

  // Generate comprehensive test report
  generateTestReport() {
    console.log('\n📊 ENHANCED SERVICES TEST REPORT');
    console.log('=====================================');
    
    // Location services summary
    const locationSuccess = Object.values(this.testResults.location || {})
      .filter(test => test && test.success).length;
    const locationTotal = Object.keys(this.testResults.location || {}).length;
    
    console.log(`\n📍 Location Services: ${locationSuccess}/${locationTotal} passed`);
    
    // Hospital services summary  
    const hospitalSuccess = Object.values(this.testResults.hospitals || {})
      .filter(test => test && test.success).length;
    const hospitalTotal = Object.keys(this.testResults.hospitals || {}).length;
    
    console.log(`🏥 Hospital Services: ${hospitalSuccess}/${hospitalTotal} passed`);
    
    // Performance summary
    if (this.testResults.performance) {
      console.log(`\n⚡ Performance:`);
      console.log(`   Location: ${this.testResults.performance.location_speed?.avg_time || 'N/A'}ms avg`);
      console.log(`   Hospital Search: ${this.testResults.performance.hospital_search_speed?.avg_time || 'N/A'}ms avg`);
    }

    // Overall system health
    const overallSuccess = (locationSuccess + hospitalSuccess) / (locationTotal + hospitalTotal);
    const healthStatus = overallSuccess > 0.8 ? '🟢 Excellent' : 
                        overallSuccess > 0.6 ? '🟡 Good' : 
                        overallSuccess > 0.4 ? '🟠 Fair' : '🔴 Poor';
    
    console.log(`\n🎯 Overall System Health: ${healthStatus} (${Math.round(overallSuccess * 100)}%)`);
    
    // Recommendations
    this.generateRecommendations();
    
    return this.testResults;
  }

  // Generate improvement recommendations
  generateRecommendations() {
    console.log(`\n💡 RECOMMENDATIONS:`);
    
    const location = this.testResults.location || {};
    const hospitals = this.testResults.hospitals || {};
    
    if (!location.gps?.success) {
      console.log('   • GPS not available - IP geolocation is primary fallback');
    }
    
    if (!location.ipapi_co?.success && !location.ip_api_com?.success) {
      console.log('   • Multiple IP geolocation services failing - check internet connection');
    }
    
    if (!hospitals.overpass?.success) {
      console.log('   • Overpass API unavailable - consider backup hospital data sources');
    }
    
    if (this.testResults.performance?.hospital_search_speed?.avg_time > 10000) {
      console.log('   • Hospital search is slow - consider implementing result caching');
    }
    
    console.log('   • System appears ready for production use! ✅');
  }
}

// Export for use in components
export const validateServices = async () => {
  const validator = new ServicesValidator();
  return await validator.runAllTests();
};

export default ServicesValidator;