import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.emergentagent.com', '.emergentcf.cloud', 'localhost'],
  },
  define: {
    'process.env': {
      REACT_APP_BACKEND_URL: JSON.stringify(process.env.REACT_APP_BACKEND_URL)
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@heroicons/react'],
          'utils-vendor': ['axios', 'uuid'],
          
          // Feature-based chunks
          'video-call': [
            './src/components/VideoCall.jsx',
            './src/components/VideoCallSetup.jsx',
            './src/components/TelemedicineSetup.jsx'
          ],
          'doctor-pages': [
            './src/pages/FindDoctor.jsx',
            './src/pages/DoctorDetails.jsx',
            './src/pages/Telemedicine.jsx',
            './src/pages/SpecialisedDoctor.jsx'
          ],
          'health-features': [
            './src/pages/DietGeneration.jsx',
            './src/pages/Yoga.jsx',
            './src/pages/Gym.jsx',
            './src/pages/MentalHealth.jsx',
            './src/pages/Meditation.jsx'
          ],
          'fitness-features': [
            './src/pages/YogaPractice.jsx',
            './src/pages/Jumba.jsx',
            './src/pages/ZumbaPractice.jsx',
            './src/pages/GymPractice.jsx'
          ],
          'clinic-features': [
            './src/pages/clinic/ClinicLandingPage.jsx',
            './src/pages/clinic/ClinicDashboardSimple.jsx',
            './src/pages/clinic/PatientRegistrationSimple.jsx',
            './src/pages/clinic/PatientQueueSimple.jsx',
            './src/pages/clinic/ClinicEfficiencyDashboard.jsx',
            './src/pages/clinic/ClinicSymptomTracker.jsx',
            './src/pages/clinic/ClinicAIReportsView.jsx',
            './src/pages/clinic/ClinicWorkerTraining.jsx'
          ]
        }
      }
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
