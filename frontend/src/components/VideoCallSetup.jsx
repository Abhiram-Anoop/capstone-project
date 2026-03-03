import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Video, Mic, Settings, Phone, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const VideoCallSetup = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [patientName, setPatientName] = useState('');

  const generateRoomId = () => {
    return `consultation-${doctorId}-${uuidv4().substring(0, 8)}`;
  };

  const startVideoCall = () => {
    if (!patientName.trim()) {
      alert('Please enter your name before starting the call');
      return;
    }

    const roomId = generateRoomId();
    
    // Store call info for the doctor side to access
    const callInfo = {
      roomId,
      doctorId,
      patientName: patientName.trim(),
      timestamp: new Date().toISOString(),
      audioEnabled: isAudioEnabled,
      videoEnabled: isVideoEnabled
    };

    // You can store this in your backend/database for the doctor to see pending calls
    console.log('Call Info:', callInfo);
    
    // Navigate to video call
    navigate(`/video-call/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/find-doctor')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Doctors
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Video Consultation Setup</h1>
              <p className="text-blue-100">Prepare for your medical consultation</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Camera Preview */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Camera & Audio Check</h2>
                
                {/* Camera Preview Placeholder */}
                <div className="relative bg-gray-100 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Camera preview will appear here</p>
                    <p className="text-sm text-gray-400 mt-1">Grant camera permission when prompted</p>
                  </div>
                </div>

                {/* Audio/Video Controls */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`p-4 rounded-full transition-all duration-200 ${
                      isVideoEnabled 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                  >
                    <Video className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-4 rounded-full transition-all duration-200 ${
                      isAudioEnabled 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                  
                  <button
                    className="p-4 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    title="Audio/Video Settings"
                  >
                    <Settings className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Right Column - Call Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Consultation Details</h2>
                
                {/* Patient Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Call Instructions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Before you start:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure you have a stable internet connection</li>
                    <li>• Find a quiet, well-lit location</li>
                    <li>• Have your medical documents ready</li>
                    <li>• Test your camera and microphone</li>
                  </ul>
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Privacy & Security:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All calls are end-to-end encrypted</li>
                    <li>• No recordings without your consent</li>
                    <li>• Your data is protected under HIPAA</li>
                    <li>• Call logs are secure and confidential</li>
                  </ul>
                </div>

                {/* Emergency Notice */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">⚠️ Emergency Notice:</h3>
                  <p className="text-sm text-red-700">
                    If this is a medical emergency, please call your local emergency number immediately. 
                    Video consultations are not suitable for emergency situations.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Call Button */}
            <div className="mt-8 text-center">
              <button
                onClick={startVideoCall}
                disabled={!patientName.trim()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Phone className="w-6 h-6 mr-3" />
                Start Video Consultation
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Doctor will be notified when you join the call
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallSetup;
