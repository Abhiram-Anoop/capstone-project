import React from "react";
import { Link } from "react-router-dom";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";

const Fitness = ({ user }) => {
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0];

  return (
    <>
      <Header user={user} />
      <div className="min-h-screen relative bg-white py-20 px-6 overflow-hidden">
        {/* Subtle Background Blobs for Depth */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-gray-300 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto text-center mb-16">
          {user ? (
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Welcome, {userName}! 👋
            </h1>
          ) : (
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Start Your Fitness Journey 🚀
            </h1>
          )}
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a path that inspires you and begin your transformation today.
          </p>
          <div className="mt-6 h-1 w-24 bg-gray-300 rounded-full mx-auto"></div>
        </div>

        {/* Cards Section */}
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Yoga */}
          <Link
            to="/Yoga"
            className="group block transform transition duration-300 hover:-translate-y-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-purple-100 mb-6">
                <span className="text-5xl">🧘‍♀️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Yoga</h2>
              <ul className="text-gray-600 leading-relaxed space-y-1">
                <li>✔ Improve flexibility</li>
                <li>✔ Boost mindfulness</li>
                <li>✔ Stress reduction</li>
              </ul>
            </div>
          </Link>

          {/* Gym */}
          <Link
            to="/Gym"
            className="group block transform transition duration-300 hover:-translate-y-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100 mb-6">
                <span className="text-5xl">💪</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Gym</h2>
              <ul className="text-gray-600 leading-relaxed space-y-1">
                <li>✔ Strength training</li>
                <li>✔ Cardio endurance</li>
                <li>✔ Muscle building</li>
              </ul>
            </div>
          </Link>

          {/* Zumba */}
          <Link
            to="/Jumba"
            className="group block transform transition duration-300 hover:-translate-y-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-pink-100 mb-6">
                <span className="text-5xl">💃</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Zumba</h2>
              <ul className="text-gray-600 leading-relaxed space-y-1">
                <li>✔ Fun dance workouts</li>
                <li>✔ High energy cardio</li>
                <li>✔ Burn calories fast</li>
              </ul>
            </div>
          </Link>

          {/* Meditation */}
          <Link
            to="/Meditation"
            className="group block transform transition duration-300 hover:-translate-y-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-6">
                <span className="text-5xl">🧘‍♂️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Meditation
              </h2>
              <ul className="text-gray-600 leading-relaxed space-y-1">
                <li>✔ Reduce anxiety</li>
                <li>✔ Increase focus</li>
                <li>✔ Emotional balance</li>
              </ul>
            </div>
          </Link>

          {/* Mental Health */}
          <Link
            to="/MentalHealth"
            className="group block transform transition duration-300 hover:-translate-y-2"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
                <span className="text-5xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Mental Health
              </h2>
              <ul className="text-gray-600 leading-relaxed space-y-1">
                <li>✔ Stress management</li>
                <li>✔ Better sleep</li>
                <li>✔ Emotional wellness</li>
              </ul>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Fitness;
