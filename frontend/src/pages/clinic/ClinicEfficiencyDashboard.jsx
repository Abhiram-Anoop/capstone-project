import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, TrendingDown, Users, Clock, CheckCircle,
  Activity, Heart, AlertTriangle, Target, BarChart3, PieChart,
  Calendar, Award, Zap, MessageSquare, Star, RefreshCw
} from 'lucide-react';

const ClinicEfficiencyDashboard = () => {
  const navigate = useNavigate();
  
  // Mock efficiency data
  const [efficiencyData] = useState({
    dailyStats: {
      patientsServed: 147,
      averageWaitTime: 12, // minutes
      consultationTime: 8, // minutes
      patientSatisfaction: 4.6, // out of 5
      staffUtilization: 87, // percentage
      completedTasks: 94 // percentage
    },
    weeklyTrends: {
      patientVolume: [120, 135, 142, 138, 155, 147, 149],
      waitTimes: [18, 15, 14, 13, 11, 12, 10],
      satisfaction: [4.2, 4.3, 4.4, 4.5, 4.6, 4.6, 4.7]
    },
    efficiencyMetrics: [
      {
        metric: "Patient Registration Speed",
        current: "2.3 min",
        target: "2.0 min",
        improvement: "+18%",
        status: "improving",
        color: "green"
      },
      {
        metric: "Documentation Time",
        current: "4.1 min",
        target: "3.5 min",
        improvement: "+25%",
        status: "improving", 
        color: "green"
      },
      {
        metric: "Queue Management",
        current: "12 min wait",
        target: "10 min wait",
        improvement: "+33%",
        status: "improving",
        color: "green"
      },
      {
        metric: "Staff Response Time",
        current: "1.8 min",
        target: "1.5 min",
        improvement: "+15%",
        status: "improving",
        color: "yellow"
      }
    ],
    staffPerformance: [
      { name: "Dr. Sharma", efficiency: 94, satisfaction: 4.8, patients: 42 },
      { name: "Nurse Priya", efficiency: 91, satisfaction: 4.7, patients: 38 },
      { name: "Staff Raj", efficiency: 88, satisfaction: 4.5, patients: 35 },
      { name: "Receptionist Maya", efficiency: 96, satisfaction: 4.9, patients: 45 }
    ],
    timeAnalysis: {
      peakHours: ["9:00-11:00 AM", "2:00-4:00 PM"],
      slowHours: ["12:00-1:00 PM", "5:00-6:00 PM"],
      avgConsultationByType: {
        "General": "6 min",
        "Video": "12 min", 
        "Emergency": "18 min",
        "Vaccination": "3 min"
      }
    },
    improvements: [
      {
        area: "Digital Queue System",
        impact: "40% reduction in wait times",
        implementation: "Completed",
        savings: "₹2,400/day in time saved"
      },
      {
        area: "Voice Documentation",
        impact: "50% faster record keeping",
        implementation: "In Progress",
        savings: "₹1,800/day in staff time"
      },
      {
        area: "WhatsApp Integration",
        impact: "25% fewer missed appointments",
        implementation: "Planning",
        savings: "₹3,200/day in lost revenue"
      }
    ]
  });

  /**
   * Format numbers with commas
   */
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  /**
   * Get trend indicator
   */
  const getTrendIcon = (status) => {
    switch (status) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clinic/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Clinic Efficiency Dashboard</h1>
                <p className="text-sm text-gray-600">Real-time performance metrics and optimization insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patients Served Today</p>
                <p className="text-3xl font-bold text-gray-900">{efficiencyData.dailyStats.patientsServed}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Wait Time</p>
                <p className="text-3xl font-bold text-gray-900">{efficiencyData.dailyStats.averageWaitTime}m</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">-33% improvement</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
                <p className="text-3xl font-bold text-gray-900">{efficiencyData.dailyStats.patientSatisfaction}/5</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+8% this week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Efficiency</p>
                <p className="text-3xl font-bold text-gray-900">{efficiencyData.dailyStats.staffUtilization}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <Target className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-blue-600">Target: 85%</span>
            </div>
          </div>
        </div>

        {/* Efficiency Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Performance Metrics
            </h3>
            
            <div className="space-y-4">
              {efficiencyData.efficiencyMetrics.map((metric, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                    {getTrendIcon(metric.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Current: </span>
                      <span className="font-medium">{metric.current}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Target: </span>
                      <span className="font-medium">{metric.target}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className={`text-sm font-medium ${
                      metric.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {metric.improvement} improvement
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Staff Performance
            </h3>
            
            <div className="space-y-4">
              {efficiencyData.staffPerformance.map((staff, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{staff.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{staff.satisfaction}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-semibold text-blue-600">{staff.efficiency}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Patients</p>
                      <p className="font-semibold">{staff.patients}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      <p className="font-semibold text-green-600">{staff.satisfaction}/5</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Improvements & Optimizations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Efficiency Improvements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {efficiencyData.improvements.map((improvement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{improvement.area}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    improvement.implementation === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : improvement.implementation === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {improvement.implementation}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{improvement.impact}</p>
                <p className="text-sm font-semibold text-green-600">{improvement.savings}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Peak Hours Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Time Analysis
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Peak Hours</h4>
                <div className="space-y-1">
                  {efficiencyData.timeAnalysis.peakHours.map((hour, index) => (
                    <div key={index} className="px-3 py-2 bg-red-50 text-red-800 rounded text-sm">
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Slow Hours</h4>
                <div className="space-y-1">
                  {efficiencyData.timeAnalysis.slowHours.map((hour, index) => (
                    <div key={index} className="px-3 py-2 bg-green-50 text-green-800 rounded text-sm">
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Time Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Consultation Time by Type
            </h3>
            
            <div className="space-y-3">
              {Object.entries(efficiencyData.timeAnalysis.avgConsultationByType).map(([type, time], index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="font-medium text-gray-900">{type}</span>
                  <span className="text-blue-600 font-semibold">{time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recommendation:</strong> Video consultations can be optimized with better pre-screening
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/clinic/dashboard')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
          
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
          
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Schedule Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicEfficiencyDashboard;