// Simple API test for debugging
// This file is for testing the government API directly

const API_KEY = '579b464db66ec23bdd000001dd5b86bcd01643684683242f506f4c05';

async function testGovernmentAPI() {
  console.log('🧪 Testing Government API...');
  
  const testUrls = [
    `https://api.data.gov.in/resource/3630721?api-key=${API_KEY}&format=json&limit=10`,
    `https://api.data.gov.in/catalog/3630721?api-key=${API_KEY}&format=json&limit=10`,
    `https://data.gov.in/api/datastore/resource.json?resource_id=3630721&api-key=${API_KEY}&limit=10`
  ];
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n🔗 Testing URL ${i + 1}:`, url);
    
    try {
      const response = await fetch(url);
      console.log(`📊 Status:`, response.status);
      console.log(`📊 Headers:`, response.headers);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success! Data structure:`, Object.keys(data));
        console.log(`📋 Sample data:`, data);
        
        if (data.records || data.result?.records || data.data) {
          console.log(`🎉 Found hospital records!`);
          return data;
        }
      } else {
        console.log(`❌ Failed with status:`, response.status);
        const errorText = await response.text();
        console.log(`❌ Error:`, errorText);
      }
    } catch (error) {
      console.log(`💥 Network error:`, error.message);
    }
  }
  
  console.log(`😞 All API endpoints failed`);
  return null;
}

// Auto-run test when this file is loaded
testGovernmentAPI();

export { testGovernmentAPI };
