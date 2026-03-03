import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/component/card";
import { Badge } from "../assets/component/badge";
import { Button } from "../assets/component/button";

const ReportDisplay = ({ reportData }) => {
    const { possibleDiagnoses, recommendations, suggestedTests } = reportData;

    const handleBackClick = () => {
        window.location.reload(); // Reloads the page to start a new assessment
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        AI-Generated Medical Report
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        This is a preliminary report and is not a substitute for professional medical advice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Possible Diagnoses */}
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-700">Possible Diagnoses</h3>
                        <ul className="space-y-4">
                            {possibleDiagnoses.map((diagnosis, index) => (
                                <li key={index} className="border-l-4 border-sky-500 pl-4">
                                    <h4 className="font-semibold text-gray-800">{diagnosis.name}</h4>
                                    <p className="text-sm text-gray-600">{diagnosis.explanation}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-700">Recommendations</h3>
                        <ul className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <Badge variant="default" className="mt-1 bg-green-500 text-white">✓</Badge>
                                    <p>{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggested Tests */}
                    {suggestedTests && suggestedTests.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-700">Suggested Tests</h3>
                            <ul className="space-y-2">
                                {suggestedTests.map((test, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700">
                                        <Badge variant="default" className="mt-1 bg-yellow-500 text-white">!</Badge>
                                        <p>{test}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="flex justify-center pt-4">
                <Button onClick={handleBackClick} className="bg-gray-500 text-white hover:bg-gray-600">
                    Start New Assessment
                </Button>
            </div>
        </div>
    );
};

export default ReportDisplay;