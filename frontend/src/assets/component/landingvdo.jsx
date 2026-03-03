import React from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

const LandingVdo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/landingpage.mp4" type="video/mp4" />
      </video>

      {/* Strong gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/40"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        
        {/* Top Badge */}
        <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-5 py-2 mb-6 shadow-lg">
          <HeartIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold">
            Your Complete Healthcare Companion
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-2xl">
          Your Health,{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Our Priority
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl drop-shadow-xl">
          Comprehensive healthcare solutions at your fingertips. From symptom
          checking to specialized care, we're here to support your wellness
          journey every step of the way.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mb-12">
          <Link
            to="/choicePage"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-300 flex items-center"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            Check Your Symptoms
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
          <Link
            to="/DietGeneration"
            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-300 flex items-center"
          >
            Diet Planner
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>

        {/* Bottom Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-md">
            <ShieldCheckIcon className="h-4 w-4 mr-2 text-cyan-300" />
            Secure & Confidential
          </div>
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-md">
            <CheckBadgeIcon className="h-4 w-4 mr-2 text-green-300" />
            Medically Verified
          </div>
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-md">
            <UserGroupIcon className="h-4 w-4 mr-2 text-purple-300" />
            Expert Care Network
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingVdo;
