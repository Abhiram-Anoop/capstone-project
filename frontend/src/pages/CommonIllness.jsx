// CommonIllness.jsx
import React from 'react';
import Header from "../assets/component/Header.jsx";
import Footer from "../assets/component/Footer.jsx";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";

// Data for common illnesses among farmers (Updated structure)
const illnesses = [
  {
    title: "Heat Exhaustion",
    symptoms: "Dizziness, heavy sweating, nausea, rapid heartbeat, and headache.",
    prevention: "Stay hydrated, wear light clothing, work during cooler hours, and take frequent breaks in the shade.",
    imageSrc: "/images/heatExhaustion.jpg", // Changed from 'icon' to 'imageSrc'
  },
  {
    title: "Pesticide Poisoning",
    symptoms: "Nausea, vomiting, skin rashes, muscle cramps, and difficulty breathing.",
    prevention: "Use proper protective equipment (gloves, masks, long sleeves), follow safety instructions, and wash hands thoroughly after use.",
    imageSrc: "/images/pesticide.jpg",
  },
  {
    title: "Sunburn and Skin Damage",
    symptoms: "Red, painful skin, blisters, and long-term risk of skin cancer.",
    prevention: "Use broad-spectrum sunscreen with high SPF, wear a wide-brimmed hat and long-sleeved shirts, and seek shade when possible.",
    imageSrc: "/images/sunburn.jpg",
  },
  {
    title: "Musculoskeletal Disorders",
    symptoms: "Chronic back pain, joint stiffness, muscle strain, and carpal tunnel syndrome.",
    prevention: "Use proper lifting techniques, stretch regularly, take breaks to rest muscles, and use ergonomic tools where possible.",
    imageSrc: "/images/musculoskeletal.jpg",
  },
  {
    title: "Respiratory Illnesses",
    symptoms: "Coughing, wheezing, shortness of breath, and asthma.",
    prevention: "Wear a face mask to avoid inhaling dust, mold, and pollen. Ensure proper ventilation in barns and storage areas.",
    imageSrc: "/images/respiratory.jpg",
  },
  {
    title: "Zoonotic Diseases",
    symptoms: "Fever, headaches, and other symptoms depending on the specific animal-transmitted disease (e.g., leptospirosis, brucellosis).",
    prevention: "Practice good hygiene, wear gloves when handling animals, and get vaccinated against diseases like rabies.",
    imageSrc: "/images/zoonotonic.jpg", // Corrected typo from zoonotonic to zoonotic if needed
  },
];

export default function CommonIllness() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-100 text-gray-800 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <HeartIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Common Illnesses in Farmers
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A guide to the most frequent health issues faced by farmers and how to prevent them.
          </p>
        </div>
      </section>
      
      {/* Illnesses Grid - MODIFIED SECTION */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main grid now has 2 columns on medium screens and up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {illnesses.map((illness, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Each card is now a grid: Image on left, Text on right (on large screens) */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section */}
                  <div className="flex items-center justify-center p-4">
                    <img
                      src={illness.imageSrc}
                      alt={illness.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {illness.title}
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-blue-700">Symptoms:</h4>
                        <p className="text-sm text-blue-900 mt-1">
                          {illness.symptoms}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-green-700">Prevention:</h4>
                        <p className="text-sm text-green-900 mt-1">
                          {illness.prevention}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}