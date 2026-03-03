import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-700">
        {/* Column 1: Brand Info */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            {/* Logo Icon */}
            <div className="bg-blue-400 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-green-500">DhavanthRam CARE</span>
          </div>
          <p className="text-sm leading-relaxed">
            Your trusted healthcare companion, providing comprehensive medical
            services and wellness solutions for individuals and families
            worldwide.
          </p>
          <div className="flex space-x-2 mt-4">
            <button className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-green-600 transition-colors">
              Certified
            </button>
            <button className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-green-600 transition-colors">
              Trusted
            </button>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-gray-800">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link to="/" className="hover:text-blue-500 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/clinics"
                className="hover:text-blue-500 transition-colors"
              >
                Local Clinics
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/find-doctor"
                className="hover:text-blue-500 transition-colors"
              >
                Find Doctors
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/login"
                className="hover:text-blue-500 transition-colors"
              >
                Book Appointment
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/dietgeneration"
                className="hover:text-blue-500 transition-colors"
              >
                Diet Planning
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Health Services */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-gray-800">Health Services</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/choicePage"
                className="hover:text-blue-500 transition-colors"
              >
                Symptom Checker
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/WellnessJourneyPage"
                className="hover:text-blue-500 transition-colors"
              >
                Fitness Programs
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/cycle-tracker"
                className="hover:text-blue-500 transition-colors"
              >
                Health services
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/specialised-doctor"
                className="hover:text-blue-500 transition-colors"
              >
                Specialized Care
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/urgent-care"
                className="hover:text-blue-500 transition-colors"
              >
                Emergency Care
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <Link
                to="/telemedicine"
                className="hover:text-blue-500 transition-colors"
              >
                Telemedicine
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-semibold text-gray-800">Contact Info</h3>
          <div className="flex items-start space-x-2">
            {/* Phone Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium">+91 9456781230</p>
              <p className="text-xs text-gray-500">Emergency Hotline</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            {/* Email Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 4.67v6.33a2 2 0 002 2h14a2 2 0 002-2v-6.33L12.5 16.5c-.328.22-.722.22-1.05 0L3 12.67z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium">care@DhavanthRamcare.com</p>
              <p className="text-xs text-gray-500">General Inquiries</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            {/* Map Pin Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium">
                69 Health Sector, Medical Council District
              </p>
              <p className="text-xs text-gray-500">Main Campus</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            {/* Clock Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium">24/7 Emergency · Mon-Fri</p>
              <p className="text-xs text-gray-500">Operating Hours</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
