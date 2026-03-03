import { 
  Apple, Beef, Fish, Milk, Wheat, Carrot, Leaf, 
  Cherry, Egg, Coffee, Droplets, Clock, Target,
  Heart, Zap, Shield, Activity, Scale, TreePine 
} from "lucide-react";

export const dietData = [
  // Goals
  { id: "weight-loss", name: "Weight Loss", category: "Goals", icon: <Scale className="w-4 h-4" /> },
  { id: "weight-gain", name: "Weight Gain", category: "Goals", icon: <Target className="w-4 h-4" /> },
  { id: "muscle-gain", name: "Muscle Gain", category: "Goals", icon: <Activity className="w-4 h-4" /> },
  { id: "maintenance", name: "Weight Maintenance", category: "Goals", icon: <Heart className="w-4 h-4" /> },
  { id: "energy-boost", name: "Energy Boost", category: "Goals", icon: <Zap className="w-4 h-4" /> },
  { id: "immunity", name: "Boost Immunity", category: "Goals", icon: <Shield className="w-4 h-4" /> },

  // Dietary Preferences
  { id: "vegetarian", name: "Vegetarian", category: "Dietary Preferences", icon: <Leaf className="w-4 h-4" /> },
  { id: "vegan", name: "Vegan", category: "Dietary Preferences", icon: <TreePine className="w-4 h-4" /> },
  { id: "non-vegetarian", name: "Non-Vegetarian", category: "Dietary Preferences", icon: <Beef className="w-4 h-4" /> },
  { id: "pescatarian", name: "Pescatarian", category: "Dietary Preferences", icon: <Fish className="w-4 h-4" /> },
  { id: "keto", name: "Keto", category: "Dietary Preferences", icon: <Droplets className="w-4 h-4" /> },
  { id: "paleo", name: "Paleo", category: "Dietary Preferences", icon: <Apple className="w-4 h-4" /> },
  { id: "mediterranean", name: "Mediterranean", category: "Dietary Preferences", icon: <Fish className="w-4 h-4" /> },
  { id: "low-carb", name: "Low Carb", category: "Dietary Preferences", icon: <Wheat className="w-4 h-4" /> },

  // Food Preferences
  { id: "fruits", name: "Fruits", category: "Food Preferences", icon: <Apple className="w-4 h-4" /> },
  { id: "vegetables", name: "Vegetables", category: "Food Preferences", icon: <Carrot className="w-4 h-4" /> },
  { id: "lean-proteins", name: "Lean Proteins", category: "Food Preferences", icon: <Beef className="w-4 h-4" /> },
  { id: "seafood", name: "Seafood", category: "Food Preferences", icon: <Fish className="w-4 h-4" /> },
  { id: "dairy", name: "Dairy Products", category: "Food Preferences", icon: <Milk className="w-4 h-4" /> },
  { id: "eggs", name: "Eggs", category: "Food Preferences", icon: <Egg className="w-4 h-4" /> },
  { id: "grains", name: "Whole Grains", category: "Food Preferences", icon: <Wheat className="w-4 h-4" /> },
  { id: "nuts-seeds", name: "Nuts & Seeds", category: "Food Preferences", icon: <Cherry className="w-4 h-4" /> },
  { id: "legumes", name: "Legumes", category: "Food Preferences", icon: <Leaf className="w-4 h-4" /> },

  // Allergies & Restrictions
  { id: "gluten-free", name: "Gluten Free", category: "Allergies & Restrictions", icon: <Wheat className="w-4 h-4" /> },
  { id: "lactose-intolerant", name: "Lactose Intolerant", category: "Allergies & Restrictions", icon: <Milk className="w-4 h-4" /> },
  { id: "nut-allergy", name: "Nut Allergy", category: "Allergies & Restrictions", icon: <Cherry className="w-4 h-4" /> },
  { id: "shellfish-allergy", name: "Shellfish Allergy", category: "Allergies & Restrictions", icon: <Fish className="w-4 h-4" /> },
  { id: "egg-allergy", name: "Egg Allergy", category: "Allergies & Restrictions", icon: <Egg className="w-4 h-4" /> },
  { id: "soy-allergy", name: "Soy Allergy", category: "Allergies & Restrictions", icon: <Leaf className="w-4 h-4" /> },
  { id: "low-sodium", name: "Low Sodium", category: "Allergies & Restrictions", icon: <Droplets className="w-4 h-4" /> },
  { id: "diabetic", name: "Diabetic Friendly", category: "Allergies & Restrictions", icon: <Target className="w-4 h-4" /> },

  // Meal Timing
  { id: "breakfast", name: "Breakfast Focus", category: "Meal Timing", icon: <Coffee className="w-4 h-4" /> },
  { id: "lunch", name: "Lunch Focus", category: "Meal Timing", icon: <Clock className="w-4 h-4" /> },
  { id: "dinner", name: "Dinner Focus", category: "Meal Timing", icon: <Clock className="w-4 h-4" /> },
  { id: "snacks", name: "Healthy Snacks", category: "Meal Timing", icon: <Apple className="w-4 h-4" /> },
  { id: "intermittent-fasting", name: "Intermittent Fasting", category: "Meal Timing", icon: <Clock className="w-4 h-4" /> },
  { id: "frequent-meals", name: "Frequent Small Meals", category: "Meal Timing", icon: <Clock className="w-4 h-4" /> },

  // Activity Level
  { id: "sedentary", name: "Sedentary", category: "Activity Level", icon: <Target className="w-4 h-4" /> },
  { id: "lightly-active", name: "Lightly Active", category: "Activity Level", icon: <Activity className="w-4 h-4" /> },
  { id: "moderately-active", name: "Moderately Active", category: "Activity Level", icon: <Heart className="w-4 h-4" /> },
  { id: "very-active", name: "Very Active", category: "Activity Level", icon: <Zap className="w-4 h-4" /> },
  { id: "extremely-active", name: "Extremely Active", category: "Activity Level", icon: <Activity className="w-4 h-4" /> },

  // Special Considerations
  { id: "pregnancy", name: "Pregnancy", category: "Special Considerations", icon: <Heart className="w-4 h-4" /> },
  { id: "breastfeeding", name: "Breastfeeding", category: "Special Considerations", icon: <Milk className="w-4 h-4" /> },
  { id: "senior", name: "Senior (65+)", category: "Special Considerations", icon: <Shield className="w-4 h-4" /> },
  { id: "teen", name: "Teenager", category: "Special Considerations", icon: <Zap className="w-4 h-4" /> },
  { id: "athlete", name: "Athlete", category: "Special Considerations", icon: <Activity className="w-4 h-4" /> },
  { id: "recovery", name: "Post-illness Recovery", category: "Special Considerations", icon: <Shield className="w-4 h-4" /> },
];