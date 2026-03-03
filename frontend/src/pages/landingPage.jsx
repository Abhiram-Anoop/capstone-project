import React, { useState, useMemo, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import Header from "../assets/component/Header.jsx";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import FindDoctorButton from "../assets/component/FindDoctorButton.jsx";

const Chatbot = lazy(() => import("./Chatbot.jsx"));
const Footer = lazy(() => import("../assets/component/Footer.jsx"));

// Data mapping for image paths
const symptomImageMap = {
  fever: "/images/quicksymptom/fever.png",
  gastric: "/images/quicksymptom/gastricPain.jpg",
  bodyAches: "/images/quicksymptom/aches.webp",
  dustAllergy: "/images/quicksymptom/dustallergy.jpg",
  migraine: "/images/quicksymptom/migraine.jpg",
  cough: "/images/quicksymptom/cough.jpg",
  skinAllergy: "/images/quicksymptom/skininfection.jpg",
  eyeInfections: "/images/quicksymptom/eyeinfection.jpg",
};

const careOptionImageMap = {
  telemedicine: "/images/telemedicine.png",
  clinics: "/images/clinic.png",
  specialists: "/images/specialisedDoctor.png",
  medicine: "/images/urgentCare.png",
  commonIllnesses: "/images/commonillness.png",
  cycleTracker: "/images/MenstrualCycle.png",
};

// --- Explicit link mapping to match your App.jsx routes ---
const careOptionLinkMap = {
    telemedicine: "/telemedicine",
    clinics: "/clinics",
    specialists: "/specialised-doctor",
    medicine: "/find-medicine",
    commonIllnesses: "/common-illnesses",
    cycleTracker: "/cycle-tracker",
};


const symptomKeys = Object.keys(symptomImageMap);
const careOptionKeys = Object.keys(careOptionImageMap);

export default function LandingPage({ user }) {
  const { t, i18n } = useTranslation(['landingPage', 'common']);
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const symptoms = useMemo(() => symptomKeys.map(key => ({
      ...t(`symptoms.${key}`, { ns: 'landingPage', returnObjects: true }),
      key: key,
      bgImage: symptomImageMap[key],
  })), [t, i18n.language]);

  // CORRECTED: This now uses the careOptionLinkMap to generate the correct links
  const careOptions = useMemo(() => careOptionKeys.map(key => ({
      ...t(`careOptions.${key}`, { ns: 'landingPage', returnObjects: true }),
      key: key,
      image: careOptionImageMap[key],
      link: careOptionLinkMap[key], 
  })), [t, i18n.language]);

  const currentSelectedSymptom = selectedSymptom
    ? symptoms.find(s => s.key === selectedSymptom.key)
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      
      <FindDoctorButton />
      <Suspense fallback={<div>{t('loading', { ns: 'common' })}...</div>}>
        <Chatbot />
      </Suspense>

      <main className="flex-grow">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center bg-no-repeat min-h-[92vh]"
          style={{ backgroundImage: `url(/images/landingPage.png)` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-2xl space-y-6 text-white">
              <span className="inline-flex items-center bg-green-600 text-white rounded-full px-4 py-1.5 text-sm font-medium">
                <HeartIcon className="h-4 w-4 mr-2" />
                {t('hero.badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {t('hero.title')}
                <span className="text-green-300">{t('hero.titleHighlight')}</span>
              </h2>
              <p className="text-lg text-gray-100">{t('hero.subtitle')}</p>
            </div>
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <Link to="/choicePage" className="flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-full font-semibold text-base text-white bg-[#06779B] hover:bg-[#045f73] transition-colors duration-300 shadow-lg">
                  <HeartIcon className="w-5 h-5 mr-3" />
                  {t('hero.primaryButton')}
                  <ArrowRightIcon className="w-4 h-4 ml-3" />
                </Link>
                <Link to="/dietgeneration" className="flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-full font-semibold text-base text-[#06779B] bg-white border border-[#06779B] hover:bg-[#e6f7fb] transition-colors duration-300 shadow-lg">
                  <CalendarDaysIcon className="w-5 h-5 mr-3" />
                  {t('hero.secondaryButton')}
                  <ArrowRightIcon className="w-4 h-4 ml-3" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-200">{t('hero.features.secure')}</span>
                </div>
                <div className="flex items-center justify-center bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
                  <CheckBadgeIcon className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-sm text-gray-200">{t('hero.features.verified')}</span>
                </div>
                <div className="flex items-center justify-center bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
                  <UserGroupIcon className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-sm text-gray-200">{t('hero.features.expert')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Care Section */}
        <div className="py-16">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <HeartIcon className="h-4 w-4 mr-2" />
              {t('careSection.badge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              {t('careSection.heading')} <span className="text-blue-500">{t('careSection.highlight')}</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl px-4">{t('careSection.subtext')}</p>
          </div>
        </div>

        {/* Care Options Grid */}
        <div className="bg-white pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careOptions.map((option) => (
                <Link key={option.key} to={option.link} className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${option.image})` }}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
                  </div>
                  <div className="relative p-8 h-full flex flex-col justify-center items-center text-center text-white min-h-[20rem]">
                    <h3 className="text-3xl font-bold tracking-wider">{option.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="bg-gray-50 py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="inline-flex items-center bg-green-500 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                {t('symptomsSection.badge')}
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
                {t('symptomsSection.heading')}
              </h2>
              <p className="text-lg text-gray-600 max-w-xl">{t('symptomsSection.subtext')}</p>
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0">
              {symptoms.map((symptom) => (
                <motion.div key={symptom.key} layoutId={`symptom-${symptom.key}`} onClick={() => setSelectedSymptom(symptom)} className="flex-none w-72 h-80 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${symptom.bgImage})` }}></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
                    <motion.h3 layoutId={`title-${symptom.key}`} className="text-xl font-bold">{symptom.title}</motion.h3>
                    <div className="mt-4 pt-4 border-t border-white/30 text-sm font-medium text-gray-300">{symptom.specialist}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {currentSelectedSymptom && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedSymptom(null)}>
                  <motion.div layoutId={`symptom-${currentSelectedSymptom.key}`} className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                    <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${currentSelectedSymptom.bgImage})` }}>
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                        <motion.h3 layoutId={`title-${currentSelectedSymptom.key}`} className="text-3xl font-bold">{currentSelectedSymptom.title}</motion.h3>
                      </div>
                    </div>
                    <div className="p-8">
                      <p className="text-gray-700 leading-relaxed mb-6 text-lg">{currentSelectedSymptom.description}</p>
                      <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-4">
                        <div className="mb-4 sm:mb-0">
                          <span className="text-sm font-medium text-gray-500 block">
                            {t('specialist', { ns: 'common' })}
                            <span className="text-blue-600 font-bold ml-2">{currentSelectedSymptom.specialist}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link to={`/find-doctor?specialist=${currentSelectedSymptom.specialist}`} className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition inline-flex items-center">
                            {t('findDoctor', { ns: 'common' })}
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </Link>
                          <button onClick={() => setSelectedSymptom(null)} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                            {t('close', { ns: 'common' })}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Suspense fallback={<div>{t('loading', { ns: 'common' })}...</div>}>
          <Footer />
      </Suspense>
    </div>
  );
}

