// Test script for OpenStreetMap API functionality
import reliableHospitalService from '../services/reliableHospitalService.js';
import manualLocationService from '../services/manualLocationService.js';

// Test functions
class APITester {
  constructor() {
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      type
    };
    
    this.results.push(logEntry);
    
    const prefix = {
      'info': '📋',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️'
    }[type] || '📋';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testLocationService() {
    this.log('Testing Manual Location Service...', 'info');
    
    try {
      // Test predefined cities
      const cities = manualLocationService.getMajorCities();
      this.log(`Found ${cities.length} predefined cities`, 'success');
      
      // Test city search
      const searchResults = manualLocationService.searchCities('Delhi');
      this.log(`Search for 'Delhi' returned ${searchResults.length} results`, 'success');
      
      // Test geocoding
      const geocoded = await manualLocationService.geocodeLocation('Mumbai');
      this.log(`Geocoded Mumbai: ${geocoded.lat}, ${geocoded.lng}`, 'success');
      
      return true;
    } catch (error) {
      this.log(`Location Service Test Failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testHospitalService() {
    this.log('Testing Reliable Hospital Service...', 'info');
    
    try {
      // Test Delhi coordinates
      const delhiLat = 28.6139;
      const delhiLng = 77.2090;
      
      this.log(`Searching hospitals near Delhi (${delhiLat}, ${delhiLng})...`, 'info');
      
      const hospitals = await reliableHospitalService.searchNearbyHospitals(
        delhiLat, 
        delhiLng, 
        10, 
        { maxResults: 20 }
      );
      
      this.log(`Found ${hospitals.length} hospitals near Delhi`, 'success');
      
      if (hospitals.length > 0) {
        const firstHospital = hospitals[0];
        this.log(`First result: ${firstHospital.name} (${firstHospital.type}) - ${firstHospital.distance}km away`, 'info');
      }
      
      // Test Mumbai coordinates
      const mumbaiLat = 19.0760;
      const mumbaiLng = 72.8777;
      
      this.log(`Searching hospitals near Mumbai (${mumbaiLat}, ${mumbaiLng})...`, 'info');
      
      const mumbaiHospitals = await reliableHospitalService.searchNearbyHospitals(
        mumbaiLat, 
        mumbaiLng, 
        5
      );
      
      this.log(`Found ${mumbaiHospitals.length} hospitals near Mumbai`, 'success');
      
      return true;
    } catch (error) {
      this.log(`Hospital Service Test Failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testInvalidCoordinates() {
    this.log('Testing error handling with invalid coordinates...', 'info');
    
    try {
      const results = await reliableHospitalService.searchNearbyHospitals(
        999, // Invalid latitude
        999, // Invalid longitude
        10
      );
      
      this.log('Invalid coordinates test failed - should have thrown error', 'error');
      return false;
    } catch (error) {
      this.log(`Correctly handled invalid coordinates: ${error.message}`, 'success');
      return true;
    }
  }

  async testFallbackFunctionality() {
    this.log('Testing fallback functionality...', 'info');
    
    try {
      // This should trigger fallback mechanisms
      const fallbackResults = await reliableHospitalService.getFallbackResults(
        28.6139, 
        77.2090, 
        10
      );
      
      this.log(`Fallback returned ${fallbackResults.length} emergency contacts`, 'success');
      
      if (fallbackResults.length > 0) {
        const emergency = fallbackResults[0];
        this.log(`Emergency contact: ${emergency.name} - ${emergency.phone}`, 'info');
      }
      
      return true;
    } catch (error) {
      this.log(`Fallback test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async runAllTests() {
    this.log('Starting comprehensive API tests...', 'info');
    
    const tests = [
      { name: 'Location Service', fn: () => this.testLocationService() },
      { name: 'Hospital Service', fn: () => this.testHospitalService() },
      { name: 'Invalid Coordinates', fn: () => this.testInvalidCoordinates() },
      { name: 'Fallback Functionality', fn: () => this.testFallbackFunctionality() }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
      this.log(`\n--- Running ${test.name} Test ---`, 'info');
      
      try {
        const result = await test.fn();
        if (result) {
          passed++;
          this.log(`${test.name} Test: PASSED`, 'success');
        } else {
          failed++;
          this.log(`${test.name} Test: FAILED`, 'error');
        }
      } catch (error) {
        failed++;
        this.log(`${test.name} Test: FAILED - ${error.message}`, 'error');
      }
    }
    
    this.log(`\n--- Test Summary ---`, 'info');
    this.log(`Total Tests: ${tests.length}`, 'info');
    this.log(`Passed: ${passed}`, 'success');
    this.log(`Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`, 'info');
    
    return {
      total: tests.length,
      passed,
      failed,
      successRate: (passed / tests.length) * 100,
      results: this.results
    };
  }
}

// Export for use in browser console
window.APITester = APITester;

// Auto-run tests when loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🧪 API Test Suite Loaded');
  console.log('Run tests with: const tester = new APITester(); await tester.runAllTests();');
});

export default APITester;