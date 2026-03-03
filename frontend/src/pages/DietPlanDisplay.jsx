    import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/component/card";
    import { Badge } from "../assets/component/badge";
    import { Button } from "../assets/component/button";
import { Apple, User, Calendar, Target } from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';



const DietPlanDisplay = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { dietPlan, userDetails, selectedDiet } = location.state || {};

    // Add this cleaning function
const cleanText = (text) => {
    if (!text) return '';
    return text
        .replace(/\*+/g, '')                     // Remove all asterisks
        .replace(/#+/g, '')                      // Remove all hashes
        .replace(/`+/g, '')                      // Remove all backticks
        .replace(/_{2,}/g, '')                   // Remove underscores
        .replace(/\n{3,}/g, '\n\n')              // Limit line breaks
        .trim();
};

// Clean the diet plan before using it
const cleanedDietPlan = cleanText(dietPlan);
    
    if (!cleanedDietPlan) {
        return <div className="max-w-4xl mx-auto p-6">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-700">No diet plan data found</h2>
                <p className="text-gray-500 mt-2">Please generate a new plan.</p>
            </div>
        </div>;
    }
        // Parse the diet plan text to extract structured data
const parseDietPlan = (planText) => {
    if (!planText) return { overview: '', dailyPlans: [], nutritionalGuidelines: [], recommendations: [] };
    
    const sections = planText.split(/\n\s*\n/);
    const parsedData = {
        overview: '',
        dailyPlans: [],
        nutritionalGuidelines: [],
        recommendations: []
    };

    sections.forEach(section => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return;
        
        if (trimmedSection.toLowerCase().includes('day 1') || 
            trimmedSection.toLowerCase().includes('day 2') ||
            trimmedSection.toLowerCase().includes('day 3') ||
            trimmedSection.toLowerCase().includes('day 4') ||
            trimmedSection.toLowerCase().includes('day 5') ||
            trimmedSection.toLowerCase().includes('day 6') ||
            trimmedSection.toLowerCase().includes('day 7') ||
            trimmedSection.toLowerCase().includes('breakfast') ||
            trimmedSection.toLowerCase().includes('lunch') ||
            trimmedSection.toLowerCase().includes('dinner')) {
            parsedData.dailyPlans.push(trimmedSection);
        } else if (trimmedSection.toLowerCase().includes('calorie') || 
                   trimmedSection.toLowerCase().includes('nutrition') ||
                   trimmedSection.toLowerCase().includes('protein') ||
                   trimmedSection.toLowerCase().includes('carb')) {
            parsedData.nutritionalGuidelines.push(trimmedSection);
        } else if (trimmedSection.toLowerCase().includes('recommend') || 
                   trimmedSection.toLowerCase().includes('consider') ||
                   trimmedSection.toLowerCase().includes('important') ||
                   trimmedSection.toLowerCase().includes('note')) {
            parsedData.recommendations.push(trimmedSection);
        } else if (parsedData.overview === '' && trimmedSection.length > 50) {
            parsedData.overview = trimmedSection;
        }
    });

    return parsedData;
};

        const parsedPlan = parseDietPlan(cleanedDietPlan);

        const handleCopyToClipboard = () => {
            navigator.clipboard.writeText(cleanedDietPlan);
            alert("Diet plan copied to clipboard!");
        };

    const handleBackClick = () => {
        navigate('/DietGeneration');
    };

        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header Card */}
                <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
                            <Apple className="w-8 h-8" />
                            Your Personalized Diet Plan
                        </CardTitle>
                        <CardDescription className="text-green-600">
                            Custom-tailored nutrition plan based on your preferences and health profile
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* User Profile Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-700 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Profile Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Age</p>
                                <p className="font-bold text-blue-600">{userDetails.age} years</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Height</p>
                                <p className="font-bold text-purple-600">{userDetails.height} cm</p>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm text-gray-600">Weight</p>
                                <p className="font-bold text-orange-600">{userDetails.weight} kg</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">BMI</p>
                                <p className="font-bold text-green-600">
                                    {((userDetails.weight / Math.pow(userDetails.height / 100, 2))).toFixed(1)}
                                </p>
                            </div>
                        </div>
                        
                        {/* Selected Diet Preferences */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Diet Preferences</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedDiet.map((diet, index) => (
                                    <Badge key={index} variant="default" className="bg-green-500 text-white">
                                        {diet.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Diet Plan Overview */}
                {parsedPlan.overview && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                <Target className="w-6 h-6" />
                                Plan Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{parsedPlan.overview}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Daily Plans */}
                {parsedPlan.dailyPlans.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-700 flex items-center gap-2">
                                <Calendar className="w-6 h-6" />
                                Daily Meal Plans
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {parsedPlan.dailyPlans.map((day, index) => (
                                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                                            {day}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Nutritional Guidelines */}
                {parsedPlan.nutritionalGuidelines.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-700">Nutritional Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {parsedPlan.nutritionalGuidelines.map((guideline, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700">
                                        <Badge variant="default" className="mt-1 bg-blue-500 text-white">📊</Badge>
                                        <div className="flex-1">
                                            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                                {guideline}
                                            </pre>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendations */}
                {parsedPlan.recommendations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-gray-700">Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {parsedPlan.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700">
                                        <Badge variant="default" className="mt-1 bg-yellow-500 text-white">💡</Badge>
                                        <div className="flex-1">
                                            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                                                {rec}
                                            </pre>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Full Diet Plan (Raw) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-700">Complete Diet Plan</CardTitle>
                        <CardDescription>
                            Full detailed plan - you can copy this for your reference
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                                {cleanedDietPlan}
                            </pre>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-4">
                    <Button 
                        onClick={handleCopyToClipboard}
                        className="bg-green-500 text-white hover:bg-green-600"
                    >
                        Copy to Clipboard
                    </Button>
                    <Button 
                        onClick={handleBackClick}
                        className="bg-gray-500 text-white hover:bg-gray-600"
                    >
                        Generate New Plan
                    </Button>
                </div>
            </div>
        );
    };

    export default DietPlanDisplay;