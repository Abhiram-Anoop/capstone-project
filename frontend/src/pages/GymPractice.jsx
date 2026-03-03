import React,{useState} from 'react';
import JointTracker from './JointTracker';
import { Button } from '../assets/component/button';
import { Card, CardContent, CardHeader, CardTitle } from '../assets/component/card';
import { Badge } from '../assets/component/badge';
import GymReportDisplay from './GymReportDisplay';

const GymPractice = ({ exercise, onEndPractice }) => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);


  // Simple end practice - just closes without loader
  const handleSimpleEndPractice = () => {
    onEndPractice(); // Just close the practice
  };

  // Use your EXISTING /yoga/report API endpoint for gym exercises too
  const handleJointTrackerEndPractice = async (sessionData) => {
    console.log("🔍 GymPractice received session data:", sessionData);
    
    try {
      // Use the EXISTING yoga/report endpoint - it works for any exercise
      console.log("📦 Sending to backend:", {
  exercise: sessionData.pose,
  sessionDuration: sessionData.time,
  averageScore: sessionData.formScore,
  reps: sessionData.count
});

      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL || "https://ai-doctor-assistant-backend-ai-ml.onrender.com"}/api/yoga/report`
, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
  body: JSON.stringify({
    exercise: sessionData.exercise,
    sessionDuration: sessionData.sessionDuration,
    averageScore: sessionData.averageScore,
    reps: sessionData.reps
  }),
      });
      
      console.log("🔍 API Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Report generated:', data);
        setShowReport(true);
        setReportData(data.report);

      } else {
        console.log("❌ API Response not ok:", await response.text());
         
      }


    } catch (error) {
      console.error('Error ending practice:', error);
      // Still close practice even if report fails
      onEndPractice();
    }
  };
  // Handle when user wants to start a new session from the report
const handleResetFromReport = () => {
setShowReport(false);
setReportData(null);
onEndPractice(); // Go back to exercise list
};

// If showing report, display the report component
if (showReport && reportData) {
return <GymReportDisplay reportData={reportData} onReset={handleResetFromReport} />;
}

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-7xl mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{exercise.title}</h1>
        <Button 
          onClick={handleSimpleEndPractice} 
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          End Practice
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden shadow-lg aspect-video min-h-[400px]">
          {/* Pass exercise as pose prop and the handler function */}
          <JointTracker pose={exercise} onEndPractice={handleJointTrackerEndPractice} />
        </div>
        
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
          <Card className="shadow-none border-none">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold text-gray-800">
                Instructions for {exercise.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default" className={`bg-yellow-100 text-yellow-700 font-semibold`}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="default" className="bg-blue-100 text-blue-700 font-semibold">
                  {exercise.reps} Reps
                </Badge>
                <Badge variant="default" className="bg-green-100 text-green-700 font-semibold">
                  {exercise.sets} Sets
                </Badge>
              </div>
              <p className="text-gray-600">{exercise.subtitle}</p>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Target Muscles:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {exercise.targetMuscles.map((muscle, index) => (
                    <li key={index}>{muscle}</li>
                  ))}
                </ul>
              </div>
              
              <p className="text-sm text-gray-500 italic mt-4">
                Follow the live joint tracker on the left to ensure proper form.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GymPractice;