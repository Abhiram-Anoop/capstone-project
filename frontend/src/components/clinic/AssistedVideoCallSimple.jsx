import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, 
  Settings, Users, MessageCircle, Volume2, VolumeX,
  User, Clock, FileText, ArrowLeft, Save, AlertCircle,
  CheckCircle
} from 'lucide-react';

const AssistedVideoCallSimple = () => {
  const { roomId, patientId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  
  // State management
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  
  // Call controls
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);
  
  // Patient and consultation data
  const [patientInfo] = useState({
    id: patientId || '12345',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    village: 'Nabha',
    symptoms: 'Fever and headache for 3 days',
    language: 'Punjabi'
  });
  
  const [consultationNotes, setConsultationNotes] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [connectionQuality, setConnectionQuality] = useState('good');
  
  // Jitsi configuration
  const jitsiConfig = {
    hosts: {
      domain: 'meet.jit.si',
      muc: 'conference.meet.jit.si'
    },
    bosh: '//meet.jit.si/http-bind',
    clientNode: 'http://jitsi.org/jitsimeet'
  };

  const jitsiOptions = {
    roomName: roomId || `clinic-${Date.now()}`,
    parentNode: null, // Will be set to jitsiContainerRef.current
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      enableUserRolesBasedOnToken: false,
      prejoinPageEnabled: false,
      requireDisplayName: false
    },
    interfaceConfigOverwrite: {
      TOOLBAR_BUTTONS: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
      ],
      SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      SHOW_BRAND_WATERMARK: false,
      BRAND_WATERMARK_LINK: '',
      SHOW_POWERED_BY: false,
      DEFAULT_BACKGROUND: '#474747',
      DISABLE_VIDEO_BACKGROUND: false,
      INITIAL_TOOLBAR_TIMEOUT: 20000,
      TOOLBAR_TIMEOUT: 4000,
      TOOLBAR_ALWAYS_VISIBLE: false,
      DEFAULT_LANGUAGE: 'en'
    },
    userInfo: {
      displayName: `Staff Assistant - ${patientInfo.name}`,
      email: 'clinic@nabha.gov.in'
    }
  };

  /**
   * Initialize Jitsi Meet
   */
  useEffect(() => {
    const initializeJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        // Load Jitsi Meet API
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => createJitsiMeeting();
        script.onerror = () => {
          setError('Failed to load Jitsi Meet. Please check your internet connection.');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } else {
        createJitsiMeeting();
      }
    };

    const createJitsiMeeting = () => {
      try {
        if (jitsiContainerRef.current) {
          // Clear previous instance
          jitsiContainerRef.current.innerHTML = '';
          
          const api = new window.JitsiMeetExternalAPI(
            jitsiConfig.hosts.domain,
            {
              ...jitsiOptions,
              parentNode: jitsiContainerRef.current
            }
          );

          // Set up event listeners
          setupJitsiEventListeners(api);
          setJitsiApi(api);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('❌ Failed to initialize Jitsi:', error);
        setError('Failed to initialize video call. Please try again.');
        setIsLoading(false);
      }
    };

    initializeJitsi();

    // Cleanup
    return () => {
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, []);

  /**
   * Set up Jitsi event listeners
   */
  const setupJitsiEventListeners = (api) => {
    api.addEventListener('videoConferenceJoined', () => {
      console.log('✅ Video conference joined');
      setIsCallActive(true);
      setCallStartTime(new Date());
    });

    api.addEventListener('videoConferenceLeft', () => {
      console.log('📞 Video conference ended');
      setIsCallActive(false);
      handleCallEnd();
    });

    api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
      setIsAudioMuted(muted);
    });

    api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
      setIsVideoMuted(muted);
    });

    api.addEventListener('participantJoined', (participant) => {
      console.log('👤 Participant joined:', participant);
    });

    api.addEventListener('participantLeft', (participant) => {
      console.log('👋 Participant left:', participant);
    });
  };

  /**
   * Update call duration
   */
  useEffect(() => {
    let interval;
    if (isCallActive && callStartTime) {
      interval = setInterval(() => {
        const duration = Math.floor((new Date() - callStartTime) / 1000);
        setCallDuration(duration);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, callStartTime]);

  /**
   * Format duration
   */
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle call end
   */
  const handleCallEnd = () => {
    // Save consultation data (mock implementation)
    const consultationData = {
      patientId: patientInfo.id,
      roomId,
      duration: callDuration,
      notes: consultationNotes,
      staffNotes,
      endTime: new Date().toISOString(),
      status: 'completed'
    };
    
    console.log('💾 Saving consultation data:', consultationData);
    
    // Navigate back to dashboard
    setTimeout(() => {
      navigate('/clinic/dashboard');
    }, 1000);
  };

  /**
   * End call manually
   */
  const endCall = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup');
    }
  };

  /**
   * Toggle audio mute
   */
  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  };

  /**
   * Toggle video mute
   */
  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/clinic/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">Video Consultation</h1>
              <p className="text-sm text-gray-300">
                Patient: {patientInfo.name} | Room: {roomId}
              </p>
            </div>
          </div>
          
          {isCallActive && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatDuration(callDuration)}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                connectionQuality === 'good' ? 'bg-green-500' :
                connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
          )}
        </div>
      </div>

      <div className="flex h-screen">
        {/* Video Call Area */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Connecting to Video Call...</h3>
                <p className="text-gray-300">Please wait while we set up your consultation</p>
              </div>
            </div>
          )}
          
          <div 
            ref={jitsiContainerRef}
            className="w-full h-full"
            style={{ minHeight: '600px' }}
          />

          {/* Call Controls Overlay */}
          {isCallActive && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full ${
                    isAudioMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  } text-white transition-colors`}
                >
                  {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${
                    isVideoMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  } text-white transition-colors`}
                >
                  {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Patient Info & Notes Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          {/* Patient Information */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Patient Information
            </h3>
            
            <div className="space-y-2 text-sm">
              <div><strong>Name:</strong> {patientInfo.name}</div>
              <div><strong>Age:</strong> {patientInfo.age} years</div>
              <div><strong>Gender:</strong> {patientInfo.gender}</div>
              <div><strong>Phone:</strong> {patientInfo.phone}</div>
              <div><strong>Village:</strong> {patientInfo.village}</div>
              <div><strong>Language:</strong> {patientInfo.language}</div>
            </div>
            
            <div className="mt-3">
              <strong className="text-sm">Current Symptoms:</strong>
              <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                {patientInfo.symptoms}
              </p>
            </div>
          </div>

          {/* Consultation Notes */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Consultation Notes
            </h3>
            
            <textarea
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              placeholder="Enter consultation notes, diagnosis, and treatment recommendations..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Staff Notes */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Staff Assistance Notes</h3>
            
            <textarea
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              placeholder="Language assistance, technical help, patient behavior notes..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4">
            <button
              onClick={() => {
                // Save notes (mock implementation)
                console.log('💾 Saving consultation notes');
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 mb-3"
            >
              <Save className="w-4 h-4" />
              <span>Save Notes</span>
            </button>
            
            <button
              onClick={endCall}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistedVideoCallSimple;