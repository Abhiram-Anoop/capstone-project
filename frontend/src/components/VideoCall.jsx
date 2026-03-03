import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeVideoCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for DOM to be ready
        if (!jitsiContainerRef.current) {
          throw new Error('Video container not available');
        }

        // Load Jitsi Meet script safely
        if (!window.JitsiMeetExternalAPI) {
          await loadJitsiScript();
        }

        if (!mounted) return;

        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId || `consultation-${Date.now()}`,
          width: '100%',
          height: '600px',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'hangup', 'chat', 'raisehand'
            ],
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListener('readyToClose', () => {
          if (mounted) {
            navigate('/telemedicine');
          }
        });

        api.addEventListener('audioMuteStatusChanged', ({ muted }) => {
          if (mounted) setIsAudioMuted(muted);
        });

        api.addEventListener('videoMuteStatusChanged', ({ muted }) => {
          if (mounted) setIsVideoMuted(muted);
        });

        if (mounted) {
          setJitsiApi(api);
          setIsLoading(false);
        }

      } catch (err) {
        console.error('Video call initialization error:', err);
        if (mounted) {
          setError('Failed to initialize video call. Please try again.');
          setIsLoading(false);
        }
      }
    };

    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi script'));

        // Safe appendChild with null check
        const head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
          head.appendChild(script);
        } else {
          reject(new Error('Cannot find document head'));
        }
      });
    };

    initializeVideoCall();

    return () => {
      mounted = false;
      if (jitsiApi) {
        try {
          jitsiApi.dispose();
        } catch (err) {
          console.warn('Error disposing Jitsi API:', err);
        }
      }
    };
  }, [roomId, navigate]);

  const endCall = () => {
    if (jitsiApi) {
      try {
        jitsiApi.executeCommand('hangup');
      } catch (err) {
        console.warn('Error ending call:', err);
      }
    }
    navigate('/telemedicine');
  };

  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4 text-red-400">Video Call Error</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => navigate('/telemedicine')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Back to Telemedicine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-white">
              Video Consultation - Room: {roomId || 'Default'}
            </h1>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              End Call
            </button>
          </div>

          {/* Video Container */}
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Connecting to video call...</p>
                </div>
              </div>
            )}
            <div 
              ref={jitsiContainerRef} 
              className="w-full"
              style={{ minHeight: '600px', backgroundColor: '#1f2937' }}
            />
          </div>

          {/* Controls */}
          <div className="bg-gray-700 px-6 py-4 flex justify-center gap-4">
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full ${
                isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
              } text-white transition-colors`}
              title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
              } text-white transition-colors`}
              title={isVideoMuted ? 'Turn on Video' : 'Turn off Video'}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
