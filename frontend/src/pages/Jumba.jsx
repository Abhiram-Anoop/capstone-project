import React, { useState } from 'react';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';
import JointTracker from './JointTracker';
import { Button } from '../assets/component/button';
import axios from 'axios';
import JumbaReportDisplay from './ZumbaReportDisplay'; // Changed here
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../assets/component/card";
import { Badge } from "../assets/component/badge";


// Data for all the zumba exercises
const zumbaMoves = [
  {
    title: "Basic Salsa Step",
    difficulty: "Beginner",
    time: "30-60 seconds",
    description:
      "Step forward and backward with alternating feet while moving hips to the rhythm.",
    benefits: ["Improves coordination", "Boosts energy", "Fun cardio workout"],
    iconColor: "bg-pink-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Dance">
        💃
      </span>
    ),
  },
  {
    title: "Merengue March",
    difficulty: "Beginner",
    time: "1-3 minutes",
    description:
      "March in place with exaggerated hip movements, moving arms naturally with the beat.",
    benefits: ["Easy to follow", "Increases stamina", "Engages full body"],
    iconColor: "bg-yellow-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="March">
        🕺
      </span>
    ),
    isHighlighted: true,
  },
  {
    title: "Reggaeton Stomp",
    difficulty: "Intermediate",
    time: "30-60 seconds",
    description:
      "Stomp and slide your feet with a strong beat, adding arm and body rolls.",
    benefits: ["Tones legs", "Strengthens core", "Boosts rhythm"],
    iconColor: "bg-purple-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Stomp">
        🎵
      </span>
    ),
  },
  {
    title: "Cumbia Step",
    difficulty: "Beginner",
    time: "1-2 minutes",
    description:
      "Step back diagonally with one foot while swinging arms naturally, alternating sides.",
    benefits: ["Great for beginners", "Works legs", "Fun group move"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Dance">
        🎶
      </span>
    ),
  },
  {
    title: "Hip Hop Bounce",
    difficulty: "Intermediate",
    time: "30-60 seconds",
    description:
      "Bounce lightly on your feet while adding hip and shoulder movements to the beat.",
    benefits: ["High energy", "Burns calories", "Strengthens core"],
    iconColor: "bg-green-100",
    icon: (
      <span className="text-5xl" role="img" aria-label="Bounce">
        🔥
      </span>
    ),
  },
];

// Reusable component for a single zumba move card
const JumbaCard = ({ move, onSelectMove }) => {
  return (
    <div
      className={`flex-none bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-shadow duration-300 ${
        move.isHighlighted ? "shadow-xl" : ""
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`flex justify-center mb-4`}>
          <div
            className={`rounded-full p-4 ${move.iconColor} w-20 h-20 flex items-center justify-center`}
          >
            {move.icon}
          </div>
        </div>
        {/* Title */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{move.title}</h3>
        </div>
        {/* Difficulty and Time */}
        <div className="flex justify-center items-center space-x-4 text-sm mb-4">
          <div
            className={`rounded-full px-3 py-1 font-semibold ${
              move.difficulty === "Beginner"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {move.difficulty}
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
            <span>{move.time}</span>
          </div>
        </div>
        {/* Description */}
        <p className="text-center text-gray-600 mb-4">{move.description}</p>
        {/* Benefits List */}
        <div className="mb-6">
          <p className="font-semibold text-gray-800 mb-2">Benefits:</p>
          <ul className="list-none space-y-1 text-sm">
            {move.benefits.map((benefit, index) => (
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
            onClick={() => onSelectMove(move)}
            className="w-full text-blue-500 font-semibold py-3 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Practice This Move
          </button>
        </div>
      </div>
    </div>
  );
};

const JumbaPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [selectedMove, setSelectedMove] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const handleSelectMove = (move) => {
    setSelectedMove(move);
    setViewMode("practice");
  };

  const handleEndPractice = async (sessionData) => {
    try {
      const response = await axios.post(
        "https://ai-doctor-assistant-backend-ai-ml.onrender.com/api/zumba/report",
        sessionData
      );
      const result = response.data;
      setFinalReport(result.report);
      setViewMode("report");
    } catch (error) {
      console.error("Error ending practice session:", error);
      setViewMode("list");
    }
  };

  const handleReset = () => {
    setViewMode("list");
    setSelectedMove(null);
    setFinalReport(null);
  };

  if (viewMode === "practice" && selectedMove) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
          <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-lg aspect-video min-h-[400px]">
            <JointTracker
              pose={selectedMove}
              onEndPractice={handleEndPractice}
            />
          </div>
          <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedMove.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedMove.description}</p>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800">Benefits:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {selectedMove.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Button onClick={() => handleEndPractice({ exercise: selectedMove.title })}>
                End Practice
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (viewMode === "report" && finalReport) {
    return <JumbaReportDisplay reportData={finalReport} onReset={handleReset} />;
  }

  return (
    <>
      <Header />
      <div className="bg-white mb-10">
        <div className="bg-gray-50 py-16 px-4 md:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            Dance Your Way to Fitness
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Zumba Practice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get energized with fun zumba moves, great music, and a cardio workout like no other!
          </p>
        </div>

        {/* Zumba Moves Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {zumbaMoves.map((move, index) => (
              <JumbaCard
                key={index}
                move={move}
                onSelectMove={handleSelectMove}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JumbaPage;
