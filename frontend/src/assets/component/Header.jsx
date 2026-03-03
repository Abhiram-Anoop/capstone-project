import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../supabaseClient";

// Removed the invalid import from public/
// import finalLogo from "../../public/images/finalLogo.jpg";

import LanguageSwitcher from "../../LanguageSwitcher";

const Header = ({ user }) => {
  // Explicitly specify the 'common' namespace for translations
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loginPage = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const userDisplayName =
    user?.user_metadata?.full_name || user?.email.split("@")[0] || "";

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section: Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src="/images/finalLogo.jpg" alt="Logo" className="h-14 w-auto" />
        <span className="text-xl font-bold text-gray-800">DhavanthRam Care</span>
      </div>

      {/* Center Section: Navigation */}
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          {t("header.navigation.home")}
        </Link>
        <Link to="/type-input" className="text-gray-700 hover:text-blue-500">
          {t("header.navigation.symptoms")}
        </Link>
        <Link to="/find-doctor" className="text-gray-700 hover:text-blue-500">
          {t("header.navigation.findDoctor")}
        </Link>
        <Link
          to="/WellnessJourneyPage"
          className="text-gray-700 hover:text-blue-500"
        >
          {t("header.navigation.fitness")}
        </Link>
      </nav>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Desktop User Section */}
        {user ? (
          <div className="hidden md:flex items-center space-x-3">
            <span className="font-medium text-gray-700 text-sm">
              {t("header.actions.welcome")}, {userDisplayName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 text-sm"
            >
              {t("header.actions.logout")}
            </button>
          </div>
        ) : (
          <button
            onClick={loginPage}
            className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            {t("header.actions.getStarted")}
          </button>
        )}

        {/* Mobile Welcome Message */}
        {user && (
          <div className="md:hidden flex items-center max-w-[150px] overflow-hidden">
            <span className="font-medium text-gray-700 text-sm truncate">
              {t("header.actions.welcome")}, {userDisplayName}!
            </span>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden z-40">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-500 py-2 text-center"
              onClick={closeMobileMenu}
            >
              {t("header.navigation.home")}
            </Link>
            <Link
              to="/type-input"
              className="text-gray-700 hover:text-blue-500 py-2 text-center"
              onClick={closeMobileMenu}
            >
              {t("header.navigation.symptoms")}
            </Link>
            <Link
              to="/find-doctor"
              className="text-gray-700 hover:text-blue-500 py-2 text-center"
              onClick={closeMobileMenu}
            >
              {t("header.navigation.findDoctor")}
            </Link>
            <Link
              to="/WellnessJourneyPage"
              className="text-gray-700 hover:text-blue-500 py-2 text-center"
              onClick={closeMobileMenu}
            >
              {t("header.navigation.fitness")}
            </Link>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-center py-2">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 w-full"
                >
                  {t("header.actions.logout")}
                </button>
              ) : (
                <button
                  onClick={() => {
                    loginPage();
                    closeMobileMenu();
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 w-full"
                >
                  {t("header.actions.getStarted")}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
