import React, { useState } from 'react';
import { HeartIcon, ShieldCheckIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";  // ✅ import this at the top

const LoginForm = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [errors, setErrors] = useState({});
  const [bio, setBio] = useState("");
  const [isDataSubmit, setIsDataSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  if (currentState === "Sign up" && !formData.fullName) newErrors.fullName = 'Full name is required';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    if (currentState === "login") {
      // ✅ Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      
      // 🔑 Store user info in localStorage for chat
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: 'patient'
      }));
      
    } else {
      // ✅ Signup
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "patient",
          },
        },
      });
      if (error) throw error;
      
      // 🔑 Store user info for chat
      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: 'patient'
      }));
    }

    alert(`${currentState === "Sign up" ? "Account created" : "Login"} successful!`);
    navigate("/");

  } catch (err) {
    console.error("Auth error:", err.message);
    alert(err.message);
  }
};

  const handleDataSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      const newErrors = {};
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      setErrors(newErrors);
      return;
    }
    setIsDataSubmit(true);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex items-center bg-blue-50 text-blue-500 rounded-full px-4 py-2 mb-4">
            <HeartIcon className="h-5 w-5 mr-2 top-4 relative" />
            <span className="text-sm font-medium top-4 relative">Healthcare Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isDataSubmit ? "Tell us about yourself" : 
             currentState === "Sign up" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isDataSubmit ? "Help us personalize your experience" :
             currentState === "Sign up" ? "Join our healthcare community" : "Sign in to your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-7 relative">
          {/* Back Button for Bio Step */}
          {isDataSubmit && (
            <button
              onClick={() => setIsDataSubmit(false)}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
          )}

          <div className="space-y-6">
            {/* Full Name (Sign up only, not in bio step) */}
            {currentState === "Sign up" && !isDataSubmit && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <span className="mr-1">⚠</span> {errors.fullName}
                  </p>
                )}
              </div>
            )}

            {/* Email and Password (not shown in bio step) */}
            {!isDataSubmit && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <span className="mr-1">⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <span className="mr-1">⚠</span> {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Bio Textarea (only shown in bio step) */}
            {currentState === "Sign up" && isDataSubmit && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tell us about yourself (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Share your health goals, interests, or anything that helps us serve you better..."
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="space-y-4">
              {currentState === "Sign up" && !isDataSubmit ? (
                <button
                  type="button"
                  onClick={handleDataSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              ) : (
                <button
  onClick={(e) => {
    handleSubmit(e);       // run validation + form submission

  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {currentState === "Sign up" ? "Create Account" : "Sign In"}
                </button>
              )}

              {/* Forgot Password (login only) */}
              {currentState === "login" && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Switch between Sign up and Login */}
          {!isDataSubmit && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                {currentState === "Sign up" ? (
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setCurrentState("login");
                        setFormData({ email: '', password: '', fullName: '' });
                        setErrors({});
                      }}
                      className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setCurrentState("Sign up");
                        setFormData({ email: '', password: '', fullName: '' });
                        setErrors({});
                      }}
                      className="text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                    >
                      Create account
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center mt-6 text-gray-500 text-sm">
          <ShieldCheckIcon className="h-4 w-4 mr-2" />
          <span>Secure & confidential</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 