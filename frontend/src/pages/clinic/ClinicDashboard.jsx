import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, Video, FileText, Calendar, Activity,
  AlertCircle, CheckCircle, Phone, MapPin, Settings,
  TrendingUp, Download, RefreshCw, Wifi, WifiOff,
  Bell, Plus, Search, Filter
} from 'lucide-react';
import clinicStateManager from '../../services/offline/clinicStateManager';
import offlineStorage from '../../services/offline/offlineStorage';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [clinicStats, setClinicStats] = useState({});
  const [patientQueue, setPatientQueue] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedView, setSelectedView] = useState('dashboard'); // dashboard, queue, patients, reports
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load initial data
  useEffect(() => {
    initializeDashboard();
    setupEventListeners();
    
    // Refresh data every 30 seconds
    const interval = setInterval(refreshDashboardData, 30000);
    
    return () => {
      clearInterval(interval);
      removeEventListeners();
    };
  }, []);

  /**
   * Initialize dashboard with data
   */
  const initializeDashboard = async () => {
    try {
      await refreshDashboardData();
      console.log('✅ Clinic dashboard initialized');
    } catch (error) {
      console.error('❌ Failed to initialize dashboard:', error);
    }
  };

  /**
   * Setup event listeners for real-time updates
   */
  const setupEventListeners = () => {
    // Listen to clinic state changes
    clinicStateManager.on('queueUpdated', handleQueueUpdate);
    clinicStateManager.on('patientAdded', handlePatientAdded);
    clinicStateManager.on('emergencyPatient', handleEmergencyPatient);
    clinicStateManager.on('consultationCompleted', handleConsultationCompleted);

    // Network status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  };

  /**
   * Remove event listeners
   */
  const removeEventListeners = () => {
    clinicStateManager.removeAllListeners();
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };

  /**
   * Refresh dashboard data
   */
  const refreshDashboardData = async () => {
    try {
      const [stats, queue] = await Promise.all([
        clinicStateManager.getDailyStats(),
        clinicStateManager.getCurrentQueue()
      ]);

      setClinicStats(stats);
      setPatientQueue(queue);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('❌ Failed to refresh dashboard data:', error);
    }
  };

  /**
   * Event handlers
   */
  const handleQueueUpdate = (queue) => {
    setPatientQueue(queue);
    setClinicStats(clinicStateManager.getDailyStats());
  };

  const handlePatientAdded = (patient) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: `New patient added: ${patient.patientName} (Token ${patient.tokenNumber})`,
      timestamp: Date.now()
    }]);
  };

  const handleEmergencyPatient = (patient) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'emergency',
      message: `EMERGENCY: ${patient.patientName} (Token ${patient.tokenNumber})`,
      timestamp: Date.now()
    }]);
  };

  const handleConsultationCompleted = ({ patient, consultation }) => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: `Consultation completed for ${patient.patientName}`,
      timestamp: Date.now()
    }]);
  };

  const handleOnline = () => {
    setIsOnline(true);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      message: 'Internet connection restored',
      timestamp: Date.now()
    }]);
  };

  const handleOffline = () => {
    setIsOnline(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'warning',
      message: 'Internet connection lost - operating in offline mode',
      timestamp: Date.now()
    }]);
  };

  /**
   * Patient queue actions
   */
  const startConsultation = async (tokenNumber) => {
    try {
      await clinicStateManager.startConsultation(tokenNumber);
      navigate(`/clinic/consultation/${tokenNumber}`);
    } catch (error) {
      console.error('❌ Failed to start consultation:', error);
      alert('Failed to start consultation: ' + error.message);
    }
  };

  const startVideoConsultation = async (tokenNumber) => {
    try {
      const patient = patientQueue.find(p => p.tokenNumber === tokenNumber);
      if (patient) {
        const roomId = `clinic-${Date.now()}-${tokenNumber}`;
        navigate(`/clinic/video-call/${roomId}/${patient.patientId}`);
      }
    } catch (error) {
      console.error('❌ Failed to start video consultation:', error);
    }
  };

  const markNoShow = async (tokenNumber) => {
    try {
      await clinicStateManager.updatePatientStatus(tokenNumber, 'no-show');
    } catch (error) {
      console.error('❌ Failed to mark no-show:', error);
    }
  };

  /**
   * Filter and search patients
   */
  const filteredQueue = patientQueue.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.tokenNumber.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  /**
   * Navigate to different sections
   */
  const navigateToPatientRegistration = () => {
    navigate('/clinic/register-patient');
  };

  const navigateToReports = () => {
    navigate('/clinic/reports');
  };

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
              {lastSyncTime && (
                <div className="text-sm text-gray-600">
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </div>
              )}

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
              <button 
                onClick={() => navigate('/clinic/settings')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
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
                <p className="text-2xl font-bold text-gray-900">{clinicStats.totalPatients || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Queue</p>
                <p className="text-2xl font-bold text-yellow-600">{clinicStats.waiting || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Consultation</p>
                <p className="text-2xl font-bold text-blue-600">{clinicStats.inConsultation || 0}</p>
              </div>
              <Video className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{clinicStats.completed || 0}</p>
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={navigateToPatientRegistration}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Patient</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="mt-4 flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="waiting">Waiting</option>
                    <option value="in-consultation">In Consultation</option>
                    <option value="completed">Completed</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredQueue.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No patients in queue</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredQueue.map((patient) => (
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
                                <button
                                  onClick={() => startConsultation(patient.tokenNumber)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                  Start
                                </button>
                                <button
                                  onClick={() => startVideoConsultation(patient.tokenNumber)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                >
                                  Video
                                </button>
                                <button
                                  onClick={() => markNoShow(patient.tokenNumber)}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
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
                )}
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
                  onClick={navigateToPatientRegistration}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Register New Patient</span>
                </button>
                
                <button
                  onClick={() => navigate('/clinic/medicine-inventory')}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>Medicine Inventory</span>
                </button>
                
                <button
                  onClick={navigateToReports}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>View Reports</span>
                </button>
                
                <button
                  onClick={refreshDashboardData}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
                >
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
                  <span className="text-gray-900">{clinicStats.averageWaitTime || 0} mins</span>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {notifications.slice(-5).reverse().map((notification) => (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;