import React from "react";
import { Link } from "react-router-dom";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";

const BulletPoint = ({ text }) => (
  <li className="flex items-center space-x-2 text-gray-600">
    <span className="text-green-500">✔</span>
    <span>{text}</span>
  </li>
);

const Rating = ({ score }) => (
  <p className="text-yellow-500 font-semibold mt-1">⭐ {score}</p>
);

const Card = ({ title, icon, bgColor, description, points, link, rating }) => (
  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
    <div>
      <div className="flex justify-center mb-5">
        <div
          className={`${bgColor} rounded-full w-20 h-20 flex items-center justify-center shadow-sm`}
        >
          <span className="text-4xl">{icon}</span>
        </div>
      </div>
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <Rating score={rating} />
      </div>
      <p className="text-center text-gray-500 mb-6">{description}</p>
      <ul className="list-none space-y-2 mb-6">
        {points.map((point, i) => (
          <BulletPoint key={i} text={point} />
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <Link
        to={link}
        className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-full font-medium shadow hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Explore {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>
  </div>
);

const WellnessJourneyPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-grow py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6 shadow">
              For your Fitness
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover personalized fitness solutions designed to help you
              achieve your health goals.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card
              title="Yoga"
              icon="🧘‍♀️"
              bgColor="bg-yellow-100"
              rating="4.9"
              description="Find inner peace and flexibility with guided yoga sessions"
              points={["Beginner Friendly", "Expert Instructors", "Stress Relief"]}
              link="/Yoga"
            />
            <Card
              title="Gym"
              icon="💪"
              bgColor="bg-blue-100"
              rating="4.8"
              description="Strength training and cardio workouts for all fitness levels"
              points={["Professional Equipment", "Personal Training", "Group Classes"]}
              link="/Gym"
            />
            <Card
              title="Diet Planner"
              icon="🥗"
              bgColor="bg-purple-100"
              rating="4.9"
              description="Personalized nutrition plans tailored to your health goals"
              points={["Custom Meal Plans", "Nutritionist Approved", "Health Tracking"]}
              link="/DietGeneration"
            />
            <Card
              title="Mental Health"
              icon="🧠"
              bgColor="bg-green-100"
              rating="4.9"
              description="Guided meditations, mood tracking, and self-assessment tools"
              points={["Anxiety Relief", "Mindfulness Exercises", "Stress Management"]}
              link="/MentalHealth"
            />
            <Card
              title="Zumba"
              icon="💃"
              bgColor="bg-pink-100"
              rating="4.8"
              description="Upbeat, dance-based workouts to boost your energy and improve mood"
              points={["Cardio Workouts", "Rhythmic Exercise", "Full-Body Fitness"]}
              link="/Zumba"
            />
            <Card
              title="Meditation"
              icon="🧘"
              bgColor="bg-blue-100"
              rating="4.9"
              description="Guided sessions to calm your mind, improve focus, and reduce stress"
              points={["Mindfulness", "Breathing Exercises", "Inner Peace"]}
              link="/Meditation"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WellnessJourneyPage;
