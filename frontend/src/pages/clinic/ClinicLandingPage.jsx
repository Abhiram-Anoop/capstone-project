import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Users, Calendar, FileText, 
  Video, Settings, ArrowRight, Heart
} from 'lucide-react';

const ClinicLandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "Clinic Dashboard",
      description: "Real-time patient queue management and clinic operations",
      route: "/clinic/dashboard",
      color: "blue"
    },
    {
      icon: Users,
      title: "Patient Registration",
      description: "Register new patients and add them to the queue",
      route: "/clinic/register-patient", 
      color: "green"
    },
    {
      icon: Video,
      title: "Video Consultations",
      description: "Staff-assisted video calls with remote doctors",
      route: "/clinic/dashboard",
      color: "purple"
    },
    {
      icon: FileText,
      title: "Patient Records",
      description: "Access and manage patient medical records",
      route: "/clinic/dashboard",
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Government Rural Health Center</h1>
                <p className="text-gray-600">Digital Healthcare Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Main App
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Clinic Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering rural healthcare delivery through staff-assisted digital services. 
            Manage patient queues, conduct video consultations, and improve healthcare access 
            for the 173 villages around Nabha.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${feature.color}-200 transition-colors`}>
                  <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Open <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">173</h4>
              <p className="text-gray-600">Villages Served</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">18</h4>
              <p className="text-gray-600">Health Centers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">50+</h4>
              <p className="text-gray-600">Daily Patients</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/clinic/dashboard')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Activity className="w-5 h-5" />
            <span>Open Clinic Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClinicLandingPage;