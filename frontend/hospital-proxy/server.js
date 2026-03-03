const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Government API proxy endpoint
app.get('/api/hospitals', async (req, res) => {
  try {
    const apiKey = req.query.apiKey;
    const limit = req.query.limit || 100;
    const format = req.query.format || 'json';
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    console.log('🔍 Fetching hospitals from government API...');
    
    const govApiUrl = `https://api.data.gov.in/resource/3630721?api-key=${apiKey}&format=${format}&limit=${limit}`;
    
    const response = await axios.get(govApiUrl);
    
    const data = response.data;
    
    console.log('✅ Successfully fetched hospital data:', data.records?.length || 0, 'records');
    
    // Process and enhance the data
    if (data && data.records) {
      const processedRecords = data.records.map(record => ({
        id: record.s_no || Math.random().toString(36).substr(2, 9),
        hospital_name: record.hospital_name || 'Hospital Name Not Available',
        address: record.address || 'Address Not Available',
        city: record.city || record.district || 'City Not Available',
        state: record.state || 'State Not Available',
        pincode: record.pincode || 'Pincode Not Available',
        telephone: record.telephone || record.mobile || null,
        mobile: record.mobile || record.telephone || null,
        ownership: record.ownership || record.category || 'General',
        category: record.category || record.ownership || 'General',
        speciality: record.speciality || 'General Medicine',
        latitude: parseFloat(record.latitude) || null,
        longitude: parseFloat(record.longitude) || null,
        // Add original record for reference
        original: record
      }));
      
      data.records = processedRecords;
    }
    
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching hospital data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch hospital data',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital API Proxy is running' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hospital API Proxy Server',
    endpoints: {
      hospitals: '/api/hospitals?apiKey=YOUR_API_KEY&limit=100',
      health: '/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Hospital API Proxy server running on port ${PORT}`);
  console.log(`📍 Access hospitals API at: http://localhost:${PORT}/api/hospitals`);
  console.log(`🔑 Don't forget to include your API key in the request`);
});
