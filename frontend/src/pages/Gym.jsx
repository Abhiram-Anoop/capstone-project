import React, { useState } from "react";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";
import JointTracker from "./JointTracker"; // Import JointTracker for the practice session
import { Button } from "../assets/component/button";
import GymPractice from "./GymPractice"; // Import the new GymPractice component
import { Card, CardContent, CardHeader, CardTitle } from "../assets/component/card";
import { Badge } from "../assets/component/badge";
import { FaStethoscope } from "react-icons/fa";

// Data for all the gym exercises
const exercises = [
  {
    title: "Push-ups",
    subtitle: "Classic bodyweight exercise for upper body strength",
    difficulty: "Beginner",
    calories: "8",
    reps: "8-15",
    sets: "3",
    rest: "60 seconds",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    iconColor: "bg-yellow-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Push-ups">
        💪
      </span>
    ),
  },
  {
    title: "Squats",
    subtitle: "Fundamental lower body movement for leg strength",
    difficulty: "Beginner",
    calories: "10",
    reps: "12-20",
    sets: "3",
    rest: "90 seconds",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    iconColor: "bg-yellow-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Squats">
        🏋️‍♂️
      </span>
    ),
  },
  {
    title: "Deadlifts",
    subtitle: "King of all exercises for posterior chain development",
    difficulty: "Intermediate",
    calories: "15",
    reps: "6-10",
    sets: "3",
    rest: "2-3 minutes",
    targetMuscles: ["Hamstrings", "Glutes", "Back", "Core"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Deadlifts">
        🏋️
      </span>
    ),
  },
  {
    title: "Pull-ups",
    subtitle: "Ultimate upper body pulling exercise",
    difficulty: "Intermediate",
    calories: "12",
    reps: "5-12",
    sets: "3",
    rest: "2 minutes",
    targetMuscles: ["Back", "Biceps", "Forearms"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Pull-ups">
        🧗
      </span>
    ),
  },
  {
    title: "Bench Press",
    subtitle: "Classic chest building exercise",
    difficulty: "Intermediate",
    calories: "14",
    reps: "8-12",
    sets: "3",
    rest: "2 minutes",
    targetMuscles: ["Chest", "Shoulders", "Triceps"],
    iconColor: "bg-blue-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Bench Press">
        💪
      </span>
    ),
  },
  {
    title: "Plank",
    subtitle: "Isometric core strengthening exercise",
    difficulty: "Beginner",
    calories: "5",
    reps: "30-60 seconds",
    sets: "3",
    rest: "60 seconds",
    targetMuscles: ["Core", "Abs", "Back"],
    iconColor: "bg-green-100",
    icon: (
      <span className="text-4xl" role="img" aria-label="Plank">
        🧘‍♀️
      </span>
    ),
  },
];

const ExerciseCard = ({ exercise, onSelectExercise }) => {
  if (!exercise || !exercise.targetMuscles) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col h-full">
        {/* Icon & Title Section */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`rounded-xl p-3 ${exercise.iconColor}`}>
            {exercise.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">
              {exercise.title}
            </h3>
            <p className="text-sm text-gray-500">{exercise.calories} cal/set</p>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-4">{exercise.subtitle}</p>

        {/* Difficulty Pill */}
        <span
          className={`inline-block text-sm font-semibold rounded-full px-3 py-1 mb-4 ${
            exercise.difficulty === "Beginner"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {exercise.difficulty}
        </span>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium mb-4">
          <div>
            <span className="block text-gray-800">{exercise.sets}</span>
            <span className="block text-gray-500">Sets</span>
          </div>
          <div>
            <span className="block text-gray-800">{exercise.reps}</span>
            <span className="block text-gray-500">Reps</span>
          </div>
          <div>
            <span className="block text-gray-800">{exercise.rest}</span>
            <span className="block text-gray-500">Rest</span>
          </div>
        </div>

        {/* Target Muscles */}
        <div className="border-t border-gray-200 pt-4 mt-auto">
          <p className="text-sm font-medium text-gray-800 mb-2">
            Target Muscles:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {exercise.targetMuscles.map((muscle, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 rounded-full px-2 py-1"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Practice button */}
        <div className="mt-4">
          <button
            onClick={() => onSelectExercise(exercise)}
            className="w-full text-blue-500 font-semibold py-3 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors"
          >
            Start Exercise
          </button>
        </div>
      </div>
    </div>
  );
};

const GymPage = () => {
  const categories = ["All Exercises", "Chest", "Back", "Legs", "Core"];
  const activeCategory = "All Exercises";
  const displayOptions = ["Individual Exercises", "Workout Plans"];
  const activeDisplay = "Individual Exercises";

  const [viewMode, setViewMode] = useState("list");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setViewMode("practice");
  };

  const handleEndPractice = () => {
    setViewMode("list");
    setSelectedExercise(null);
  };

  // Conditional rendering to switch between the list and practice views
  if (viewMode === "practice" && selectedExercise) {
    return (
      <GymPractice
        exercise={selectedExercise}
        onEndPractice={handleEndPractice}
      />
    );
  }

  return (
    <>
      <Header />
      <div className="bg-white mb-10">
        <div className="bg-gray-50 py-16 px-4 md:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Transform Your Body
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Gym Workouts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional strength training programs designed to help you build
            muscle, lose fat, and get stronger
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
              <span>Targeted Workouts</span>
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
              <span>Progressive Training</span>
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
              <span>Proven Results</span>
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

        {/* Exercise Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                exercise={exercise}
                onSelectExercise={handleSelectExercise}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GymPage;