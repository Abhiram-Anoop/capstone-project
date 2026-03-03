import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, AlertCircle, CheckCircle, X } from 'lucide-react';
import { checkWebRTCSupport, testMediaDevices, loadJitsiScript } from '../utils/videoCallUtils';

const VideoCallTest = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState({
    webRTC: null,
    mediaDevices: null,
    jitsiScript: null
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    
    try {
      // Test WebRTC Support
      const webRTCResult = checkWebRTCSupport();
      setTestResults(prev => ({ ...prev, webRTC: webRTCResult }));
      
      // Test Media Devices
      const mediaResult = await testMediaDevices();
      setTestResults(prev => ({ ...prev, mediaDevices: mediaResult }));
      
      // Test Jitsi Script Loading
      try {
        await loadJitsiScript();
        setTestResults(prev => ({ 
          ...prev, 
          jitsiScript: { success: true, message: 'Jitsi script loaded successfully' }
        }));
      } catch (error) {
        setTestResults(prev => ({ 
          ...prev, 
          jitsiScript: { success: false, message: error.message }
        }));
      }
      
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getIcon = (result) => {
    if (result === null) return null;
    if (result === true || result?.success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const testVideoCall = () => {
    const roomId = `test-${Date.now()}`;
    navigate(`/video-call/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Video className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Call Diagnostic</h1>
          <p className="text-gray-600">Test your system's compatibility with video calling</p>
        </div>

        {/* Test Button */}
        <div className="text-center mb-8">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Diagnostic Tests'}
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
          
          {/* WebRTC Support */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">WebRTC Support</h3>
              <p className="text-sm text-gray-600">
                {testResults.webRTC === null 
                  ? 'Not tested yet' 
                  : testResults.webRTC.supported 
                    ? 'Your browser supports video calling' 
                    : 'Your browser does not support video calling'
                }
              </p>
              {testResults.webRTC && !testResults.webRTC.supported && (
                <p className="text-xs text-red-600 mt-1">
                  WebRTC: {testResults.webRTC.webRTC ? '✓' : '✗'}, 
                  getUserMedia: {testResults.webRTC.getUserMedia ? '✓' : '✗'}
                </p>
              )}
            </div>
            {getIcon(testResults.webRTC?.supported)}
          </div>

          {/* Media Devices */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Camera & Microphone</h3>
              <p className="text-sm text-gray-600">
                {testResults.mediaDevices === null 
                  ? 'Not tested yet' 
                  : testResults.mediaDevices.success 
                    ? `Camera: ${testResults.mediaDevices.hasCamera ? '✓' : '✗'}, Microphone: ${testResults.mediaDevices.hasMicrophone ? '✓' : '✗'}`
                    : testResults.mediaDevices.error || 'Access denied'
                }
              </p>
            </div>
            {getIcon(testResults.mediaDevices?.success)}
          </div>

          {/* Jitsi Script */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Video Service</h3>
              <p className="text-sm text-gray-600">
                {testResults.jitsiScript === null 
                  ? 'Not tested yet' 
                  : testResults.jitsiScript.message
                }
              </p>
            </div>
            {getIcon(testResults.jitsiScript?.success)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={testVideoCall}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Test Video Call
          </button>
          <button
            onClick={() => navigate('/telemedicine')}
            className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Telemedicine
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default VideoCallTest;
