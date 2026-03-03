import React, { useState } from "react";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";

const DashboardPage = () => {
  const [selectedMood, setSelectedMood] = useState("Excellent");

  const moods = [
    { label: "Excellent", emoji: "😊" },
    { label: "Good", emoji: "🙂" },
    { label: "Okay", emoji: "😐" },
    { label: "Down", emoji: "🙁" },
    { label: "Struggling", emoji: "😩" },
  ];

  return (
    <>
    <Header />
    <div className="min-h-screen bg-white font-sans">
      <div className="min-h-[80vh] bg-gradient-to-b from-white to-blue-100 flex items-center justify-center p-4 ">
        <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-4xl mx-auto text-center relative transform transition-all duration-300 scale-95 hover:scale-100">
          <h1 className="text-4xl font-extrabold mb-2 text-gray-800 tracking-tight">
            Hello, Sarah!
          </h1>
          <p className="text-md text-gray-600 mb-6 font-light">
            How are you feeling today?
          </p>

          <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Quick Mood Check-in
            </h2>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <div
                  key={mood.label}
                  className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-xl transition-all duration-300
                  ${
                    selectedMood === mood.label
                      ? "bg-blue-100 ring-2 ring-blue-400 transform scale-105 shadow-md"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedMood(mood.label)}
                >
                  <div className="text-4xl">{mood.emoji}</div>
                  <div
                    className={`mt-1 text-xs font-medium ${
                      selectedMood === mood.label
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {mood.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="transition-opacity duration-500 ease-in-out">
              <p className="text-gray-600 mb-4 text-sm font-light">
                Thank you for sharing. Your mood has been logged for today.
              </p>
            </div>
          )}

          <button className="w-full py-3 bg-green-500 text-white rounded-full font-bold text-lg hover:bg-green-600 transition-colors shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
            Continue to Dashboard
          </button>

          <div className="flex flex-col md:flex-row justify-center items-center mt-6 text-xs text-gray-500 font-light space-y-2 md:space-y-0 md:space-x-8">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Secure & Confidential
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
              Clinically Validated
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span>
              Expert Care Network
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Mood & Symptom Tracker Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V8.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 8.25v10.5M3 5.25h18M3 15.75h18"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">
              Mood & Symptom Tracker
            </h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Track your mood and symptoms to understand your patterns and make
            positive changes.
          </p>
          <div className="mb-4">
            <h3 className="text-gray-700 font-medium text-sm mb-2">
              Last 7 Days
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              <div className="text-gray-500 text-xs">Mon</div>
              <div className="text-gray-500 text-xs">Tue</div>
              <div className="text-gray-500 text-xs">Wed</div>
              <div className="text-gray-500 text-xs">Thu</div>
              <div className="text-gray-500 text-xs">Fri</div>
              <div className="text-gray-500 text-xs">Sat</div>
              <div className="text-gray-500 text-xs">Today</div>
              <div className="text-2xl">😊</div>
              <div className="text-2xl">🙂</div>
              <div className="text-2xl">😐</div>
              <div className="text-2xl">😊</div>
              <div className="text-2xl">🙂</div>
              <div className="text-2xl">❓</div>
              <div className="text-2xl">?</div>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Log Mood
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm w-full">
              Add Symptoms
            </button>
          </div>
          <div className="bg-green-50 rounded-md p-3 text-center text-xs text-green-600">
            <p className="font-semibold">
              <span className="inline-block mr-1">5-day streak!</span> 🔥
            </p>
            <p>Keep tracking to maintain your wellness journey</p>
          </div>
        </div>

        {/* Mood Trends Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-purple-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m-16.034 9.956a11.95 11.95 0 01-3.213-6.127m6.685 3.058A11.95 11.95 0 0119.5 10m-8.202 8.205a11.95 11.95 0 01-8.578-2.342M9 11.25l3.695 3.695a8.086 8.086 0 013.107-3.695L15 9.75m-8.202 8.205A8.086 8.086 0 016.398 15m-3.213-6.127l4.9-2.2m8.95-2.28l4.9 2.2m-1.636-9.286a12.142 12.142 0 016.156 6.156M3 12a9 9 0 1018 0 9 9 0 00-18 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">Mood Trends</h2>
          </div>
          <p className="text-gray-600 mb-4 text-sm">
            Your mood patterns over the past week
          </p>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-700 font-medium text-sm">
                Overall Mood
              </h4>
              <span className="text-green-500 text-sm font-semibold flex items-center">
                Good
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full w-[70%]"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h5 className="text-purple-500 font-semibold text-lg">75%</h5>
              <p className="text-gray-600 text-sm">Good Days</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h5 className="text-purple-500 font-semibold text-lg">4.2/5</h5>
              <p className="text-gray-600 text-sm">Avg Mood</p>
            </div>
          </div>
          <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm w-full">
            View Detailed Report
          </button>
        </div>

        {/* Guided Meditations & Mindfulness Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9 9 0 01-9-9c0-1.803.606-3.468 1.637-4.78l-.004-.002A9.004 9.004 0 0112 3a9 9 0 019 9c0 1.803-.606 3.468-1.637 4.78l.004.002A9.004 9.004 0 0112 21z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.75a8.25 8.25 0 00-7.87 6.42A8.25 8.25 0 0012 20.25a8.25 8.25 0 007.87-6.42A8.25 8.25 0 0012 3.75z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">
              Guided Meditations & Mindfulness
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Relax and recharge. Choose from our library of guided meditations
            and mindfulness exercises.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <button className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
              All
            </button>
            <button className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300">
              Sleep
            </button>
            <button className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300">
              Stress Relief
            </button>
            <button className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300">
              Focus
            </button>
            <button className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300">
              Anxiety
            </button>
            <button className="bg-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300">
              Quick Calm
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Meditations Cards (truncated for brevity) */}
          </div>
          <div className="flex gap-2 mb-4">
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm w-full">
              Start Quick Session
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm w-full">
              Browse Library
            </button>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-gray-700 font-medium text-sm">
              Recommended for you
            </p>
            <p className="text-gray-600 text-xs">
              Based on your recent mood patterns, we suggest starting with "
              <span className="font-semibold">Stress Relief Session</span>"
            </p>
          </div>
        </div>

        {/* Self-Assessment & Screening Tools Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.156-.47 2.454-.785 3.123-.785a9.004 9.004 0 018.337 5.514M12 18.75a6.75 6.75 0 00-6.75-6.75A6.75 6.75 0 005.57 6.438l.492-.544a4.5 4.5 0 01.321-.497m9.366 1.542a3 3 0 11-5.196-3 3 3 0 015.196 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6.75 6.75 0 01-6.75-6.75m6.75 6.75a6.75 6.75 0 00-6.75-6.75m6.75 6.75V12m-6.75 6.75c-.387.89-.787 1.76-1.2 2.617a.75.75 0 01-1.393-.578 12.001 12.001 0 01-1.332-6.521c-.021-.378-.041-.756-.062-1.135a.75.75 0 01.442-.693l2.884-.961a.75.75 0 01.898.397.75.75 0 01-.194.856l-1.652 1.503a.75.75 0 00-.238.618v1.365c.023.368.046.736.069 1.104"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800">
              Self-Assessment & Screening Tools
            </h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Anonymous, confidential screenings to understand your mental health
            patterns
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Assessment Cards (truncated for brevity) */}
          </div>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2">
              Your Progress Overview
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-gray-400 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v7.5a5.25 5.25 0 0010.5 0v-7.5A5.25 5.25 0 0012 1.5z"
                  clipRule="evenodd"
                />
                <path d="M12 20.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" />
              </svg>
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-lg font-bold text-green-600">Good</p>
                <p className="text-sm text-gray-600">Overall</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold text-gray-800">2/4</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-lg font-bold text-blue-600">Improving</p>
                <p className="text-sm text-gray-600">Trend</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-800 flex items-center mb-2">
              How assessments help your wellness
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-gray-400 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v7.5a5.25 5.25 0 0010.5 0v-7.5A5.25 5.25 0 0012 1.5z"
                  clipRule="evenodd"
                />
                <path d="M12 20.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" />
              </svg>
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Regular self-assessments help identify patterns and track your
              mental health journey. Results are kept confidential and can be
              shared with your therapist if you choose.
            </p>
          </div>
        </div>

      </div>

      <div className="flex justify-center p-6">
      {/* Container to make the two cards appear as one unified component */}
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-8xl">
        {/* Left Section */}
        <div className="p-6 w-full font-sans border-r border-gray-200">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.668.795c.783.153 1.53.305 2.242.457m-4.524-.457A9.38 9.38 0 0112 18c-2.484 0-4.757-.597-6.735-1.572M12 18v-8.25m0-4.75a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM9 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm9 0a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">
              Community & Peer Support
            </h2>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex items-center">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
            Connect with others on similar wellness journeys in our safe, moderated spaces
          </p>

          <div className="flex space-x-2 mb-8">
            <button className="flex-1 bg-green-200 text-green-700 font-semibold py-3 px-4 rounded-lg text-sm hover:bg-green-300 transition-colors">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.766a4.5 4.5 0 014.167-2.915h3.084a4.5 4.5 0 014.167 2.915M9.13 18.892a7.516 7.516 0 005.74 0M18 12.766a4.5 4.5 0 014.167-2.915h-3.084a4.5 4.5 0 01-4.167 2.915M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z"
                  />
                </svg>
                Join Discussion
              </div>
            </button>
            <button className="flex-1 bg-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-lg text-sm hover:bg-purple-300 transition-colors">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.213 6.942 12 9.004 12 2.062 0 9.004-4.787 9.004-12z"
                  />
                </svg>
                Share Story
              </div>
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-500 font-semibold text-sm flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-purple-500 mr-2 transform -rotate-45"
              >
                <path d="M12 21a9 9 0 009-9c0-1.803-.606-3.468-1.637-4.78l-.004-.002A9.004 9.004 0 0012 3a9 9 0 00-9 9c0 1.803.606 3.468 1.637 4.78l-.004-.002A9.004 9.004 0 0012 21z" />
                <path d="M12 3.75a8.25 8.25 0 00-7.87 6.42A8.25 8.25 0 0012 20.25a8.25 8.25 0 007.87-6.42A8.25 8.25 0 0012 3.75z" />
              </svg>
              Active Support Groups
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Anxiety Support Circle
                  </h4>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                    Anxiety
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Share experiences and support each other through anxiety challenges
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 17.25a7.5 7.5 0 0014.998 0H4.501z"
                      clipRule="evenodd"
                    />
                  </svg>
                  1,247 members
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2"></span>
                  23 online
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mx-2"></span>
                  Active 2 min ago
                </div>
              </div>
              <button className="bg-white border border-gray-300 text-blue-600 font-semibold py-2 px-6 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Join
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Mindfulness Practitioners
                  </h4>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                    Mindfulness
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Daily mindfulness practice and meditation discussions
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 17.25a7.5 7.5 0 0014.998 0H4.501z"
                      clipRule="evenodd"
                    />
                  </svg>
                  892 members
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2"></span>
                  15 online
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mx-2"></span>
                  Active 5 min ago
                </div>
              </div>
              <button className="bg-white border border-gray-300 text-blue-600 font-semibold py-2 px-6 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Join
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Sleep & Wellness Community
                  </h4>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                    Sleep
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Tips and support for better sleep hygiene and wellness
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 17.25a7.5 7.5 0 0014.998 0H4.501z"
                      clipRule="evenodd"
                    />
                  </svg>
                  634 members
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2"></span>
                  12 online
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mx-2"></span>
                  Active 12 min ago
                </div>
              </div>
              <button className="bg-white border border-gray-300 text-blue-600 font-semibold py-2 px-6 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Join
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Anxiety Support Circle
                  </h4>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                    Anxiety
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Share experiences and support each other through anxiety challenges
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 17.25a7.5 7.5 0 0014.998 0H4.501z"
                      clipRule="evenodd"
                    />
                  </svg>
                  1,247 members
                  <span className="h-1.5 w-1.5 bg-green-500 rounded-full mx-2"></span>
                  23 online
                  <span className="h-1.5 w-1.5 bg-gray-400 rounded-full mx-2"></span>
                  Active 2 min ago
                </div>
              </div>
              <button className="bg-white border border-gray-300 text-blue-600 font-semibold py-2 px-6 rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="p-6 w-full font-sans">
          <div className="mb-8">
            <h3 className="text-gray-500 font-semibold text-sm flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-purple-500 mr-2 transform -rotate-45"
              >
                <path d="M12 21a9 9 0 009-9c0-1.803-.606-3.468-1.637-4.78l-.004-.002A9.004 9.004 0 0012 3a9 9 0 00-9 9c0 1.803.606 3.468 1.637 4.78l-.004-.002A9.004 9.004 0 0012 21z" />
                <path d="M12 3.75a8.25 8.25 0 00-7.87 6.42A8.25 8.25 0 0012 20.25a8.25 8.25 0 007.87-6.42A8.25 8.25 0 0012 3.75z" />
              </svg>
              Recent Community Activity
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-start">
              <div className="bg-gray-200 text-gray-600 font-semibold text-sm h-8 w-8 rounded-full flex items-center justify-center mr-3">
                MK
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-sm text-gray-800">
                      Maya K.
                    </h4>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                      Anxiety Support
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Just tried the breathing exercise from yesterday's session and
                  it really helped with my morning anxiety...
                </p>
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M7.493 18.2c-.223 1.116-.948 1.884-2.052 1.884l-.372 1.346C3.968 22.845 3 22.41 3 20.913V12c0-2.209 1.791-4 4-4h8.25a.75.75 0 010 1.5H7.5A2.5 2.5 0 005 12v6.2h2.493zM16.5 6a.75.75 0 000 1.5h2.25a.75.75 0 01.75.75v8.25a.75.75 0 001.5 0V8.25a2.25 2.25 0 00-2.25-2.25H16.5z" />
                    </svg>
                    8
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M11.645 20.917c-.12.1-.25.17-.38.24-.26-.14-.49-.28-.7-.41-1.04-.65-1.92-1.39-2.73-2.19-2.02-1.99-3.7-4.14-4.83-6.49-1.12-2.35-1.28-5.1-.38-7.7.9-2.61 2.91-4.72 5.56-5.83 2.65-1.11 5.6-1.11 8.25 0 2.65 1.11 4.66 3.22 5.56 5.83.9 2.6-.26 5.35-1.38 7.7-1.13 2.35-2.81 4.5-4.83 6.49-.81.8-1.69 1.54-2.73 2.19-.21.13-.44.27-.7.41-.13-.07-.26-.14-.38-.24z" />
                    </svg>
                    12
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-start">
              <div className="bg-gray-200 text-gray-600 font-semibold text-sm h-8 w-8 rounded-full flex items-center justify-center mr-3">
                AR
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-sm text-gray-800">
                      Alex R.
                    </h4>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                      Mindfulness
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">15 min ago</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Week 3 of daily meditation complete! The 10-minute morning
                  sessions are becoming a habit...
                </p>
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M7.493 18.2c-.223 1.116-.948 1.884-2.052 1.884l-.372 1.346C3.968 22.845 3 22.41 3 20.913V12c0-2.209 1.791-4 4-4h8.25a.75.75 0 010 1.5H7.5A2.5 2.5 0 005 12v6.2h2.493zM16.5 6a.75.75 0 000 1.5h2.25a.75.75 0 01.75.75v8.25a.75.75 0 001.5 0V8.25a2.25 2.25 0 00-2.25-2.25H16.5z" />
                    </svg>
                    15
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="M11.645 20.917c-.12.1-.25.17-.38.24-.26-.14-.49-.28-.7-.41-1.04-.65-1.92-1.39-2.73-2.19-2.02-1.99-3.7-4.14-4.83-6.49-1.12-2.35-1.28-5.1-.38-7.7.9-2.61 2.91-4.72 5.56-5.83 2.65-1.11 5.6-1.11 8.25 0 2.65 1.11 4.66 3.22 5.56 5.83.9 2.6-.26 5.35-1.38 7.7-1.13 2.35-2.81 4.5-4.83 6.49-.81.8-1.69 1.54-2.73 2.19-.21.13-.44.27-.7.41-.13-.07-.26-.14-.38-.24z" />
                    </svg>
                    23
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-gray-500 font-semibold text-sm flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-green-500 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3 3v2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Community Guidelines
            </h3>
            <ul className="list-none text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500 mr-2 mt-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.15l-3.52 4.417a.75.75 0 01-1.096.069l-3.708-3.708a.75.75 0 011.06-1.06l2.946 2.946 3.036-3.804a.75.75 0 011.15-.208zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.5 9a3 3 0 100 6h15a3 3 0 100-6H4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Treat everyone with respect and kindness
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500 mr-2 mt-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.15l-3.52 4.417a.75.75 0 01-1.096.069l-3.708-3.708a.75.75 0 011.06-1.06l2.946 2.946 3.036-3.804a.75.75 0 011.15-.208zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.5 9a3 3 0 100 6h15a3 3 0 100-6H4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Share experiences, not medical advice
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500 mr-2 mt-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.15l-3.52 4.417a.75.75 0 01-1.096.069l-3.708-3.708a.75.75 0 011.06-1.06l2.946 2.946 3.036-3.804a.75.75 0 011.15-.208zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.5 9a3 3 0 100 6h15a3 3 0 100-6H4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Maintain privacy and confidentiality
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500 mr-2 mt-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.15l-3.52 4.417a.75.75 0 01-1.096.069l-3.708-3.708a.75.75 0 011.06-1.06l2.946 2.946 3.036-3.804a.75.75 0 011.15-.208zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4.5 9a3 3 0 100 6h15a3 3 0 100-6H4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Report concerning content to moderators
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
            <h3 className="text-sm font-semibold text-green-700 flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-green-500 mr-2"
              >
                <path d="M11.645 20.917c-.12.1-.25.17-.38.24-.26-.14-.49-.28-.7-.41-1.04-.65-1.92-1.39-2.73-2.19-2.02-1.99-3.7-4.14-4.83-6.49-1.12-2.35-1.28-5.1-.38-7.7.9-2.61 2.91-4.72 5.56-5.83 2.65-1.11 5.6-1.11 8.25 0 2.65 1.11 4.66 3.22 5.56 5.83.9 2.6-.26 5.35-1.38 7.7-1.13 2.35-2.81 4.5-4.83 6.49-.81.8-1.69 1.54-2.73 2.19-.21.13-.44.27-.7.41-.13-.07-.26-.14-.38-.24z" />
              </svg>
              Featured Success Story
            </h3>
            <p className="text-gray-700 italic text-sm mb-2">
              "Finding this community changed my healing journey. The support
              and understanding here helped me realize I wasn't alone in my
              struggles."
            </p>
            <p className="text-xs text-gray-500 font-medium">
              - Community Member
            </p>
          </div>
        </div>
      </div>
      </div>

    </div>
    <Footer />
    </>
  );
};

export default DashboardPage;
