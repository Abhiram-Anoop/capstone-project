import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../assets/component/card';
import { Button } from '../assets/component/button';
import { Badge } from '../assets/component/badge';

const ZumbaReportDisplay = ({ reportData, onReset }) => {
    const { summary, tips, score } = reportData;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card className="border border-black/10 bg-white shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Zumba Session Report
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        Here is your performance summary from the last session.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Overall Summary */}
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-700">Summary</h3>
                        <p className="text-gray-600">{summary}</p>
                    </div>

                    {/* Performance Score */}
                    {score !== null && (
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-700">Overall Score</h3>
                            <Badge 
                                variant="default" 
                                className="text-lg px-4 py-2 font-semibold bg-green-500 text-white"
                            >
                                {score} / 100
                            </Badge>
                        </div>
                    )}
                    
                    {/* Tips for Improvement */}
                    {tips && tips.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-700">Tips for Improvement</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                {tips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="flex justify-center pt-6">
                <Button 
                    onClick={onReset} 
                    className="bg-gray-500 text-white font-semibold hover:bg-gray-600"
                >
                    Start New Zumba Session
                </Button>
            </div>
        </div>
    );
};

export default ZumbaReportDisplay;
