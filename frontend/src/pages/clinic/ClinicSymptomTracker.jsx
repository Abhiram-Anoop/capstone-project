import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Stethoscope, User, Heart, Activity, Brain, 
  Thermometer, Eye, Ear, X, Scan, Clock, FileText, 
  CheckCircle, AlertCircle, Zap, Target, Save, Printer,
  Camera, Mic, Volume2
} from 'lucide-react';

const ClinicSymptomTracker = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  
  // Patient data (from previous registration or mock)
  const [patientInfo] = useState({
    id: patientId || 'PAT001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    village: 'Nabha',
    registeredAt: '09:30 AM'
  });

  // Form state
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: '',
    pulseRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    symptomDuration: '',
    painLevel: '',
    previousTreatment: '',
    allergies: '',
    currentMedications: '',
    familyHistory: ''
  });
  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Comprehensive symptom database for clinic use
  const symptomCategories = {
    'general': {
      name: 'General Symptoms',
      icon: Activity,
      color: 'blue',
      symptoms: [
        { id: 'fever', name: 'Fever', icon: <Thermometer className="w-4 h-4" />, severity: 'high' },
        { id: 'fatigue', name: 'Fatigue/Weakness', icon: <Heart className="w-4 h-4" />, severity: 'medium' },
        { id: 'chills', name: 'Chills', icon: <Thermometer className="w-4 h-4" />, severity: 'medium' },
        { id: 'sweating', name: 'Excessive Sweating', icon: <Activity className="w-4 h-4" />, severity: 'low' },
        { id: 'weightLoss', name: 'Unexplained Weight Loss', icon: <User className="w-4 h-4" />, severity: 'high' },
        { id: 'appetite', name: 'Loss of Appetite', icon: <X className="w-4 h-4" />, severity: 'medium' }
      ]
    },
    'respiratory': {
      name: 'Respiratory',
      icon: Stethoscope,
      color: 'green',
      symptoms: [
        { id: 'cough', name: 'Cough (Dry/Wet)', icon: <Stethoscope className="w-4 h-4" />, severity: 'medium' },
        { id: 'shortnessBreath', name: 'Shortness of Breath', icon: <Stethoscope className="w-4 h-4" />, severity: 'high' },
        { id: 'chestPain', name: 'Chest Pain', icon: <Heart className="w-4 h-4" />, severity: 'high' },
        { id: 'soreThroat', name: 'Sore Throat', icon: <Stethoscope className="w-4 h-4" />, severity: 'low' },
        { id: 'wheezing', name: 'Wheezing', icon: <Stethoscope className="w-4 h-4" />, severity: 'medium' }
      ]
    },
    'neurological': {
      name: 'Neurological',
      icon: Brain,
      color: 'purple',
      symptoms: [
        { id: 'headache', name: 'Headache', icon: <Brain className="w-4 h-4" />, severity: 'medium' },
        { id: 'dizziness', name: 'Dizziness', icon: <Brain className="w-4 h-4" />, severity: 'medium' },
        { id: 'confusion', name: 'Confusion', icon: <Brain className="w-4 h-4" />, severity: 'high' },
        { id: 'seizures', name: 'Seizures', icon: <Brain className="w-4 h-4" />, severity: 'high' },
        { id: 'numbness', name: 'Numbness/Tingling', icon: <Brain className="w-4 h-4" />, severity: 'medium' }
      ]
    },
    'gastrointestinal': {
      name: 'Gastrointestinal',
      icon: Scan,
      color: 'orange',
      symptoms: [
        { id: 'nausea', name: 'Nausea', icon: <X className="w-4 h-4" />, severity: 'medium' },
        { id: 'vomiting', name: 'Vomiting', icon: <X className="w-4 h-4" />, severity: 'medium' },
        { id: 'diarrhea', name: 'Diarrhea', icon: <Scan className="w-4 h-4" />, severity: 'medium' },
        { id: 'constipation', name: 'Constipation', icon: <Scan className="w-4 h-4" />, severity: 'low' },
        { id: 'abdominalPain', name: 'Abdominal Pain', icon: <Scan className="w-4 h-4" />, severity: 'high' },
        { id: 'bloating', name: 'Bloating', icon: <Scan className="w-4 h-4" />, severity: 'low' }
      ]
    },
    'sensory': {
      name: 'Sensory',
      icon: Eye,
      color: 'indigo',
      symptoms: [
        { id: 'visionChanges', name: 'Vision Changes', icon: <Eye className="w-4 h-4" />, severity: 'high' },
        { id: 'hearingLoss', name: 'Hearing Loss', icon: <Ear className="w-4 h-4" />, severity: 'medium' },
        { id: 'ringingEars', name: 'Ringing in Ears', icon: <Ear className="w-4 h-4" />, severity: 'low' },
        { id: 'eyePain', name: 'Eye Pain', icon: <Eye className="w-4 h-4" />, severity: 'medium' }
      ]
    }
  };

  // Get all symptoms for selection
  const allSymptoms = useMemo(() => {
    return Object.entries(symptomCategories).flatMap(([categoryKey, category]) =>
      category.symptoms.map(symptom => ({
        ...symptom,
        category: categoryKey,
        categoryName: category.name,
        categoryColor: category.color
      }))
    );
  }, []);

  /**
   * Handle symptom selection
   */
  const handleSymptomToggle = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  /**
   * Handle vital signs input
   */
  const handleVitalChange = (field, value) => {
    setVitalSigns(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle additional info input
   */
  const handleAdditionalInfoChange = (field, value) => {
    setAdditionalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Generate AI-powered preliminary report
   */
  const generateAIReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Prepare data for AI analysis
      const analysisData = {
        patient: patientInfo,
        symptoms: selectedSymptoms.map(id => {
          const symptom = allSymptoms.find(s => s.id === id);
          return {
            id,
            name: symptom.name,
            category: symptom.category,
            severity: symptom.severity
          };
        }),
        vitalSigns,
        additionalInfo,
        timestamp: new Date().toISOString()
      };

      // Mock AI analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // Generate mock AI report based on symptoms
      const mockReport = generateMockAIReport(analysisData);
      setAiReport(mockReport);
      setStep(4);
      
    } catch (error) {
      console.error('❌ Failed to generate AI report:', error);
      alert('Failed to generate AI report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  /**
   * Generate mock AI report (replace with actual AI API)
   */
  const generateMockAIReport = (data) => {
    const hasHighSeveritySymptoms = data.symptoms.some(s => s.severity === 'high');
    const hasRespiratory = data.symptoms.some(s => s.category === 'respiratory');
    const hasGI = data.symptoms.some(s => s.category === 'gastrointestinal');
    const hasNeurological = data.symptoms.some(s => s.category === 'neurological');
    
    let possibleDiagnoses = [];
    let recommendations = [];
    let urgencyLevel = 'routine';
    let suggestedTests = [];

    // AI logic based on symptom patterns
    if (hasHighSeveritySymptoms) {
      urgencyLevel = 'urgent';
      recommendations.push('Immediate medical attention recommended');
    }

    if (hasRespiratory && data.symptoms.find(s => s.id === 'fever')) {
      possibleDiagnoses.push({
        name: 'Respiratory Infection',
        probability: '75%',
        explanation: 'Combination of respiratory symptoms with fever suggests possible respiratory tract infection'
      });
      suggestedTests.push('Chest X-ray', 'Complete Blood Count', 'CRP levels');
    }

    if (hasGI) {
      possibleDiagnoses.push({
        name: 'Gastrointestinal Disorder',
        probability: '65%',
        explanation: 'GI symptoms may indicate digestive system issues or food-related illness'
      });
      suggestedTests.push('Stool examination', 'Abdominal ultrasound');
    }

    if (hasNeurological) {
      possibleDiagnoses.push({
        name: 'Neurological Assessment Needed',
        probability: '60%',
        explanation: 'Neurological symptoms require further evaluation'
      });
      suggestedTests.push('Neurological examination', 'CT scan if severe');
    }

    // General recommendations
    recommendations.push(
      'Monitor vital signs regularly',
      'Ensure adequate hydration',
      'Follow up if symptoms worsen',
      'Consider symptomatic treatment'
    );

    return {
      patientId: data.patient.id,
      patientName: data.patient.name,
      analysisTimestamp: new Date().toISOString(),
      urgencyLevel,
      confidence: hasHighSeveritySymptoms ? 'High' : 'Medium',
      possibleDiagnoses,
      recommendations,
      suggestedTests,
      vitalSigns: data.vitalSigns,
      symptomSummary: data.symptoms.map(s => s.name).join(', '),
      staffNotes: 'Preliminary AI analysis - requires doctor review'
    };
  };

  /**
   * Save report and navigate back
   */
  const saveAndContinue = () => {
    // Save report data (mock implementation)
    console.log('💾 Saving AI report for doctor review:', aiReport);
    
    // Navigate back to patient queue or dashboard
    navigate('/clinic/queue');
  };

  if (step === 4 && aiReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setStep(3)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Analysis Report</h1>
                  <p className="text-sm text-gray-600">Patient: {patientInfo.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  aiReport.urgencyLevel === 'urgent' 
                    ? 'bg-red-100 text-red-800'
                    : aiReport.urgencyLevel === 'priority'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {aiReport.urgencyLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* AI Report Content */}
          <div className="space-y-6">
            
            {/* Patient Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {aiReport.patientName}</div>
                <div><strong>Age:</strong> {patientInfo.age} years</div>
                <div><strong>Analysis Time:</strong> {new Date(aiReport.analysisTimestamp).toLocaleString()}</div>
                <div><strong>Confidence Level:</strong> {aiReport.confidence}</div>
              </div>
              
              <div className="mt-4">
                <strong>Symptoms Reported:</strong>
                <p className="text-gray-700 mt-1">{aiReport.symptomSummary}</p>
              </div>
            </div>

            {/* Vital Signs */}
            {Object.values(aiReport.vitalSigns).some(v => v) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Vital Signs
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {aiReport.vitalSigns.temperature && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-gray-600">Temperature</p>
                      <p className="font-semibold">{aiReport.vitalSigns.temperature}°F</p>
                    </div>
                  )}
                  {aiReport.vitalSigns.bloodPressure && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-gray-600">Blood Pressure</p>
                      <p className="font-semibold">{aiReport.vitalSigns.bloodPressure}</p>
                    </div>
                  )}
                  {aiReport.vitalSigns.pulseRate && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-gray-600">Pulse Rate</p>
                      <p className="font-semibold">{aiReport.vitalSigns.pulseRate} bpm</p>
                    </div>
                  )}
                  {aiReport.vitalSigns.oxygenSaturation && (
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-gray-600">O2 Saturation</p>
                      <p className="font-semibold">{aiReport.vitalSigns.oxygenSaturation}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Analysis Results */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-600" />
                AI Analysis Results
              </h2>
              
              {/* Possible Diagnoses */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Possible Diagnoses</h3>
                <div className="space-y-3">
                  {aiReport.possibleDiagnoses.map((diagnosis, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">{diagnosis.name}</h4>
                        <span className="text-sm text-blue-600 font-medium">{diagnosis.probability}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{diagnosis.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {aiReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Tests */}
              {aiReport.suggestedTests.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Suggested Tests</h3>
                  <div className="flex flex-wrap gap-2">
                    {aiReport.suggestedTests.map((test, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        {test}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Staff Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Important Note</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This is a preliminary AI analysis based on reported symptoms. 
                    The doctor will review this report and conduct a proper examination 
                    before making any final diagnosis or treatment decisions.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Edit
              </button>
              
              <div className="flex space-x-3">
                <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </button>
                
                <button
                  onClick={saveAndContinue}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Continue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic/queue')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Symptom Analysis</h1>
                <p className="text-sm text-gray-600">Patient: {patientInfo.name} | ID: {patientInfo.id}</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Step {step} of 3</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Step 1: Symptom Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Patient Symptoms</h2>
              <p className="text-gray-600">Choose all symptoms the patient is experiencing</p>
            </div>

            {/* Symptom Categories */}
            {Object.entries(symptomCategories).map(([categoryKey, category]) => {
              const CategoryIcon = category.icon;
              const selectedCount = category.symptoms.filter(s => selectedSymptoms.includes(s.id)).length;
              
              return (
                <div key={categoryKey} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CategoryIcon className={`w-5 h-5 mr-2 text-${category.color}-600`} />
                      {category.name}
                    </h3>
                    {selectedCount > 0 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.symptoms.map((symptom) => (
                      <label
                        key={symptom.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedSymptoms.includes(symptom.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom.id)}
                          onChange={() => handleSymptomToggle(symptom.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span className={`text-${category.color}-600`}>{symptom.icon}</span>
                          <span className="font-medium text-gray-900">{symptom.name}</span>
                          {symptom.severity === 'high' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              High Priority
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between">
              <button
                onClick={() => navigate('/clinic/queue')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                onClick={() => setStep(2)}
                disabled={selectedSymptoms.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Vital Signs ({selectedSymptoms.length} symptoms selected)
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Vital Signs */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Vital Signs</h2>
              <p className="text-gray-600">Enter patient's current vital measurements</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalSigns.temperature}
                    onChange={(e) => handleVitalChange('temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="98.6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={vitalSigns.bloodPressure}
                    onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pulse Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={vitalSigns.pulseRate}
                    onChange={(e) => handleVitalChange('pulseRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="72"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Respiratory Rate
                  </label>
                  <input
                    type="number"
                    value={vitalSigns.respiratoryRate}
                    onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    value={vitalSigns.oxygenSaturation}
                    onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="98"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vitalSigns.weight}
                    onChange={(e) => handleVitalChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="70"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back: Symptoms
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next: Additional Info
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
              <p className="text-gray-600">Provide more context for accurate AI analysis</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptom Duration
                  </label>
                  <select
                    value={additionalInfo.symptomDuration}
                    onChange={(e) => handleAdditionalInfoChange('symptomDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select duration</option>
                    <option value="few-hours">Few hours</option>
                    <option value="1-day">1 day</option>
                    <option value="2-3-days">2-3 days</option>
                    <option value="1-week">1 week</option>
                    <option value="more-than-week">More than a week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pain Level (1-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={additionalInfo.painLevel}
                    onChange={(e) => handleAdditionalInfoChange('painLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Scale of 1-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Treatment Attempted
                </label>
                <textarea
                  value={additionalInfo.previousTreatment}
                  onChange={(e) => handleAdditionalInfoChange('previousTreatment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any home remedies, medications taken, or treatments tried..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={additionalInfo.allergies}
                  onChange={(e) => handleAdditionalInfoChange('allergies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Food allergies, drug allergies, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <input
                  type="text"
                  value={additionalInfo.currentMedications}
                  onChange={(e) => handleAdditionalInfoChange('currentMedications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any medications currently being taken"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back: Vital Signs
              </button>
              
              <button
                onClick={generateAIReport}
                disabled={isGeneratingReport}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isGeneratingReport ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating AI Report...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicSymptomTracker;