import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Clock,
  Star,
  Globe,
  Wifi,
  Shield,
  Calendar,
  Users,
  Phone,
  CheckCircle,
  Award,
  MapPin,
} from "lucide-react";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer.jsx";

const Telemedicine = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Mock telemedicine doctors data (replace with API call)
  const telemedicineDoctors = [
    {
      id: "tele-001",
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      experience: "12 years",
      rating: 4.9,
      consultationFee: 800,
      availableNow: true,
      nextAvailable: "Available Now",
      totalConsultations: 2840,
      languages: ["English", "Hindi"],
      avatar: "https://i.pravatar.cc/100?img=47",
      specialties: ["Telemedicine", "Internal Medicine", "Preventive Care"],
      videoQuality: "HD",
      responseTime: "< 2 mins",
      onlineHours: "24/7",
      verified: true,
    },
    {
      id: "tele-002",
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      experience: "15 years",
      rating: 4.8,
      consultationFee: 1200,
      availableNow: false,
      nextAvailable: "2:30 PM Today",
      totalConsultations: 1950,
      languages: ["English", "Mandarin"],
      avatar: "https://i.pravatar.cc/100?img=11",
      specialties: ["Cardiology", "Heart Disease", "Hypertension"],
      videoQuality: "4K",
      responseTime: "< 3 mins",
      onlineHours: "9 AM - 9 PM",
      verified: true,
    },
    {
      id: "tele-003",
      name: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      experience: "10 years",
      rating: 4.9,
      consultationFee: 700,
      availableNow: true,
      nextAvailable: "Available Now",
      totalConsultations: 3200,
      languages: ["English", "Hindi", "Tamil"],
      avatar: "https://i.pravatar.cc/100?img=32",
      specialties: ["Pediatrics", "Child Development", "Vaccination"],
      videoQuality: "HD",
      responseTime: "< 1 min",
      onlineHours: "8 AM - 10 PM",
      verified: true,
    },
    {
      id: "tele-004",
      name: "Dr. James Wilson",
      specialty: "Dermatology",
      experience: "8 years",
      rating: 4.7,
      consultationFee: 900,
      availableNow: true,
      nextAvailable: "Available Now",
      totalConsultations: 1600,
      languages: ["English", "Spanish"],
      avatar: "https://i.pravatar.cc/100?img=13",
      specialties: ["Dermatology", "Skin Care", "Acne Treatment"],
      videoQuality: "HD",
      responseTime: "< 2 mins",
      onlineHours: "10 AM - 8 PM",
      verified: true,
    },
    {
      id: "tele-005",
      name: "Dr. Aisha Patel",
      specialty: "Mental Health",
      experience: "7 years",
      rating: 4.8,
      consultationFee: 1000,
      availableNow: false,
      nextAvailable: "5:00 PM Today",
      totalConsultations: 2100,
      languages: ["English", "Hindi", "Gujarati"],
      avatar: "https://i.pravatar.cc/100?img=38",
      specialties: ["Psychiatry", "Anxiety", "Depression"],
      videoQuality: "HD",
      responseTime: "< 5 mins",
      onlineHours: "1 PM - 11 PM",
      verified: true,
    },
    {
      id: "tele-006",
      name: "Dr. Robert Kim",
      specialty: "Orthopedics",
      experience: "14 years",
      rating: 4.6,
      consultationFee: 1100,
      availableNow: true,
      nextAvailable: "Available Now",
      totalConsultations: 1450,
      languages: ["English", "Korean"],
      avatar: "https://i.pravatar.cc/100?img=14",
      specialties: ["Orthopedics", "Joint Pain", "Sports Medicine"],
      videoQuality: "4K",
      responseTime: "< 3 mins",
      onlineHours: "7 AM - 7 PM",
      verified: true,
    },
  ];

  const specialties = ["All", "General Medicine", "Cardiology", "Pediatrics", "Dermatology", "Mental Health", "Orthopedics"];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setDoctors(telemedicineDoctors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDoctors = selectedSpecialty === "All" 
    ? doctors 
    : doctors.filter(doc => doc.specialty === selectedSpecialty);

  const handleVideoConsultation = async (doctorId) => {
    // Generate a video call link directly
    const roomId = `consultation-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meetingLink = `https://meet.jit.si/${roomId}`;
    
    // Open in new tab
    window.open(meetingLink, '_blank');
    
    // Also navigate to setup page for more options
    navigate(`/telemedicine-setup/${doctorId}?room=${roomId}`);
  };

  const handleScheduleCall = (doctorId) => {
    // Generate a scheduled meeting link
    const roomId = `scheduled-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meetingLink = `https://meet.jit.si/${roomId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(meetingLink).then(() => {
      alert(`Video call link created and copied to clipboard!\n\nMeeting Link: ${meetingLink}\n\nShare this link with your doctor to join the consultation.`);
    }).catch(() => {
      alert(`Video call link created!\n\nMeeting Link: ${meetingLink}\n\nShare this link with your doctor to join the consultation.`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading telemedicine doctors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Video className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Telemedicine Consultations
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with certified doctors from the comfort of your home
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Secure & Private</h3>
              <p className="text-sm text-blue-100">End-to-end encrypted</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Available 24/7</h3>
              <p className="text-sm text-blue-100">Round-the-clock care</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Certified Doctors</h3>
              <p className="text-sm text-blue-100">Licensed professionals</p>
            </div>
            <div className="text-center">
              <Wifi className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">HD Video Quality</h3>
              <p className="text-sm text-blue-100">Crystal clear calls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedSpecialty === specialty
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              {/* Doctor Header */}
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                {doctor.availableNow && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Available Now</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full border-4 border-white/30"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{doctor.name}</h3>
                    <p className="text-blue-100">{doctor.specialty}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{doctor.rating}</span>
                      <span className="text-blue-100 text-sm">• {doctor.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="p-6 space-y-4">
                {/* Consultation Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Consultation Fee</span>
                      <p className="font-semibold text-green-600">₹{doctor.consultationFee}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Patients</span>
                      <p className="font-semibold">{doctor.totalConsultations.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Response Time</span>
                      <p className="font-semibold text-blue-600">{doctor.responseTime}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Video Quality</span>
                      <p className="font-semibold">{doctor.videoQuality}</p>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specialties.map((spec, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Languages</h4>
                  <div className="flex space-x-2">
                    {doctor.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Online: {doctor.onlineHours}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {doctor.availableNow ? (
                    <button
                      onClick={() => handleVideoConsultation(doctor.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Video className="w-5 h-5" />
                      <span>Start Video Consultation</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleScheduleCall(doctor.id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Call</span>
                      </button>
                      <p className="text-center text-sm text-gray-500">
                        Next available: {doctor.nextAvailable}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => alert(`Viewing profile of ${doctor.name}`)}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                  >
                    View Full Profile
                  </button>
                </div>

                {/* Verification Badge */}
                {doctor.verified && (
                  <div className="flex items-center justify-center space-x-2 text-green-600 pt-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Doctor</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No doctors found */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No doctors available for {selectedSpecialty}
            </h3>
            <p className="text-gray-500">Try selecting a different specialty</p>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Our Telemedicine?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600">
                Your medical information is protected with enterprise-grade security and encryption.
              </p>
            </div>
            <div className="p-6">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Licensed Professionals</h3>
              <p className="text-gray-600">
                All our doctors are board-certified and licensed to practice telemedicine.
              </p>
            </div>
            <div className="p-6">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Access healthcare anytime, anywhere with our round-the-clock medical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Telemedicine;
