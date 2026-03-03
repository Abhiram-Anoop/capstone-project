import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Video, Mic, Settings, Phone, ArrowLeft, Shield, Clock, User, Copy, ExternalLink, Share2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Header from '../assets/component/Header';

const TelemedicineSetup = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [meetingLink, setMeetingLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    primaryConcern: '',
    symptoms: '',
    allergies: '',
    medications: ''
  });

  // Generate meeting link on mount or use existing one
  useEffect(() => {
    const existingRoom = searchParams.get('room');
    if (existingRoom) {
      setMeetingLink(`https://meet.jit.si/${existingRoom}`);
    } else {
      const roomId = `consultation-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setMeetingLink(`https://meet.jit.si/${roomId}`);
    }
  }, [searchParams]);

  // Mock doctor data based on doctorId (replace with API call)
  const getDoctorById = (id) => {
    const doctors = {
      'tele-001': {
        name: 'Dr. Sarah Johnson',
        specialty: 'General Medicine',
        avatar: 'https://i.pravatar.cc/100?img=47',
        consultationFee: 800,
        languages: ['English', 'Hindi']
      },
      'tele-002': {
        name: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        avatar: 'https://i.pravatar.cc/100?img=11',
        consultationFee: 1200,
        languages: ['English', 'Mandarin']
      },
      // Add more doctors as needed
    };
    return doctors[id] || {
      name: 'Dr. Unknown',
      specialty: 'General Medicine',
      avatar: 'https://i.pravatar.cc/100?img=1',
      consultationFee: 800,
      languages: ['English']
    };
  };

  const doctor = getDoctorById(doctorId);

  const generateRoomId = () => {
    return `telemedicine-${doctorId}-${uuidv4().substring(0, 8)}`;
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareMeetingLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Video Consultation Link',
          text: `Join my video consultation with ${doctor.name}`,
          url: meetingLink,
        });
      } catch (err) {
        copyMeetingLink();
      }
    } else {
      copyMeetingLink();
    }
  };

  const openMeetingInNewTab = () => {
    window.open(meetingLink, '_blank');
  };

  const handleInputChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startConsultation = () => {
    if (!patientInfo.name.trim() || !patientInfo.primaryConcern.trim()) {
      alert('Please fill in your name and primary concern before starting the consultation');
      return;
    }

    const roomId = generateRoomId();
    
    // Store consultation info
    const consultationInfo = {
      roomId,
      doctorId,
      doctor: doctor,
      patient: patientInfo,
      timestamp: new Date().toISOString(),
      audioEnabled: isAudioEnabled,
      videoEnabled: isVideoEnabled,
      type: 'telemedicine'
    };

    console.log('Consultation Info:', consultationInfo);
    
    // Navigate to video call
    navigate(`/video-call/${roomId}`, { 
      state: { consultationInfo } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Header />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/telemedicine')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Telemedicine
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Telemedicine Consultation Setup</h1>
                <p className="text-blue-100">Prepare for your video consultation with {doctor.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Consultation Fee</p>
                  <p className="text-2xl font-bold">₹{doctor.consultationFee}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Doctor Info & Patient Form */}
            <div className="space-y-6">
              {/* Doctor Information */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Doctor</h2>
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <p className="text-sm text-gray-600">
                      Languages: {doctor.languages.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Patient Information Form */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Patient Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={patientInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={patientInfo.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Concern *
                    </label>
                    <input
                      type="text"
                      value={patientInfo.primaryConcern}
                      onChange={(e) => handleInputChange('primaryConcern', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Main reason for consultation"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Symptoms
                    </label>
                    <textarea
                      value={patientInfo.symptoms}
                      onChange={(e) => handleInputChange('symptoms', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your symptoms in detail"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Known Allergies
                      </label>
                      <input
                        type="text"
                        value={patientInfo.allergies}
                        onChange={(e) => handleInputChange('allergies', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any allergies"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Medications
                      </label>
                      <input
                        type="text"
                        value={patientInfo.medications}
                        onChange={(e) => handleInputChange('medications', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Current medications"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Camera Setup & Instructions */}
            <div className="space-y-6">
              {/* Camera Preview */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Camera & Audio Setup</h2>
                
                <div className="relative bg-gray-900 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                  <div className="text-center text-white">
                    <Video className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg">Camera preview will appear here</p>
                    <p className="text-sm text-gray-300 mt-1">Grant camera permission when prompted</p>
                  </div>
                </div>

                {/* Controls */}
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

              {/* Pre-consultation Checklist */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Pre-consultation Checklist
                </h3>
                <div className="space-y-3 text-sm text-green-700">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Stable internet connection</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Quiet, well-lit environment</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Medical documents ready</span>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>Camera and microphone tested</span>
                  </div>
                </div>
              </div>

              {/* Privacy Information */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  What to Expect
                </h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Doctor will join within 2-3 minutes</li>
                  <li>• Consultation duration: 15-30 minutes</li>
                  <li>• Digital prescription if needed</li>
                  <li>• Follow-up appointment can be scheduled</li>
                  <li>• Emergency protocols are in place</li>
                </ul>
              </div>

              {/* Video Call Link Section */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="font-bold text-purple-800 mb-3 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Video Call Link
                </h3>
                <p className="text-sm text-purple-600 mb-4">
                  Share this link with anyone who needs to join the consultation
                </p>
                
                <div className="bg-white rounded-lg p-3 mb-4 border border-purple-200">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={meetingLink}
                      readOnly
                      className="flex-1 text-sm text-gray-700 bg-transparent border-none focus:outline-none truncate"
                    />
                    <button
                      onClick={copyMeetingLink}
                      className={`p-2 rounded-lg transition-colors ${
                        copied ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={openMeetingInNewTab}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Call
                  </button>
                  <button
                    onClick={shareMeetingLink}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Start Consultation Button */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="text-center">
              <button
                onClick={startConsultation}
                disabled={!patientInfo.name.trim() || !patientInfo.primaryConcern.trim()}
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Video className="w-6 h-6 mr-3" />
                Start Telemedicine Consultation
              </button>
              <p className="text-sm text-gray-500 mt-3">
                By starting this consultation, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-3 text-center text-sm z-50">
        <span className="font-bold">Emergency Notice:</span> If this is a medical emergency, please call your local emergency number immediately.
      </div>
    </div>
  );
};

export default TelemedicineSetup;
