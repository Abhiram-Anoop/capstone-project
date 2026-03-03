import React, { useState } from "react";
import Header from "../assets/component/Header.jsx";
import { dietData } from "./dietData.jsx";
import DietPlanDisplay from "./DietPlanDisplay";
import { useNavigate } from "react-router-dom";
import Footer from "../assets/component/Footer.jsx";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../assets/component/card";
import { Label } from "../assets/component/lable.jsx";
import { Input } from "../assets/component/input.jsx";
import { Apple, User, Scale, TrendingUp } from "lucide-react";
import { Button } from "../assets/component/button.jsx";
import { Badge } from "../assets/component/badge.jsx";
import { Checkbox } from "../assets/component/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const DietForm = () => {
  const navigate = useNavigate();
  const [selectedDietPreferences, setSelectedDietPreferences] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Goals");
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
  });
  const [dietPlan, setDietPlan] = useState(null);

  const categories = [
    "All",
    ...Array.from(new Set(dietData.map((d) => d.category))),
  ];

  const filteredDietOptions =
    selectedCategory === "All"
      ? dietData
      : dietData.filter((d) => d.category === selectedCategory);

  const handleDietPreferenceChange = (dietId, checked) => {
    if (checked) {
      setSelectedDietPreferences([...selectedDietPreferences, dietId]);
    } else {
      setSelectedDietPreferences(
        selectedDietPreferences.filter((id) => id !== dietId)
      );
    }
  };

  const handleUserDetailsChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  // Add this function inside your DietForm component:
  const handleSubmit = async () => {
    // Validation
    if (
      !userDetails.name ||
      !userDetails.age ||
      !userDetails.height ||
      !userDetails.weight
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (selectedDietPreferences.length === 0) {
      alert("Please select at least one diet preference.");
      return;
    }

    const UserDietData = {
      name: userDetails.name,
      age: userDetails.age,
      height: userDetails.height,
      weight: userDetails.weight,
      selectedDiet: dietData
        .filter((d) => selectedDietPreferences.includes(d.id))
        .map((d) => ({ id: d.id, name: d.name, category: d.category })),
    };
    console.log("dietDatat");
    try {
      const response = await axios.post(
        `${ "https://ai-doctor-assistant-backend-ai-ml.onrender.com"||  import.meta.env.VITE_API_BASE_URL  }/api/generate-diet-plan`
, // change port if needed
        { userDietData: UserDietData }
      );
      // Navigate to diet plan page with data
      navigate("/dietDisplay", {
        state: {
          dietPlan: response.data.dietPlan,
          userDetails: userDetails,
          selectedDiet: UserDietData.selectedDiet,
        },
      });

      console.log("Received result:", response.data);
      setDietPlan(response.data.dietPlan);
      alert("Your personalized diet plan has been generated!");
    } catch (error) {
      console.error("Error generating diet plan:", error);
      alert("There was an error generating your diet plan. Please try again.");
    }
  };

  // MAIN RETURN (merged DietGeneration)
  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 relative top-15">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-green-100 flex items-center justify-center">
              <Apple className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Diet Plan Generator
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-green-600 text-sm sm:text-base">
            Tell us about your goals and preferences to get a personalized diet
            plan tailored just for you.
          </p>
        </div>

        {/* User Details */}
        <Card className="border border-black/10 bg-white shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Please provide your details for personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="flex items-center text-gray-700"
                >
                  <User className="w-4 h-4 mr-2 text-green-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={handleUserDetailsChange}
                  placeholder="John Doe"
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="age"
                  className="flex items-center text-gray-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={userDetails.age}
                  onChange={handleUserDetailsChange}
                  placeholder="30"
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="height"
                  className="flex items-center text-gray-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={userDetails.height}
                  onChange={handleUserDetailsChange}
                  placeholder="170"
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="weight"
                  className="flex items-center text-gray-700"
                >
                  <Scale className="w-4 h-4 mr-2 text-green-500" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={userDetails.weight}
                  onChange={handleUserDetailsChange}
                  placeholder="70"
                  className="focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* category */}

        {/* Category Filter */}
        <Card className="border border-black/10 bg-white shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 hover:cursor-pointer">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-200 rounded-full hover:cursor-pointer ${
                    selectedCategory === category
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* deit selection */}
        {/* Selected Preferences Summary */}
        {selectedDietPreferences.length > 0 && (
          <Card className="border-primary/20 bg-primary-light/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Badge variant="secondary" className="px-2 py-1">
                  {selectedDietPreferences.length}
                </Badge>
                Selected Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dietData
                  .filter((d) => selectedDietPreferences.includes(d.id))
                  .map((dietItem) => (
                    <Badge
                      key={dietItem.id}
                      variant="default"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {dietItem.icon}
                      {dietItem.name}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* choose preference */}

        <Card className="border border-black/10 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Select Your Diet Preferences
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose all preferences that match your dietary goals and
              restrictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 transition-all duration-300"
            >
              <AnimatePresence>
                {filteredDietOptions.map((dietOption) => (
                  <motion.div
                    key={dietOption.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
              ${
                selectedDietPreferences.includes(dietOption.id)
                  ? "border-green-500 bg-green-100 shadow-green-200 shadow-md"
                  : "border-black/10 bg-white hover:border-green-300 hover:bg-green-50"
              }`}
                    onClick={() =>
                      handleDietPreferenceChange(
                        dietOption.id,
                        !selectedDietPreferences.includes(dietOption.id)
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      id={dietOption.id}
                      checked={selectedDietPreferences.includes(dietOption.id)}
                      onChange={(e) =>
                        handleDietPreferenceChange(
                          dietOption.id,
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-green-600">{dietOption.icon}</div>
                      <label
                        htmlFor={dietOption.id}
                        className="font-medium text-foreground cursor-pointer flex-1"
                      >
                        {dietOption.name}
                      </label>
                      <Badge
                        variant="outline"
                        className="text-xs hidden sm:block"
                      >
                        {dietOption.category}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </div>
      {/* Submit Button */}
      <div className="flex justify-center p-10">
        {/* Submit Button */}
        <div className="flex justify-center p-10">
          <button
            onClick={handleSubmit}
            disabled={
              selectedDietPreferences.length === 0 ||
              !userDetails.name ||
              !userDetails.age
            }
            className="px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded-lg hover:cursor-pointer disabled:hover:bg-green-500"
          >
            Create My Diet Plan
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default DietForm;
