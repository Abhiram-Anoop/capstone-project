// src/pages/ChoicePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../assets/component/Header';
import Footer from '../assets/component/Footer';

const ChoicePage = () => {
  return (
    <>
    <Header/>
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-8">How would you like to input your symptoms?</h1>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link to="/vocal-input">
          <button className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors hover:cursor-pointer">
            <span className="mr-2 text-xl">🎙️</span>
            <span>Speak My Symptoms</span>
          </button>
        </Link>
        <Link to="/type-input">
          <button className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors hover:cursor-pointer">
            <span className="mr-2 text-xl">⌨️</span>
            <span>Type My Symptoms</span>
          </button>
        </Link>
      </div>
    </div>
    <Footer/></>
  );
};

export default ChoicePage;