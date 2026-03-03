// Sample Hospital Database Structure for Backend
// This is what your backend API should return

export const SAMPLE_HOSPITAL_DATABASE = {
  hospitals: [
    {
      id: 'db_apollo_delhi',
      name: 'Apollo Hospital Delhi',
      address: 'Sarita Vihar, Mathura Road, New Delhi, 110076',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110076',
      coordinates: { lat: 28.5355, lng: 77.2731 },
      phone: '+91-11-2692-5858',
      email: 'info@apollodelhi.com',
      website: 'https://www.apollohospitals.com',
      type: 'Private',
      services: ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology', 'Oncology', 'Lab Tests', 'Pharmacy'],
      specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Gastroenterology'],
      rating: 4.5,
      verified: true,
      timings: {
        isOpen24x7: true,
        emergency24x7: true,
        opd: 'Mon-Sat: 8 AM - 6 PM',
        schedule: 'Emergency 24x7, OPD: Mon-Sat 8 AM - 6 PM'
      },
      doctors: [
        {
          id: 'dr_rajesh_apollo',
          name: 'Dr. Rajesh Kumar',
          specialty: 'Cardiology',
          experience: '15 years',
          qualification: 'MD, DM (Cardiology)',
          timings: 'Mon-Sat: 9 AM - 5 PM',
          consultationFee: 1000,
          available: true
        },
        {
          id: 'dr_priya_apollo',
          name: 'Dr. Priya Sharma',
          specialty: 'Neurology',
          experience: '12 years',
          qualification: 'MD, DM (Neurology)',
          timings: 'Mon-Fri: 10 AM - 6 PM',
          consultationFee: 1200,
          available: true
        }
      ],
      facilities: [
        'Free Parking',
        'Wheelchair Accessible',
        'Pharmacy',
        'Cafeteria',
        '24x7 Emergency',
        'Ambulance Service'
      ]
    },
    {
      id: 'db_aiims_delhi',
      name: 'All India Institute of Medical Sciences (AIIMS)',
      address: 'Ansari Nagar, New Delhi, 110029',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110029',
      coordinates: { lat: 28.5672, lng: 77.2100 },
      phone: '+91-11-2659-3333',
      email: 'info@aiims.ac.in',
      website: 'https://www.aiims.edu',
      type: 'Government',
      services: ['Emergency', 'ICU', 'Surgery', 'All Specialties', 'Trauma Center', 'Research'],
      specialties: ['All Medical Specialties', 'Emergency Medicine', 'Trauma Surgery', 'Research'],
      rating: 4.7,
      verified: true,
      timings: {
        isOpen24x7: true,
        emergency24x7: true,
        opd: 'Mon-Sat: 8 AM - 2 PM',
        schedule: 'Emergency 24x7, OPD: Mon-Sat 8 AM - 2 PM'
      },
      doctors: [
        {
          id: 'dr_amit_aiims',
          name: 'Dr. Amit Singh',
          specialty: 'Emergency Medicine',
          experience: '20 years',
          qualification: 'MD (Emergency Medicine)',
          timings: '24x7 Emergency',
          consultationFee: 10, // Government hospital fees
          available: true
        },
        {
          id: 'dr_sunita_aiims',
          name: 'Dr. Sunita Jain',
          specialty: 'General Surgery',
          experience: '18 years',
          qualification: 'MS (General Surgery)',
          timings: 'Mon-Fri: 8 AM - 4 PM',
          consultationFee: 10,
          available: true
        }
      ],
      facilities: [
        'Free Treatment for BPL',
        'Research Facility',
        'Teaching Hospital',
        'All Specialties Available',
        'Trauma Center',
        'Ambulance Service'
      ]
    }
  ]
};

// Backend API Endpoints Structure
export const BACKEND_API_STRUCTURE = {
  // GET /api/hospitals/search?lat=28.6139&lng=77.2090&radius=10&specialty=cardiology
  searchEndpoint: {
    method: 'GET',
    url: '/api/hospitals/search',
    params: {
      lat: 'number', // User latitude
      lng: 'number', // User longitude  
      radius: 'number', // Search radius in km
      specialty: 'string', // Optional specialty filter
      type: 'string', // Optional hospital type filter
      limit: 'number' // Max results (default 20)
    },
    response: {
      success: true,
      hospitals: 'Array of hospital objects',
      total: 'Total count',
      searchParams: 'Used search parameters'
    }
  },

  // POST /api/hospitals/doctors
  doctorsEndpoint: {
    method: 'POST',
    url: '/api/hospitals/doctors',
    body: {
      hospitalIds: ['array of hospital IDs']
    },
    response: {
      'hospital_id': {
        doctors: 'Array of doctor objects',
        specialties: 'Array of available specialties',
        timings: 'Hospital timing information'
      }
    }
  }
};

export default SAMPLE_HOSPITAL_DATABASE;
