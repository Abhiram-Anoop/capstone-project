import { v4 as uuidv4 } from 'uuid';

// Generate a unique room ID for video calls
export const generateVideoRoomId = (doctorId, patientId) => {
  const timestamp = Date.now();
  const shortUuid = uuidv4().substring(0, 8);
  return `medical-${doctorId}-${patientId}-${timestamp}-${shortUuid}`;
};

// Generate a simple room ID for consultations
export const generateConsultationRoomId = (doctorId) => {
  const timestamp = Date.now();
  const shortUuid = uuidv4().substring(0, 8);
  return `consultation-${doctorId}-${timestamp}-${shortUuid}`;
};

// Validate room ID format
export const isValidRoomId = (roomId) => {
  return /^(medical|consultation)-[\w-]+$/.test(roomId);
};

// Extract doctor ID from room ID
export const extractDoctorIdFromRoom = (roomId) => {
  const parts = roomId.split('-');
  return parts.length > 1 ? parts[1] : null;
};

// Generate a shareable room link
export const generateRoomLink = (roomId, baseUrl = window.location.origin) => {
  return `${baseUrl}/video-call/${roomId}`;
};

// Store call information (for backend integration)
export const createCallInfo = (roomId, doctorId, patientName, patientId = null) => {
  return {
    roomId,
    doctorId,
    patientId,
    patientName,
    status: 'waiting', // waiting, active, ended
    createdAt: new Date().toISOString(),
    type: 'video_consultation'
  };
};

// Format call duration
export const formatCallDuration = (startTime, endTime = new Date()) => {
  const duration = Math.floor((endTime - startTime) / 1000); // in seconds
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Jitsi Script Loading Utility - Simplified and Safe
export const loadJitsiScript = () => {
  return new Promise((resolve, reject) => {
    // Check if Jitsi is already loaded
    if (window.JitsiMeetExternalAPI) {
      resolve(window.JitsiMeetExternalAPI);
      return;
    }

    // Ensure document is ready
    if (!document.head && !document.body) {
      reject(new Error('Document not ready for script loading'));
      return;
    }

    // Remove any existing script first
    const existingScript = document.querySelector('script[src*="external_api.js"]');
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    
    script.onload = () => {
      // Simple check with timeout
      let checkCount = 0;
      const maxChecks = 10;
      
      const checkAPI = () => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
        } else if (checkCount < maxChecks) {
          checkCount++;
          setTimeout(checkAPI, 300);
        } else {
          reject(new Error('Jitsi API not available'));
        }
      };
      checkAPI();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Jitsi Meet script'));
    };

    // Safe append - try head first, then body
    const targetElement = document.head || document.body || document.documentElement;
    if (targetElement) {
      targetElement.appendChild(script);
    } else {
      reject(new Error('No valid document element to append script'));
    }
  });
};

// Check if device supports WebRTC
export const checkWebRTCSupport = () => {
  const hasWebRTC = !!(
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection
  );
  
  const hasGetUserMedia = !!(
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  );

  return {
    supported: hasWebRTC && hasGetUserMedia,
    webRTC: hasWebRTC,
    getUserMedia: hasGetUserMedia
  };
};

// Test camera and microphone access
export const testMediaDevices = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    
    // Stop all tracks to release camera/microphone
    stream.getTracks().forEach(track => track.stop());
    
    return {
      success: true,
      hasCamera: true,
      hasMicrophone: true
    };
  } catch (error) {
    console.warn('Media access error:', error);
    
    // Try audio only
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach(track => track.stop());
      
      return {
        success: true,
        hasCamera: false,
        hasMicrophone: true,
        error: 'Camera access denied'
      };
    } catch (audioError) {
      return {
        success: false,
        hasCamera: false,
        hasMicrophone: false,
        error: error.message || 'Media access denied'
      };
    }
  }
};
