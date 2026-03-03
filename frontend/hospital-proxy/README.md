# Hospital API Proxy Setup

This proxy server allows you to fetch real government hospital data from data.gov.in without CORS issues.

## Quick Setup

1. **Open a new terminal** (keep the main app running)

2. **Navigate to the proxy folder:**
   ```bash
   cd hospital-proxy
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the proxy server:**
   ```bash
   npm start
   ```

5. **The proxy will run on:** `http://localhost:3002`

6. **Refresh your React app** to see real government hospital data!

## How it works

- The proxy server runs on port 3001
- It fetches data from the Indian government's hospital API (data.gov.in)
- Handles CORS issues that browsers have with direct API calls
- Processes and enhances the hospital data
- Serves it to your React app

## Endpoints

- `GET /api/hospitals?apiKey=YOUR_API_KEY&limit=100` - Fetch hospital data
- `GET /health` - Check if the server is running
- `GET /` - Server information

## API Key

The proxy uses the API key configured in your React app's environment variables.

## Benefits

✅ **Real government data** - No more dummy data  
✅ **Location-based filtering** - Hospitals near your location  
✅ **No CORS issues** - Clean API calls  
✅ **Enhanced data** - Processed and cleaned hospital information  
✅ **Fast performance** - Direct server-to-server communication
