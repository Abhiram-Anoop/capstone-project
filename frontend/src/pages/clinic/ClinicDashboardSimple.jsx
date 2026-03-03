import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, Video, FileText, Calendar, Activity,
  AlertCircle, CheckCircle, Phone, MapPin, Settings,
  TrendingUp, Download, RefreshCw, Wifi, WifiOff,
  Bell, Plus, Search, Filter, ArrowLeft, BookOpen
} from 'lucide-react';

const ClinicDashboardSimple = () => {
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const [clinicStats] = useState({
    totalPatients: 23,
    waiting: 8,
    inConsultation: 2,
    completed: 13,
    emergency: 1,
    averageWaitTime: 25
  });

  const [patientQueue] = useState([
    {
      tokenNumber: 1,
      patientName: "राम कुमार",
      serviceType: "General Consultation",
      status: "waiting",
      priority: "emergency",
      timestamp: Date.now() - 30000
    },
    {
      tokenNumber: 2,
      patientName: "सुनीता देवी",
      serviceType: "Video Consultation",
      status: "waiting",
      priority: "normal",
      timestamp: Date.now() - 120000
    },
    {
      tokenNumber: 3,
      patientName: "अमित सिंह",
      serviceType: "Health Checkup",
      status: "in-consultation",
      priority: "normal",
      timestamp: Date.now() - 300000
    },
    {
      tokenNumber: 4,
      patientName: "प्रिया शर्मा",
      serviceType: "Vaccination",
      status: "completed",
      priority: "normal",
      timestamp: Date.now() - 600000
    }
  ]);

  const [isOnline] = useState(navigator.onLine);
  const [lastSyncTime] = useState(new Date());
  const [notifications] = useState([
    {
      id: 1,
      type: 'emergency',
      message: 'EMERGENCY: राम कुमार (Token 1)',
      timestamp: Date.now() - 30000
    },
    {
      id: 2,
      type: 'info',
      message: 'New patient added: सुनीता देवी (Token 2)',
      timestamp: Date.now() - 120000
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-consultation': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-gray-300 text-gray-800';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Clinic Dashboard</h1>
                  <p className="text-sm text-gray-600">Government Rural Health Center</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Last Sync */}
              <div className="text-sm text-gray-600">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients Today</p>
                <p className="text-2xl font-bold text-gray-900">{clinicStats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Queue</p>
                <p className="text-2xl font-bold text-yellow-600">{clinicStats.waiting}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Consultation</p>
                <p className="text-2xl font-bold text-blue-600">{clinicStats.inConsultation}</p>
              </div>
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{clinicStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Emergency Alert */}
        {clinicStats.emergency > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800 font-medium">
                {clinicStats.emergency} emergency patient(s) waiting
              </p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Patient Queue */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Patient Queue</h2>
                  <button
                    onClick={() => navigate('/clinic/registration')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Patient</span>
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                  {patientQueue.map((patient) => (
                    <div key={patient.tokenNumber} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        
                        <div className="flex items-center space-x-4">
                          {/* Token Number */}
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getPriorityColor(patient.priority)}`}>
                              {patient.tokenNumber}
                            </div>
                          </div>

                          {/* Patient Info */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{patient.patientName}</h3>
                            <p className="text-sm text-gray-600">{patient.serviceType}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                {patient.status.replace('-', ' ')}
                              </span>
                              {patient.priority === 'emergency' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {patient.status === 'waiting' && (
                            <>
                              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                Start
                              </button>
                              <button 
                                onClick={() => navigate(`/clinic/video-call/room-${Date.now()}/${patient.id}`)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Video
                              </button>
                              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                                No Show
                              </button>
                            </>
                          )}
                          
                          {patient.status === 'in-consultation' && (
                            <span className="text-blue-600 text-sm font-medium">In Progress...</span>
                          )}

                          {patient.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/clinic/registration')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Register New Patient</span>
                </button>
                
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>Medicine Inventory</span>
                </button>
                
                <button 
                  onClick={() => navigate('/clinic/symptom-tracker/demo-patient')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>AI Symptom Analysis</span>
                </button>

                <button 
                  onClick={() => navigate('/clinic/video-call/test-room/demo-patient')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Video className="w-5 h-5 text-green-600" />
                  <span>Test Video Call</span>
                </button>
                
                <button 
                  onClick={() => navigate('/clinic/ai-reports')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>AI Analysis Reports</span>
                </button>

                <button 
                  onClick={() => navigate('/clinic/efficiency')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>Efficiency Dashboard</span>
                </button>
                
                <button 
                  onClick={() => navigate('/clinic/training')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <span>Worker Training</span>
                </button>
                
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Clinic Opens:</span>
                  <span className="text-gray-900">9:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lunch Break:</span>
                  <span className="text-gray-900">1:00 - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Clinic Closes:</span>
                  <span className="text-gray-900">5:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Average Wait Time:</span>
                  <span className="text-gray-900">{clinicStats.averageWaitTime} mins</span>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg text-sm ${
                    notification.type === 'emergency' ? 'bg-red-50 text-red-800' :
                    notification.type === 'success' ? 'bg-green-50 text-green-800' :
                    notification.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {notification.type === 'emergency' && <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                      {notification.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p>{notification.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboardSimple;