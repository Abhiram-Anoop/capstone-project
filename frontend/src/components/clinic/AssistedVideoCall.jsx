import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, 
  Settings, Users, MessageCircle, Share, Volume2, VolumeX,
  User, Clock, FileText, Camera, RotateCcw
} from 'lucide-react';
import clinicStateManager from '../services/offline/clinicStateManager';
import offlineStorage from '../services/offline/offlineStorage';

const AssistedVideoCall = () => {
  const { roomId, patientId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const staffControlsRef = useRef(null);
  
  // Jitsi API state
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Call controls state
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  
  // Patient information state
  const [patientInfo, setPatientInfo] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  
  // Staff assistance state
  const [staffMode, setStaffMode] = useState('assistance'); // assistance, observation, control
  const [isRecording, setIsRecording] = useState(false);
  const [translationNeeded, setTranslationNeeded] = useState(false);
  
  // UI state
  const [showPatientInfo, setShowPatientInfo] = useState(true);
  const [showStaffControls, setShowStaffControls] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState('good');

  // Load patient information
  useEffect(() => {
    if (patientId) {
      loadPatientInfo();
    }
  }, [patientId]);

  // Initialize video call
  useEffect(() => {
    let mounted = true;

    const initializeVideoCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!jitsiContainerRef.current) {
          throw new Error('Video container not available');
        }

        // Load Jitsi Meet script
        if (!window.JitsiMeetExternalAPI) {
          await loadJitsiScript();
        }

        if (!mounted) return;

        await setupJitsiCall();
        
      } catch (error) {
        console.error('❌ Failed to initialize video call:', error);
        if (mounted) {
          setError(error.message);
          setIsLoading(false);
        }
      }
    };

    initializeVideoCall();

    return () => {
      mounted = false;
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [roomId]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Date.now() - callStartTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStartTime]);

  /**
   * Load patient information from offline storage
   */
  const loadPatientInfo = async () => {
    try {
      const patients = await offlineStorage.getPatients();
      const patient = patients.find(p => p.localId == patientId || p.serverId == patientId);
      
      if (patient) {
        setPatientInfo(patient);
        // Load previous consultations
        const consultations = await offlineStorage.getPatientConsultations(patient.localId);
        setPatientInfo(prev => ({ ...prev, previousConsultations: consultations }));
      }
    } catch (error) {
      console.error('❌ Failed to load patient info:', error);
    }
  };

  /**
   * Load Jitsi Meet external API script
   */
  const loadJitsiScript = () => {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ Jitsi script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Jitsi Meet script'));
      };

      document.head.appendChild(script);
    });
  };

  /**
   * Setup Jitsi video call with staff assistance features
   */
  const setupJitsiCall = async () => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomId || `clinic-consultation-${Date.now()}`,
      width: '100%',
      height: '500px',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false,
        enableWelcomePage: false,
        enableClosePage: false,
        toolbarButtons: [
          'microphone', 'camera', 'chat', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'recording',
          'settings', 'raisehand', 'videoquality', 'filmstrip'
        ],
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'hangup', 'chat', 'desktop',
          'raisehand', 'settings'
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#474747',
        DISABLE_PRESENCE_STATUS: true,
        MOBILE_APP_PROMO: false,
      },
      userInfo: {
        displayName: `Clinic Staff - ${patientInfo?.name || 'Patient'} Consultation`
      }
    };

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      
      // Setup event listeners
      setupJitsiEventListeners(api);
      
      setJitsiApi(api);
      setCallStartTime(Date.now());
      setIsLoading(false);
      
      console.log('✅ Jitsi call initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to setup Jitsi call:', error);
      throw error;
    }
  };

  /**
   * Setup Jitsi event listeners for staff assistance
   */
  const setupJitsiEventListeners = (api) => {
    // Call joined
    api.addEventListener('videoConferenceJoined', () => {
      console.log('📞 Call joined successfully');
      setCallStartTime(Date.now());
    });

    // Call ended
    api.addEventListener('videoConferenceLeft', () => {
      console.log('📞 Call ended');
      handleCallEnd();
    });

    // Participant joined
    api.addEventListener('participantJoined', (participant) => {
      console.log('👤 Participant joined:', participant.displayName);
    });

    // Participant left
    api.addEventListener('participantLeft', (participant) => {
      console.log('👤 Participant left:', participant.displayName);
    });

    // Audio/Video status changes
    api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
      setIsAudioMuted(muted);
    });

    api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
      setIsVideoMuted(muted);
    });

    // Screen sharing status
    api.addEventListener('screenSharingStatusChanged', ({ on }) => {
      setIsScreenSharing(on);
    });

    // Recording status
    api.addEventListener('recordingStatusChanged', ({ on }) => {
      setIsRecording(on);
    });

    // Error handling
    api.addEventListener('errorOccurred', (error) => {
      console.error('❌ Jitsi error:', error);
      setError(`Call error: ${error.message}`);
    });

    // Connection quality
    api.addEventListener('connectionQualityChanged', ({ quality }) => {
      setConnectionQuality(quality);
    });
  };

  /**
   * Handle call termination and save consultation data
   */
  const handleCallEnd = async () => {
    try {
      if (patientInfo && callStartTime) {
        // Save consultation record
        const consultationData = {
          patientId: patientInfo.localId,
          type: 'video-consultation',
          date: callStartTime,
          duration: Date.now() - callStartTime,
          notes: consultationNotes,
          staffNotes: staffNotes,
          status: 'completed',
          recordingAvailable: isRecording
        };

        await offlineStorage.saveConsultation(consultationData);
        
        // Update clinic state if patient was in queue
        const queueEntry = clinicStateManager.getCurrentQueue().find(
          p => p.patientId === patientInfo.localId
        );
        
        if (queueEntry) {
          await clinicStateManager.completeConsultation(queueEntry.tokenNumber, {
            consultationType: 'video',
            duration: Math.floor((Date.now() - callStartTime) / 1000 / 60),
            notes: consultationNotes
          });
        }

        console.log('✅ Consultation data saved successfully');
      }
      
      // Navigate back to clinic dashboard
      navigate('/clinic/dashboard');
      
    } catch (error) {
      console.error('❌ Failed to save consultation data:', error);
    }
  };

  /**
   * Staff control functions
   */
  const toggleAudio = useCallback(() => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  }, [jitsiApi]);

  const toggleVideo = useCallback(() => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  }, [jitsiApi]);

  const toggleScreenShare = useCallback(() => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleShareScreen');
    }
  }, [jitsiApi]);

  const startRecording = useCallback(() => {
    if (jitsiApi) {
      jitsiApi.executeCommand('startRecording', {
        mode: 'stream',
        dropboxToken: undefined,
        shouldShare: false
      });
    }
  }, [jitsiApi]);

  const endCall = useCallback(() => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
    }
  }, [jitsiApi]);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhoneOff className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Call Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Retry
              </button>
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Video className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  Video Consultation
                </h1>
              </div>
              
              {patientInfo && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{patientInfo.name}</span>
                  <span>•</span>
                  <span>Age: {patientInfo.age}</span>
                  <span>•</span>
                  <span>{patientInfo.village}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Call Duration */}
              {callStartTime && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-gray-700">
                    {formatDuration(callDuration)}
                  </span>
                </div>
              )}

              {/* Connection Quality */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConnectionQualityColor()}`}>
                {connectionQuality} connection
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Main Video Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Connecting to video call...</p>
                  </div>
                </div>
              ) : (
                <div ref={jitsiContainerRef} className="w-full" />
              )}
              
              {/* Staff Control Panel */}
              {!isLoading && (
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Staff Controls:</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={toggleAudio}
                          className={`p-2 rounded-full ${isAudioMuted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                        >
                          {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={toggleVideo}
                          className={`p-2 rounded-full ${isVideoMuted ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                        >
                          {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </button>
                        
                        <button
                          onClick={toggleScreenShare}
                          className={`p-2 rounded-full ${isScreenSharing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                          <Share className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={startRecording}
                          className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={endCall}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End Call</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient Information & Notes Panel */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* Patient Information */}
            {patientInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{patientInfo.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Age:</span>
                    <span className="text-sm font-medium">{patientInfo.age}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Village:</span>
                    <span className="text-sm font-medium">{patientInfo.village}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{patientInfo.phone}</span>
                  </div>

                  {patientInfo.symptoms && (
                    <div className="pt-2 border-t">
                      <span className="text-sm text-gray-600">Current Symptoms:</span>
                      <p className="text-sm mt-1 text-gray-800">{patientInfo.symptoms}</p>
                    </div>
                  )}

                  {patientInfo.previousConsultations && patientInfo.previousConsultations.length > 0 && (
                    <div className="pt-2 border-t">
                      <span className="text-sm text-gray-600">Previous Visits:</span>
                      <div className="mt-1 space-y-1">
                        {patientInfo.previousConsultations.slice(0, 3).map((consultation, idx) => (
                          <div key={idx} className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                            {new Date(consultation.date).toLocaleDateString()} - {consultation.type}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Consultation Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor's Notes:
                  </label>
                  <textarea
                    value={consultationNotes}
                    onChange={(e) => setConsultationNotes(e.target.value)}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doctor's observations and recommendations..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff Notes:
                  </label>
                  <textarea
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Staff observations, translation notes, etc..."
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setTranslationNeeded(!translationNeeded)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    translationNeeded ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {translationNeeded ? '✓ Translation Active' : 'Need Translation Help'}
                </button>
                
                <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Send Prescription
                </button>
                
                <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Schedule Follow-up
                </button>
                
                <button className="w-full text-left px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistedVideoCall;