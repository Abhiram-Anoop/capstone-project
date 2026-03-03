import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Clock, FileText, Zap, CheckCircle, AlertTriangle,
  Heart, Activity, Stethoscope, Eye, Target, TrendingUp, Save,
  Printer, MessageSquare, Star, Award
} from 'lucide-react';

const ClinicAIReportsView = () => {
  const navigate = useNavigate();
  
  // Mock AI reports from different patients
  const [aiReports] = useState([
    {
      id: 'RPT001',
      patientId: 'PAT001',
      patientName: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      village: 'Nabha',
      analysisTime: '10:30 AM',
      analysisDate: '2025-09-27',
      urgencyLevel: 'high',
      confidence: 'High',
      staffMember: 'Nurse Priya',
      status: 'pending_review',
      symptomSummary: 'Chest pain, shortness of breath, sweating',
      possibleDiagnoses: [
        {
          name: 'Possible Cardiac Event',
          probability: '85%',
          explanation: 'Combination of chest pain with sweating and breathing difficulty suggests cardiac involvement'
        },
        {
          name: 'Anxiety/Panic Attack',
          probability: '45%',
          explanation: 'Symptoms could also indicate severe anxiety or panic disorder'
        }
      ],
      vitalSigns: {
        temperature: '98.8°F',
        bloodPressure: '150/95',
        pulseRate: '105',
        oxygenSaturation: '96%'
      },
      recommendations: [
        'Immediate ECG recommended',
        'Cardiac enzymes test',
        'Monitor blood pressure',
        'Consider emergency referral if symptoms worsen'
      ],
      aiNotes: 'High-priority case requiring immediate medical attention. Elevated BP and tachycardia with classic cardiac symptoms.'
    },
    {
      id: 'RPT002',
      patientId: 'PAT002',
      patientName: 'Sunita Devi',
      age: 32,
      gender: 'Female',
      village: 'Bhadson',
      analysisTime: '11:15 AM',
      analysisDate: '2025-09-27',
      urgencyLevel: 'medium',
      confidence: 'Medium',
      staffMember: 'Staff Raj',
      status: 'reviewed',
      symptomSummary: 'Fever, headache, body aches for 3 days',
      possibleDiagnoses: [
        {
          name: 'Viral Fever',
          probability: '75%',
          explanation: 'Classic viral syndrome symptoms with seasonal pattern'
        },
        {
          name: 'Dengue Fever',
          probability: '35%',
          explanation: 'Given regional prevalence, dengue should be considered'
        }
      ],
      vitalSigns: {
        temperature: '101.2°F',
        bloodPressure: '110/70',
        pulseRate: '88',
        oxygenSaturation: '98%'
      },
      recommendations: [
        'Rest and adequate hydration',
        'Paracetamol for fever',
        'Monitor for dengue symptoms',
        'Follow up in 2-3 days if no improvement'
      ],
      doctorNotes: 'Examined - likely viral fever. Prescribed symptomatic treatment. Patient counseled on warning signs.',
      aiNotes: 'Routine viral illness. Good hydration status. No immediate concerns.'
    },
    {
      id: 'RPT003',
      patientId: 'PAT003',
      patientName: 'Gurpreet Singh',
      age: 28,
      gender: 'Male',
      village: 'Dhuri',
      analysisTime: '12:00 PM',
      analysisDate: '2025-09-27',
      urgencyLevel: 'low',
      confidence: 'High',
      staffMember: 'Receptionist Maya',
      status: 'completed',
      symptomSummary: 'Vaccination consultation, no acute symptoms',
      possibleDiagnoses: [
        {
          name: 'Routine Vaccination',
          probability: '95%',
          explanation: 'Patient requesting travel vaccinations, no illness symptoms'
        }
      ],
      vitalSigns: {
        temperature: '98.4°F',
        bloodPressure: '120/80',
        pulseRate: '72',
        oxygenSaturation: '99%'
      },
      recommendations: [
        'Proceed with requested vaccinations',
        'Check vaccination history',
        'Provide travel health advice',
        'Schedule follow-up doses if needed'
      ],
      doctorNotes: 'Vaccination completed. Advised on travel precautions. Next dose in 4 weeks.',
      aiNotes: 'Healthy individual seeking preventive care. Normal vital signs.'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  /**
   * Filter reports by status
   */
  const filteredReports = aiReports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  /**
   * Get urgency color
   */
  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'orange';
      case 'reviewed': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  /**
   * Update report status
   */
  const updateReportStatus = (reportId, newStatus) => {
    // Mock function - in real app would call API
    console.log(`Updating report ${reportId} to status: ${newStatus}`);
  };

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">AI Analysis Report</h1>
                  <p className="text-sm text-gray-600">Patient: {selectedReport.patientName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full bg-${getUrgencyColor(selectedReport.urgencyLevel)}-100 text-${getUrgencyColor(selectedReport.urgencyLevel)}-800`}>
                  {selectedReport.urgencyLevel.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Report Content */}
          <div className="space-y-6">
            
            {/* Patient & Analysis Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient & Analysis Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Patient Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedReport.patientName}</div>
                    <div><strong>Age:</strong> {selectedReport.age} years</div>
                    <div><strong>Gender:</strong> {selectedReport.gender}</div>
                    <div><strong>Village:</strong> {selectedReport.village}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Analysis Details</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Analysis Time:</strong> {selectedReport.analysisTime}, {selectedReport.analysisDate}</div>
                    <div><strong>Staff Member:</strong> {selectedReport.staffMember}</div>
                    <div><strong>AI Confidence:</strong> {selectedReport.confidence}</div>
                    <div><strong>Status:</strong> <span className={`text-${getStatusColor(selectedReport.status)}-600 font-medium`}>{selectedReport.status.replace('_', ' ').toUpperCase()}</span></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Reported Symptoms</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.symptomSummary}</p>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Vital Signs
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(selectedReport.vitalSigns).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

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
                  {selectedReport.possibleDiagnoses.map((diagnosis, index) => (
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
              <div>
                <h3 className="font-medium text-gray-900 mb-3">AI Recommendations</h3>
                <ul className="space-y-2">
                  {selectedReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Doctor Notes */}
            {selectedReport.doctorNotes && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Doctor's Review & Notes
                </h2>
                <p className="text-green-700">{selectedReport.doctorNotes}</p>
              </div>
            )}

            {/* AI Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                AI Analysis Notes
              </h2>
              <p className="text-blue-700">{selectedReport.aiNotes}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Reports List
              </button>
              
              <div className="flex space-x-3">
                {selectedReport.status === 'pending_review' && (
                  <button
                    onClick={() => updateReportStatus(selectedReport.id, 'reviewed')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Mark as Reviewed
                  </button>
                )}
                
                <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Analysis Reports</h1>
                <p className="text-sm text-gray-600">Review AI-generated patient analysis reports</p>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="pending_review">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{aiReports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {aiReports.filter(r => r.status === 'pending_review').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {aiReports.filter(r => r.urgencyLevel === 'high').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(aiReports.reduce((acc, r) => acc + (r.confidence === 'High' ? 90 : r.confidence === 'Medium' ? 70 : 50), 0) / aiReports.length)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">AI Analysis Reports</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center justify-between">
                  
                  {/* Report Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${getUrgencyColor(report.urgencyLevel)}-100`}>
                      <Activity className={`w-6 h-6 text-${getUrgencyColor(report.urgencyLevel)}-600`} />
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{report.patientName}</h3>
                        
                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getUrgencyColor(report.urgencyLevel)}-100 text-${getUrgencyColor(report.urgencyLevel)}-800`}>
                          {report.urgencyLevel.toUpperCase()}
                        </span>

                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getStatusColor(report.status)}-100 text-${getStatusColor(report.status)}-800`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>ID: {report.patientId}</span>
                        <span>Age: {report.age}</span>
                        <span>Village: {report.village}</span>
                        <span>Staff: {report.staffMember}</span>
                      </div>

                      <p className="text-sm text-gray-700 mt-2">
                        <strong>Symptoms:</strong> {report.symptomSummary}
                      </p>
                      
                      <p className="text-sm text-blue-600 mt-1">
                        <strong>Top Diagnosis:</strong> {report.possibleDiagnoses[0]?.name} ({report.possibleDiagnoses[0]?.probability})
                      </p>
                    </div>
                  </div>

                  {/* Time & Actions */}
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      <div>{report.analysisTime}</div>
                      <div>{report.analysisDate}</div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-900">
                        AI Confidence: {report.confidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">No AI analysis reports match the current filter.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/clinic/dashboard')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
          
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export All Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicAIReportsView;