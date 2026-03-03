import React from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FindDoctorButton = () => {
  // Use the 'common' namespace to get the translations
  const { t } = useTranslation('common');

  return (
    <Link
      to="/clinics"
      className="fixed top-20 right-4 z-50 group sm:top-28 sm:right-8"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-red-500 rounded-full opacity-75 animate-ping group-hover:animate-none sm:-inset-2"></div>

        <button
          className="relative flex flex-col items-center justify-center 
                       w-20 h-20 sm:w-28 sm:h-28 
                       bg-red-600 text-white rounded-full shadow-2xl 
                       transition-transform duration-300 transform group-hover:scale-110"
        >
          <FaStethoscope className="h-6 w-6 mb-1 sm:h-8 sm:w-8" />
          <span className="text-xs font-bold text-center leading-tight sm:text-sm">
            {/* Use the translation keys */}
            {t('findNearbyClinics.line1')} <br /> {t('findNearbyClinics.line2')}
          </span>
        </button>
      </div>
    </Link>
  );
};

export default FindDoctorButton;
