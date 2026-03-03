import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, User, Phone, MapPin, FileText, ArrowLeft,
  Video, Stethoscope, Activity, Heart, AlertCircle, CheckCircle,
  MoreVertical, Edit, Trash2, UserPlus
} from 'lucide-react';

const PatientQueueSimple = () => {
  const navigate = useNavigate();
  
  // Mock patient queue data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'male',
      phone: '9876543210',
      village: 'Nabha',
      symptoms: 'Fever and headache for 3 days',
      serviceType: 'consultation',
      priority: 'normal',
      status: 'waiting',
      queueNumber: 1,
      registrationTime: '09:30 AM',
      estimatedTime: '10:15 AM'
    },
    {
      id: 2,
      name: 'Sunita Devi',
      age: 32,
      gender: 'female',
      phone: '9876543211',
      village: 'Bhadson',
      symptoms: 'Severe stomach pain',
      serviceType: 'emergency',
      priority: 'emergency',
      status: 'in-consultation',
      queueNumber: 2,
      registrationTime: '09:45 AM',
      estimatedTime: '10:00 AM'
    },
    {
      id: 3,
      name: 'Gurpreet Singh',
      age: 28,
      gender: 'male',
      phone: '9876543212',
      village: 'Dhuri',
      symptoms: 'Vaccination for travel',
      serviceType: 'vaccination',
      priority: 'normal',
      status: 'waiting',
      queueNumber: 3,
      registrationTime: '10:00 AM',
      estimatedTime: '10:30 AM'
    },
    {
      id: 4,
      name: 'Harpreet Kaur',
      age: 55,
      gender: 'female',
      phone: '9876543213',
      village: 'Sanour',
      symptoms: 'High blood pressure check',
      serviceType: 'health-checkup',
      priority: 'high',
      status: 'waiting',
      queueNumber: 4,
      registrationTime: '10:15 AM',
      estimatedTime: '10:45 AM'
    },
    {
      id: 5,
      name: 'Amarjeet Singh',
      age: 62,
      gender: 'male',
      phone: '9876543214',
      village: 'Bhadaur',
      symptoms: 'Video consultation with specialist',
      serviceType: 'video-consultation',
      priority: 'normal',
      status: 'waiting',
      queueNumber: 5,
      registrationTime: '10:30 AM',
      estimatedTime: '11:00 AM'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // Service type icons and labels
  const serviceIcons = {
    'consultation': { icon: Stethoscope, label: 'General Consultation', color: 'blue' },
    'video-consultation': { icon: Video, label: 'Video Consultation', color: 'purple' },
    'vaccination': { icon: Activity, label: 'Vaccination', color: 'green' },
    'health-checkup': { icon: Heart, label: 'Health Checkup', color: 'pink' },
    'medicine-collection': { icon: FileText, label: 'Medicine Collection', color: 'indigo' },
    'emergency': { icon: AlertCircle, label: 'Emergency Care', color: 'red' }
  };

  // Priority colors
  const priorityColors = {
    'normal': 'gray',
    'high': 'orange',
    'emergency': 'red'
  };

  // Status colors
  const statusColors = {
    'waiting': 'yellow',
    'in-consultation': 'blue',
    'completed': 'green',
    'no-show': 'red'
  };

  /**
   * Update patient status
   */
  const updatePatientStatus = (patientId, newStatus) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: newStatus }
        : patient
    ));
    setShowActions(null);
  };

  /**
   * Remove patient from queue
   */
  const removePatient = (patientId) => {
    setPatients(prev => prev.filter(patient => patient.id !== patientId));
    setShowActions(null);
  };

  /**
   * Get queue statistics
   */
  const getQueueStats = () => {
    const total = patients.length;
    const waiting = patients.filter(p => p.status === 'waiting').length;
    const inConsultation = patients.filter(p => p.status === 'in-consultation').length;
    const completed = patients.filter(p => p.status === 'completed').length;
    
    return { total, waiting, inConsultation, completed };
  };

  const stats = getQueueStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Queue</h1>
                <p className="text-sm text-gray-600">Manage waiting patients</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/clinic/registration')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Patient</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Queue Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900">{stats.waiting}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Consultation</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inConsultation}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Queue List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Current Queue</h2>
          </div>

          {patients.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
              <p className="text-gray-600 mb-4">Add patients to the queue to get started</p>
              <button
                onClick={() => navigate('/clinic/registration')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add First Patient
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {patients.map((patient) => {
                const ServiceIcon = serviceIcons[patient.serviceType]?.icon || Stethoscope;
                const serviceColor = serviceIcons[patient.serviceType]?.color || 'blue';
                const priorityColor = priorityColors[patient.priority];
                const statusColor = statusColors[patient.status];

                return (
                  <div key={patient.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      
                      {/* Patient Info */}
                      <div className="flex items-center space-x-4">
                        {/* Queue Number */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            patient.status === 'in-consultation' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.queueNumber}
                          </div>
                        </div>

                        {/* Service Type Icon */}
                        <div className={`p-2 bg-${serviceColor}-100 rounded-lg`}>
                          <ServiceIcon className={`w-5 h-5 text-${serviceColor}-600`} />
                        </div>

                        {/* Patient Details */}
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                            
                            {/* Priority Badge */}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${priorityColor}-100 text-${priorityColor}-800`}>
                              {patient.priority.toUpperCase()}
                            </span>

                            {/* Status Badge */}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
                              {patient.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {patient.age}y, {patient.gender}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {patient.phone}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {patient.village}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mt-2">
                            <FileText className="w-4 h-4 inline mr-1" />
                            {patient.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Time Info and Actions */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm">
                          <p className="text-gray-600">Registered: {patient.registrationTime}</p>
                          <p className="text-gray-900 font-medium">Est. Time: {patient.estimatedTime}</p>
                        </div>

                        {/* Action Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === patient.id ? null : patient.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {showActions === patient.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                              <div className="py-1">
                                {patient.status === 'waiting' && (
                                  <button
                                    onClick={() => updatePatientStatus(patient.id, 'in-consultation')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    Start Consultation
                                  </button>
                                )}
                                
                                {patient.status === 'in-consultation' && (
                                  <button
                                    onClick={() => updatePatientStatus(patient.id, 'completed')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    Mark Completed
                                  </button>
                                )}

                                <button
                                  onClick={() => navigate(`/clinic/symptom-tracker/${patient.id}`)}
                                  className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 w-full text-left"
                                >
                                  <Activity className="w-4 h-4 inline mr-2" />
                                  AI Symptom Analysis
                                </button>

                                <button
                                  onClick={() => setSelectedPatient(patient)}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="w-4 h-4 inline mr-2" />
                                  Edit Details
                                </button>

                                <button
                                  onClick={() => removePatient(patient.id)}
                                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4 inline mr-2" />
                                  Remove from Queue
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/clinic/dashboard')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate('/clinic/registration')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientQueueSimple;