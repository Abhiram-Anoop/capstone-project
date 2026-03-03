import React, { useState } from 'react';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';
import JointTracker from './JointTracker';
import { Button } from '../assets/component/button';
import axios from 'axios';
import YogaReportDisplay from './YogaReportDisplay'; // Assuming you have this component


// Data for all the yoga poses
const yogaPoses = [
  // ... (your yogaPoses array remains the same)
  {
    title: "Tree Pose",
    sanskrit: "Vriksasana",
    difficulty: "Intermediate",
    time: "30-60 seconds each side",
    description:
      "Stand on left leg, place right foot on inner left thigh. Bring palms together at heart center.",
    benefits: ["Improves balance", "Strengthens legs", "Increases focus"],
    iconColor: "bg-green-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Tree">
        🌳
      </span>
    ),
  },
  {
    title: "Child's Pose",
    sanskrit: "Balasana",
    difficulty: "Beginner",
    time: "1-5 minutes",
    description:
      "Kneel on floor, sit back on heels, fold forward with arms extended or by your sides.",
    benefits: ["Relieves stress", "Stretches back", "Calms mind"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Child">
        🧘‍♂️
      </span>
    ),
    isHighlighted: true,
  },
  {
    title: "Cobra Pose",
    sanskrit: "Bhujangasana",
    difficulty: "Intermediate",
    time: "15-30 seconds",
    description:
      "Lie face down, place palms under shoulders, gently lift chest while keeping pelvis grounded.",
    benefits: ["Strengthens back", "Opens chest", "Improves spine flexibility"],
    iconColor: "bg-green-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Cobra">
        🐍
      </span>
    ),
  },
  {
    title: "Mountain Pose",
    sanskrit: "Tadasana",
    difficulty: "Beginner",
    time: "1-2 minutes",
    description:
      "Stand tall with feet hip-width apart, arms at your sides, and distribute your weight evenly.",
    benefits: ["Improves posture", "Increases stability", "Grounds the body"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Mountain">
        🏔️
      </span>
    ),
  },
  {
    title: "Downward Dog",
    sanskrit: "Adho Mukha Svanasana",
    difficulty: "Beginner",
    time: "1-3 minutes",
    description:
      "From hands and knees, tuck toes under and lift hips up and back to form an inverted V-shape.",
    benefits: ["Stretches whole body", "Strengthens arms", "Calms the brain"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Dog">
        🐶
      </span>
    ),
  },
  {
    title: "Warrior I",
    sanskrit: "Virabhadrasana I",
    difficulty: "Intermediate",
    time: "30 seconds each side",
    description:
      "Step left foot back, turn it out 45 degrees. Bend right knee, and lift arms overhead.",
    benefits: ["Strengthens legs", "Stretches groin", "Builds focus"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Warrior">
        🤺
      </span>
    ),
  },
];

// Reusable component for a single yoga pose card
const YogaCard = ({ pose, onSelectPose }) => {
  return (
    <div
      className={`flex-none bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-shadow duration-300 ${
        pose.isHighlighted ? "shadow-xl" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`flex justify-center mb-4`}>
          <div
            className={`rounded-full p-4 ${pose.iconColor} w-20 h-20 flex items-center justify-center`}
          >
            {pose.icon}
          </div>
        </div>
        {/* Title and Sanskrit name */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{pose.title}</h3>
          <p className="italic text-gray-500">{pose.sanskrit}</p>
        </div>
        {/* Difficulty and Time */}
        <div className="flex justify-center items-center space-x-4 text-sm mb-4">
          <div
            className={`rounded-full px-3 py-1 font-semibold ${
              pose.difficulty === "Beginner"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {pose.difficulty}
          </div>
          <div className="flex items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{pose.time}</span>
          </div>
        </div>
        {/* Description */}
        <p className="text-center text-gray-600 mb-4">{pose.description}</p>
        {/* Benefits List */}
        <div className="mb-6">
          <p className="font-semibold text-gray-800 mb-2">Benefits:</p>
          <ul className="list-none space-y-1 text-sm">
            {pose.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => onSelectPose(pose)}
            className="w-full text-blue-500 font-semibold py-3 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Practice This Pose
          </button>
        </div>
      </div>
    </div>
  );
};

const YogaPage = () => {
  const categories = [
    "All Poses",
    "Standing",
    "Balance",
    "Backbend",
    "Inversion",
    "Restorative",
  ];
  const activeCategory = "All Poses";
  const displayOptions = ["Individual Poses", "Yoga Sequences"];
  const activeDisplay = "Individual Poses";
  const [viewMode, setViewMode] = useState("list");
  const [selectedPose, setSelectedPose] = useState(null);
  const [finalReport, setFinalReport] = useState(null); // State to store the final report

  const handleSelectPose = (pose) => {
    setSelectedPose(pose);
    setViewMode("practice");
  };

  const handleEndPractice = async (sessionData) => {
    try {
      const response = await axios.post(
       `${import.meta.env.VITE_APP_API_BASE_URL || "https://ai-doctor-assistant-backend-ai-ml.onrender.com"}/api/yoga/report`
,
        sessionData
      );
      const result = response.data;
      setFinalReport(result.report); // Store the final report
      setViewMode("report"); // Switch to the report view
    } catch (error) {
      console.error("Error ending practice session:", error);
      setViewMode("list"); // Revert to the list view on error
    }
  };

  const handleReset = () => {
    setViewMode("list");
    setSelectedPose(null);
    setFinalReport(null);
  };

  if (viewMode === "practice" && selectedPose) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
          <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-lg aspect-video min-h-[400px]">
            <JointTracker
              pose={selectedPose}
              onEndPractice={handleEndPractice}
            />
          </div>
          <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedPose.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedPose.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800">Benefits:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {selectedPose.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Button onClick={() => handleEndPractice({ exercise: selectedPose.title })}>
                End Practice
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (viewMode === "report" && finalReport) {
    return <YogaReportDisplay reportData={finalReport} onReset={handleReset} />;
  }

  return (
    <>
      <Header />
      <div className="bg-white mb-10">
        <div className="bg-gray-50 py-16 px-4 md:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Find Your Inner Peace
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Yoga Practice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the ancient art of yoga with guided poses, breathing
            techniques, and mindfulness practices
          </p>
          <div className="flex justify-center items-center space-x-8 text-gray-600 mt-8">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.328-1.664A2 2 0 0010 11.237v1.526a2 2 0 001.424 1.833l3.328 1.664a2 2 0 002.576-1.833V12.986a2 2 0 00-2.576-1.833zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Guided Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v.01M12 8v.01M12 12v.01M12 16v.01M12 20v.01M12 16a9 9 0 01-9-9"
                />
              </svg>
              <span>All Levels</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6c0-1.657 1.343-3 3-3s3 1.343 3 3v13M12 19V6a3 3 0 00-3-3m3 3a3 3 0 003 3v13"
                />
              </svg>
              <span>Expert Instruction</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    cat === activeCategory
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0 text-sm font-medium">
              {displayOptions.map((option, index) => (
                <span
                  key={index}
                  className={`cursor-pointer ${
                    option === activeDisplay
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Yoga Poses Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {yogaPoses.map((pose, index) => (
              <YogaCard
                key={index}
                pose={pose}
                onSelectPose={handleSelectPose}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default YogaPage;