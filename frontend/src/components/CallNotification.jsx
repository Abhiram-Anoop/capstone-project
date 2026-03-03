import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, Clock } from 'lucide-react';

const CallNotification = ({ 
  isVisible, 
  patientName, 
  roomId, 
  onAccept, 
  onDecline, 
  duration = 30 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline(); // Auto-decline after timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onDecline]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [isVisible, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-pulse">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Incoming Video Call</h2>
          <p className="text-gray-600">Medical consultation request</p>
        </div>

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{patientName}</h3>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Auto-decline in {timeLeft}s</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onDecline}
            className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Decline</span>
          </button>
          <button
            onClick={onAccept}
            className="flex-1 bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Accept</span>
          </button>
        </div>

        {/* Room Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">Room ID: {roomId}</p>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
