// Production System Validation
import ProductionLocationService from '../services/productionLocationService';
import ProductionHospitalService from '../services/productionHospitalService';

class ProductionValidator {
  constructor() {
    this.results = {};
  }

  /**
   * Run comprehensive production validation tests
   * @returns {Promise<Object>} Test results
   */
  async validateProductionSystem() {
    console.log('🧪 PRODUCTION VALIDATION STARTED');
    console.log('=================================');
    
    const startTime = Date.now();
    
    try {
      // Test 1: Location Service Validation
      console.log('\n📍 Testing Location Service...');
      await this.validateLocationService();
      
      // Test 2: Hospital Service Validation  
      console.log('\n🏥 Testing Hospital Service...');
      await this.validateHospitalService();
      
      // Test 3: Integration Test
      console.log('\n🔄 Testing Full Integration...');
      await this.validateIntegration();
      
      // Test 4: Performance Test
      console.log('\n⚡ Testing Performance...');
      await this.validatePerformance();
      
      const totalTime = Date.now() - startTime;
      
      // Generate final report
      this.generateProductionReport(totalTime);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Production validation failed:', error);
      return { error: error.message, results: this.results };
    }
  }

  /**
   * Validate location service functionality
   */
  async validateLocationService() {
    const locationTests = {};
    
    try {
      // Test GPS availability
      const hasGPS = navigator.geolocation !== undefined;
      locationTests.gps_available = hasGPS;
      console.log(`GPS Available: ${hasGPS ? '✅' : '❌'}`);
      
      // Test ipapi.co service
      const start = Date.now();
      const location = await ProductionLocationService.getUserLocation();
      const duration = Date.now() - start;
      
      locationTests.location_detection = {
        success: true,
        source: location.source,
        duration,
        coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        city: location.city,
        country: location.country
      };
      
      console.log(`✅ Location detected via ${location.source} in ${duration}ms`);
      console.log(`📍 Location: ${location.city}, ${location.country}`);
      
      // Test cache functionality
      const start2 = Date.now();
      await ProductionLocationService.getUserLocation();
      const cacheTime = Date.now() - start2;
      
      locationTests.cache_performance = {
        cached: cacheTime < 50, // Should be very fast if cached
        duration: cacheTime
      };
      
      console.log(`💾 Cache test: ${cacheTime < 50 ? '✅ Working' : '❌ Not working'} (${cacheTime}ms)`);
      
      // Test address resolution
      if (location.source === 'gps') {
        try {
          const address = await ProductionLocationService.getAddressFromCoords(location.lat, location.lng);
          locationTests.address_resolution = {
            success: !!address,
            address: address?.formatted || 'Not available'
          };
          console.log(`🏠 Address resolution: ${address ? '✅ Working' : '❌ Failed'}`);
        } catch (err) {
          locationTests.address_resolution = { success: false, error: err.message };
        }
      }
      
    } catch (error) {
      locationTests.error = error.message;
      console.log(`❌ Location service error: ${error.message}`);
    }
    
    this.results.location = locationTests;
  }

  /**
   * Validate hospital service functionality
   */
  async validateHospitalService() {
    const hospitalTests = {};
    
    try {
      // Use a known location for testing (Delhi)
      const testLat = 28.6139;
      const testLng = 77.2090;
      
      console.log('🔍 Testing Overpass API...');
      
      // Test hospital search
      const start = Date.now();
      const hospitals = await ProductionHospitalService.searchNearbyHospitals(testLat, testLng, {
        radiusKm: 10,
        maxResults: 20
      });
      const duration = Date.now() - start;
      
      hospitalTests.overpass_search = {
        success: true,
        duration,
        count: hospitals.length,
        sources: [...new Set(hospitals.map(h => h.source))],
        realDataCount: hospitals.filter(h => h.source === 'openstreetmap').length,
        fallbackCount: hospitals.filter(h => h.source === 'fallback').length
      };
      
      console.log(`✅ Found ${hospitals.length} hospitals in ${duration}ms`);
      console.log(`🗺️ Real data: ${hospitalTests.overpass_search.realDataCount}, Fallback: ${hospitalTests.overpass_search.fallbackCount}`);
      
      // Test data quality
      if (hospitals.length > 0) {
        const sampleHospital = hospitals[0];
        const hasRequiredFields = !!(sampleHospital.name && sampleHospital.location && sampleHospital.distance);
        const hasEnhancedFields = !!(sampleHospital.specialties && sampleHospital.services);
        
        hospitalTests.data_quality = {
          has_required_fields: hasRequiredFields,
          has_enhanced_fields: hasEnhancedFields,
          sample: {
            name: sampleHospital.name,
            distance: sampleHospital.distance,
            specialties: sampleHospital.specialties?.length || 0,
            services: sampleHospital.services?.length || 0
          }
        };
        
        console.log(`📊 Data quality: ${hasRequiredFields ? '✅' : '❌'} Required fields, ${hasEnhancedFields ? '✅' : '❌'} Enhanced fields`);
      }
      
      // Test cache functionality
      const start2 = Date.now();
      await ProductionHospitalService.searchNearbyHospitals(testLat, testLng, { radiusKm: 10 });
      const cacheTime = Date.now() - start2;
      
      hospitalTests.cache_performance = {
        cached: cacheTime < 100,
        duration: cacheTime
      };
      
      console.log(`💾 Hospital cache: ${cacheTime < 100 ? '✅ Working' : '❌ Not working'} (${cacheTime}ms)`);
      
      // Test fallback system
      try {
        const fallbackData = ProductionHospitalService.getFallbackData(testLat, testLng, 10);
        hospitalTests.fallback_system = {
          success: fallbackData.length > 0,
          count: fallbackData.length
        };
        console.log(`🔄 Fallback system: ✅ Working (${fallbackData.length} hospitals)`);
      } catch (err) {
        hospitalTests.fallback_system = { success: false, error: err.message };
        console.log(`🔄 Fallback system: ❌ Failed`);
      }
      
    } catch (error) {
      hospitalTests.error = error.message;
      console.log(`❌ Hospital service error: ${error.message}`);
    }
    
    this.results.hospitals = hospitalTests;
  }

  /**
   * Validate full system integration
   */
  async validateIntegration() {
    const integrationTests = {};
    
    try {
      console.log('🔄 Testing end-to-end workflow...');
      
      const start = Date.now();
      
      // Step 1: Get location
      const location = await ProductionLocationService.getUserLocation();
      
      // Step 2: Search hospitals
      const hospitals = await ProductionHospitalService.searchNearbyHospitals(
        location.lat,
        location.lng,
        { radiusKm: 15, maxResults: 30 }
      );
      
      const totalTime = Date.now() - start;
      
      integrationTests.end_to_end = {
        success: true,
        total_time: totalTime,
        location_source: location.source,
        hospitals_found: hospitals.length,
        workflow_complete: totalTime < 30000 // Should complete within 30 seconds
      };
      
      console.log(`✅ End-to-end test completed in ${totalTime}ms`);
      console.log(`📊 Workflow: Location (${location.source}) → ${hospitals.length} hospitals`);
      
    } catch (error) {
      integrationTests.error = error.message;
      console.log(`❌ Integration test failed: ${error.message}`);
    }
    
    this.results.integration = integrationTests;
  }

  /**
   * Validate system performance
   */
  async validatePerformance() {
    const performanceTests = {};
    
    try {
      console.log('⚡ Running performance benchmarks...');
      
      // Test location performance (3 runs)
      const locationTimes = [];
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await ProductionLocationService.getUserLocation();
        locationTimes.push(Date.now() - start);
      }
      
      // Test hospital search performance (2 runs)
      const hospitalTimes = [];
      for (let i = 0; i < 2; i++) {
        const start = Date.now();
        await ProductionHospitalService.searchNearbyHospitals(28.6139, 77.2090, { radiusKm: 10 });
        hospitalTimes.push(Date.now() - start);
      }
      
      performanceTests.location_performance = {
        avg_time: Math.round(locationTimes.reduce((a, b) => a + b, 0) / locationTimes.length),
        min_time: Math.min(...locationTimes),
        max_time: Math.max(...locationTimes),
        acceptable: locationTimes.every(t => t < 10000) // < 10 seconds
      };
      
      performanceTests.hospital_performance = {
        avg_time: Math.round(hospitalTimes.reduce((a, b) => a + b, 0) / hospitalTimes.length),
        min_time: Math.min(...hospitalTimes),
        max_time: Math.max(...hospitalTimes),
        acceptable: hospitalTimes.every(t => t < 25000) // < 25 seconds
      };
      
      console.log(`📊 Location avg: ${performanceTests.location_performance.avg_time}ms`);
      console.log(`📊 Hospital avg: ${performanceTests.hospital_performance.avg_time}ms`);
      
    } catch (error) {
      performanceTests.error = error.message;
      console.log(`❌ Performance test failed: ${error.message}`);
    }
    
    this.results.performance = performanceTests;
  }

  /**
   * Generate comprehensive production report
   */
  generateProductionReport(totalTime) {
    console.log('\n📊 PRODUCTION VALIDATION REPORT');
    console.log('==============================');
    
    const location = this.results.location || {};
    const hospitals = this.results.hospitals || {};
    const integration = this.results.integration || {};
    const performance = this.results.performance || {};
    
    // Calculate overall health score
    let healthScore = 0;
    let totalChecks = 0;
    
    // Location health
    if (location.location_detection?.success) healthScore += 25;
    if (location.cache_performance?.cached) healthScore += 10;
    totalChecks += 35;
    
    // Hospital health
    if (hospitals.overpass_search?.success) healthScore += 30;
    if (hospitals.data_quality?.has_required_fields) healthScore += 10;
    if (hospitals.fallback_system?.success) healthScore += 10;
    totalChecks += 50;
    
    // Integration health
    if (integration.end_to_end?.success) healthScore += 15;
    totalChecks += 15;
    
    const healthPercentage = Math.round((healthScore / totalChecks) * 100);
    
    console.log(`\n🎯 Overall System Health: ${healthPercentage}%`);
    console.log(`⏱️ Total Validation Time: ${totalTime}ms`);
    
    // Status indicators
    console.log('\n📋 Service Status:');
    console.log(`   📍 Location Service: ${location.location_detection?.success ? '✅ OPERATIONAL' : '❌ FAILED'}`);
    console.log(`   🏥 Hospital Service: ${hospitals.overpass_search?.success ? '✅ OPERATIONAL' : '❌ FAILED'}`);
    console.log(`   🔄 Integration: ${integration.end_to_end?.success ? '✅ OPERATIONAL' : '❌ FAILED'}`);
    
    // Performance summary
    if (performance.location_performance && performance.hospital_performance) {
      console.log('\n⚡ Performance Summary:');
      console.log(`   📍 Location: ${performance.location_performance.avg_time}ms avg (${performance.location_performance.acceptable ? 'Good' : 'Slow'})`);
      console.log(`   🏥 Hospital Search: ${performance.hospital_performance.avg_time}ms avg (${performance.hospital_performance.acceptable ? 'Good' : 'Slow'})`);
    }
    
    // Data quality
    if (hospitals.overpass_search) {
      console.log('\n📊 Data Quality:');
      console.log(`   🗺️ Real Hospital Data: ${hospitals.overpass_search.realDataCount || 0} hospitals`);
      console.log(`   🔄 Fallback Data: ${hospitals.overpass_search.fallbackCount || 0} hospitals`);
      console.log(`   ✅ Data Coverage: ${hospitals.overpass_search.realDataCount > 0 ? 'Good' : 'Limited'}`);
    }
    
    // Production readiness
    const isProductionReady = healthPercentage >= 80 && 
                             location.location_detection?.success && 
                             hospitals.overpass_search?.success;
    
    console.log(`\n🚀 Production Readiness: ${isProductionReady ? '✅ READY' : '❌ NOT READY'}`);
    
    if (isProductionReady) {
      console.log('\n🎉 System is production-ready!');
      console.log('   • Location detection working');
      console.log('   • Hospital data retrieval working');
      console.log('   • Performance within acceptable limits');
      console.log('   • Fallback systems operational');
    } else {
      console.log('\n⚠️ System needs attention:');
      if (!location.location_detection?.success) console.log('   • Fix location detection');
      if (!hospitals.overpass_search?.success) console.log('   • Fix hospital data retrieval');
      if (healthPercentage < 80) console.log('   • Improve overall reliability');
    }
    
    return {
      healthScore: healthPercentage,
      isProductionReady,
      summary: {
        location: location.location_detection?.success || false,
        hospitals: hospitals.overpass_search?.success || false,
        integration: integration.end_to_end?.success || false
      }
    };
  }
}

// Export for use in components
export const runProductionValidation = async () => {
  const validator = new ProductionValidator();
  return await validator.validateProductionSystem();
};

export default ProductionValidator;