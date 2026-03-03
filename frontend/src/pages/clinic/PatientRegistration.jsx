import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Phone, MapPin, Calendar, FileText, Camera,
  Save, ArrowLeft, AlertCircle, CheckCircle, Users,
  Clock, Stethoscope, Heart, Activity
} from 'lucide-react';
import offlineStorage from '../../services/offline/offlineStorage';
import clinicStateManager from '../../services/offline/clinicStateManager';

const PatientRegistration = () => {
  const navigate = useNavigate();
  
  // Form state
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    village: '',
    address: '',
    symptoms: '',
    previousIllnesses: '',
    medications: '',
    emergencyContact: '',
    serviceType: 'consultation',
    priority: 'normal'
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [patientPhoto, setPatientPhoto] = useState(null);
  const [isRecordingSymptoms, setIsRecordingSymptoms] = useState(false);

  // Service types available
  const serviceTypes = [
    { value: 'consultation', label: 'General Consultation', icon: Stethoscope },
    { value: 'video-consultation', label: 'Video Consultation', icon: Camera },
    { value: 'vaccination', label: 'Vaccination', icon: Activity },
    { value: 'health-checkup', label: 'Health Checkup', icon: Heart },
    { value: 'medicine-collection', label: 'Medicine Collection', icon: FileText },
    { value: 'emergency', label: 'Emergency Care', icon: AlertCircle }
  ];

  // Villages in Nabha region (can be loaded from API/config)
  const villages = [
    'Nabha', 'Bhadson', 'Dhuri', 'Sanour', 'Bhadaur', 'Ghagga',
    'Rajpura', 'Patiala', 'Samana', 'Patran', 'Cheema', 'Sarawan'
  ];

  /**
   * Handle form input changes
   */
  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Auto-set priority for emergency service
    if (field === 'serviceType' && value === 'emergency') {
      setPatientData(prev => ({
        ...prev,
        priority: 'emergency'
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    if (!patientData.name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!patientData.age || patientData.age < 1 || patientData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!patientData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(patientData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!patientData.village.trim()) {
      newErrors.village = 'Village/City is required';
    }

    if (!patientData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe the symptoms or reason for visit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle photo capture
   */
  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPatientPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Start voice recording for symptoms (placeholder)
   */
  const startVoiceRecording = () => {
    setIsRecordingSymptoms(true);
    // Implement voice recording functionality
    // For now, just simulate recording
    setTimeout(() => {
      setIsRecordingSymptoms(false);
      // Add some placeholder recorded text
      if (!patientData.symptoms) {
        handleInputChange('symptoms', 'Symptoms recorded via voice...');
      }
    }, 3000);
  };

  /**
   * Submit patient registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare patient data
      const patientRecord = {
        ...patientData,
        registrationDate: Date.now(),
        photo: patientPhoto,
        registeredBy: 'clinic-staff', // Could be actual staff ID
        clinicId: 'GRHC_001' // From clinic config
      };

      // Save patient to offline storage
      const savedPatient = await offlineStorage.savePatient(patientRecord);

      // Add to clinic queue if it's a consultation service
      if (['consultation', 'video-consultation', 'emergency'].includes(patientData.serviceType)) {
        await clinicStateManager.addPatientToQueue(
          savedPatient,
          patientData.serviceType,
          patientData.priority
        );
      }

      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/clinic/dashboard');
      }, 2000);

    } catch (error) {
      console.error('❌ Failed to register patient:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setPatientData({
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      village: '',
      address: '',
      symptoms: '',
      previousIllnesses: '',
      medications: '',
      emergencyContact: '',
      serviceType: 'consultation',
      priority: 'normal'
    });
    setPatientPhoto(null);
    setErrors({});
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Patient Registered Successfully!</h2>
            <p className="text-gray-600 mb-6">
              {patientData.name} has been added to the system and queue.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Service: <span className="font-medium">{patientData.serviceType}</span></p>
              <p>Priority: <span className="font-medium">{patientData.priority}</span></p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Registration</h1>
                <p className="text-sm text-gray-600">Add new patient to the system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient's full name"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Age"
                  min="1"
                  max="120"
                />
                {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={patientData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={patientData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10-digit phone number"
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village/City *
                </label>
                <select
                  value={patientData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Village/City</option>
                  {villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
                {errors.village && <p className="text-red-600 text-sm mt-1">{errors.village}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={patientData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency contact number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={patientData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Medical Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Symptoms / Reason for Visit *
                </label>
                <div className="relative">
                  <textarea
                    value={patientData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe symptoms or reason for visit"
                  />
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    disabled={isRecordingSymptoms}
                    className={`absolute right-2 top-2 p-2 rounded-md ${
                      isRecordingSymptoms ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecordingSymptoms ? '🔴' : '🎤'}
                  </button>
                </div>
                {errors.symptoms && <p className="text-red-600 text-sm mt-1">{errors.symptoms}</p>}
                {isRecordingSymptoms && (
                  <p className="text-sm text-red-600 mt-1">Recording symptoms...</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Illnesses
                  </label>
                  <textarea
                    value={patientData.previousIllnesses}
                    onChange={(e) => handleInputChange('previousIllnesses', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Any previous illnesses or conditions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={patientData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Current medications (if any)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
              Service Required
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceTypes.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => handleInputChange('serviceType', service.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      patientData.serviceType === service.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      patientData.serviceType === service.value ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <h3 className="font-medium text-gray-900">{service.label}</h3>
                  </button>
                );
              })}
            </div>

            {/* Priority Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'normal', label: 'Normal', color: 'gray' },
                  { value: 'high', label: 'High', color: 'orange' },
                  { value: 'emergency', label: 'Emergency', color: 'red' }
                ].map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      patientData.priority === priority.value
                        ? `border-${priority.color}-500 bg-${priority.color}-50 text-${priority.color}-700`
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Photo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              Patient Photo (Optional)
            </h2>

            <div className="flex items-center space-x-4">
              {patientPhoto ? (
                <div className="relative">
                  <img
                    src={patientPhoto}
                    alt="Patient"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setPatientPhoto(null)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  id="patient-photo"
                />
                <label
                  htmlFor="patient-photo"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                >
                  Take Photo
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Optional: Take a photo for patient records
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Reset Form
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/clinic/dashboard')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Register Patient</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;