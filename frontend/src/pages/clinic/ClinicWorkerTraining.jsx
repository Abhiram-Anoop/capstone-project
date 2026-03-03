import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Play, CheckCircle, Users, Clock, 
  Target, Award, Video, FileText, Stethoscope, Activity,
  Zap, MessageSquare, Star, Brain, Heart, Eye, User,
  ChevronRight, ChevronDown, RotateCcw, Download,
  Monitor, Smartphone, Headphones, Volume2
} from 'lucide-react';

const ClinicWorkerTraining = () => {
  const navigate = useNavigate();
  
  // Training state management
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  // Training modules data
  const trainingModules = [
    {
      id: 'basics',
      title: 'Digital Clinic Basics',
      duration: '15 min',
      difficulty: 'Beginner',
      icon: Monitor,
      color: 'blue',
      description: 'Learn the fundamentals of our digital clinic system',
      lessons: [
        {
          id: 'login',
          title: 'System Login & Navigation',
          duration: '3 min',
          type: 'video',
          description: 'How to access and navigate the clinic dashboard'
        },
        {
          id: 'dashboard',
          title: 'Understanding the Dashboard',
          duration: '5 min',
          type: 'interactive',
          description: 'Overview of patient queue, statistics, and quick actions'
        },
        {
          id: 'patient-search',
          title: 'Finding Patient Records',
          duration: '4 min',
          type: 'demo',
          description: 'Search and access patient information efficiently'
        },
        {
          id: 'basic-quiz',
          title: 'Knowledge Check',
          duration: '3 min',
          type: 'quiz',
          description: 'Test your understanding of basic operations'
        }
      ]
    },
    {
      id: 'patient-registration',
      title: 'Patient Registration',
      duration: '20 min',
      difficulty: 'Beginner',
      icon: User,
      color: 'green',
      description: 'Master the patient registration and intake process',
      lessons: [
        {
          id: 'new-patient',
          title: 'Registering New Patients',
          duration: '6 min',
          type: 'video',
          description: 'Step-by-step patient registration process'
        },
        {
          id: 'demographics',
          title: 'Collecting Patient Demographics',
          duration: '5 min',
          type: 'practice',
          description: 'Best practices for gathering patient information'
        },
        {
          id: 'insurance',
          title: 'Insurance & Payment Processing',
          duration: '4 min',
          type: 'demo',
          description: 'Handle insurance verification and payments'
        },
        {
          id: 'queue-management',
          title: 'Adding Patients to Queue',
          duration: '3 min',
          type: 'interactive',
          description: 'Priority setting and queue optimization'
        },
        {
          id: 'registration-quiz',
          title: 'Registration Assessment',
          duration: '2 min',
          type: 'quiz',
          description: 'Verify your registration skills'
        }
      ]
    },
    {
      id: 'ai-symptom-tracker',
      title: 'AI Symptom Analysis',
      duration: '25 min',
      difficulty: 'Intermediate',
      icon: Brain,
      color: 'purple',
      description: 'Learn to use AI-powered symptom tracking for better patient care',
      lessons: [
        {
          id: 'ai-intro',
          title: 'Introduction to AI Analysis',
          duration: '5 min',
          type: 'video',
          description: 'Understanding how AI enhances patient care'
        },
        {
          id: 'symptom-collection',
          title: 'Systematic Symptom Collection',
          duration: '8 min',
          type: 'interactive',
          description: 'Guide patients through comprehensive symptom assessment'
        },
        {
          id: 'vital-signs',
          title: 'Recording Vital Signs',
          duration: '6 min',
          type: 'practice',
          description: 'Accurate vital sign measurement and documentation'
        },
        {
          id: 'ai-report',
          title: 'Interpreting AI Reports',
          duration: '4 min',
          type: 'demo',
          description: 'Understanding AI analysis results and recommendations'
        },
        {
          id: 'emergency-flags',
          title: 'Recognizing Emergency Flags',
          duration: '2 min',
          type: 'critical',
          description: 'Identifying urgent cases requiring immediate attention'
        }
      ]
    },
    {
      id: 'communication',
      title: 'Patient Communication',
      duration: '18 min',
      difficulty: 'Beginner',
      icon: MessageSquare,
      color: 'indigo',
      description: 'Effective communication techniques for better patient experience',
      lessons: [
        {
          id: 'greeting',
          title: 'Professional Patient Greeting',
          duration: '4 min',
          type: 'video',
          description: 'Creating welcoming first impressions'
        },
        {
          id: 'language-barriers',
          title: 'Overcoming Language Barriers',
          duration: '6 min',
          type: 'practice',
          description: 'Using translation tools and visual aids effectively'
        },
        {
          id: 'elderly-care',
          title: 'Communicating with Elderly Patients',
          duration: '5 min',
          type: 'demo',
          description: 'Special considerations for senior patients'
        },
        {
          id: 'difficult-situations',
          title: 'Handling Difficult Situations',
          duration: '3 min',
          type: 'scenario',
          description: 'De-escalation and conflict resolution techniques'
        }
      ]
    },
    {
      id: 'video-consultation',
      title: 'Video Consultation Support',
      duration: '22 min',
      difficulty: 'Intermediate',
      icon: Video,
      color: 'red',
      description: 'Assist patients with telemedicine and video consultations',
      lessons: [
        {
          id: 'tech-setup',
          title: 'Technology Setup',
          duration: '6 min',
          type: 'video',
          description: 'Setting up video calls and troubleshooting technical issues'
        },
        {
          id: 'patient-prep',
          title: 'Preparing Patients for Video Calls',
          duration: '5 min',
          type: 'practice',
          description: 'Helping patients feel comfortable with technology'
        },
        {
          id: 'translation-support',
          title: 'Providing Translation Support',
          duration: '6 min',
          type: 'interactive',
          description: 'Facilitating communication between doctor and patient'
        },
        {
          id: 'documentation',
          title: 'Video Consultation Documentation',
          duration: '3 min',
          type: 'demo',
          description: 'Recording consultation notes and outcomes'
        },
        {
          id: 'follow-up',
          title: 'Post-Consultation Follow-up',
          duration: '2 min',
          type: 'checklist',
          description: 'Ensuring proper follow-up care coordination'
        }
      ]
    },
    {
      id: 'emergency-procedures',
      title: 'Emergency Protocols',
      duration: '30 min',
      difficulty: 'Advanced',
      icon: Heart,
      color: 'red',
      description: 'Critical emergency response procedures and protocols',
      lessons: [
        {
          id: 'triage',
          title: 'Emergency Triage Assessment',
          duration: '8 min',
          type: 'critical',
          description: 'Rapid assessment and prioritization of emergency cases'
        },
        {
          id: 'first-aid',
          title: 'Basic First Aid Procedures',
          duration: '10 min',
          type: 'video',
          description: 'Essential first aid techniques for clinic staff'
        },
        {
          id: 'doctor-communication',
          title: 'Emergency Doctor Communication',
          duration: '5 min',
          type: 'scenario',
          description: 'Effective communication during medical emergencies'
        },
        {
          id: 'ambulance-coordination',
          title: 'Ambulance & Transfer Coordination',
          duration: '4 min',
          type: 'demo',
          description: 'Managing patient transfers and emergency transport'
        },
        {
          id: 'documentation-emergency',
          title: 'Emergency Documentation',
          duration: '3 min',
          type: 'checklist',
          description: 'Critical information recording during emergencies'
        }
      ]
    }
  ];

  // User progress tracking
  const userStats = {
    totalModules: trainingModules.length,
    completedModules: completedModules.size,
    totalLessons: trainingModules.reduce((acc, module) => acc + module.lessons.length, 0),
    completedLessons: 12, // Mock data
    timeSpent: '2h 15m',
    certificationsEarned: 2
  };

  /**
   * Handle module completion
   */
  const completeModule = (moduleId) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(moduleId);
    setCompletedModules(newCompleted);
    
    // Update progress
    const newProgress = (newCompleted.size / trainingModules.length) * 100;
    setProgress(newProgress);
  };

  /**
   * Get difficulty color
   */
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'green';
      case 'Intermediate': return 'yellow';
      case 'Advanced': return 'red';
      default: return 'gray';
    }
  };

  /**
   * Get lesson type icon
   */
  const getLessonTypeIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'interactive': return <Monitor className="w-4 h-4" />;
      case 'practice': return <Target className="w-4 h-4" />;
      case 'demo': return <Play className="w-4 h-4" />;
      case 'quiz': return <Brain className="w-4 h-4" />;
      case 'critical': return <Heart className="w-4 h-4" />;
      case 'scenario': return <Users className="w-4 h-4" />;
      case 'checklist': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
                <h1 className="text-xl font-bold text-gray-900">Clinic Worker Training</h1>
                <p className="text-sm text-gray-600">Master the digital clinic workflows and AI-enhanced tools</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="font-medium text-gray-900">{Math.round(progress)}% Complete</p>
                <p className="text-gray-600">{completedModules.size}/{trainingModules.length} modules</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modules Completed</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.completedModules}/{userStats.totalModules}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-green-600">{userStats.completedLessons}/{userStats.totalLessons}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.timeSpent}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certifications</p>
                <p className="text-2xl font-bold text-yellow-600">{userStats.certificationsEarned}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Training Modules */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Training Modules</h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Download Training Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingModules.map((module) => {
              const IconComponent = module.icon;
              const isCompleted = completedModules.has(module.id);
              const isExpanded = expandedSection === module.id;
              
              return (
                <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    
                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 bg-${module.color}-100 rounded-lg`}>
                          <IconComponent className={`w-6 h-6 text-${module.color}-600`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </div>
                      </div>
                      
                      {isCompleted && (
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex items-center space-x-4 mb-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{module.duration}</span>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getDifficultyColor(module.difficulty)}-100 text-${getDifficultyColor(module.difficulty)}-800`}>
                        {module.difficulty}
                      </span>
                      
                      <span className="text-gray-600">{module.lessons.length} lessons</span>
                    </div>

                    {/* Module Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : module.id)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <span>View Lessons</span>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      <div className="flex space-x-2">
                        {!isCompleted && (
                          <button
                            onClick={() => setActiveModule(module.id)}
                            className={`px-4 py-2 bg-${module.color}-600 text-white rounded-lg hover:bg-${module.color}-700 flex items-center space-x-2`}
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Module</span>
                          </button>
                        )}
                        
                        {isCompleted && (
                          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
                            <RotateCcw className="w-4 h-4" />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Lessons */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="space-y-3">
                          {module.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="text-gray-500">
                                  {getLessonTypeIcon(lesson.type)}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">{lesson.duration}</span>
                                <button className="text-blue-600 hover:text-blue-700">
                                  <Play className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Resources */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Resources</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h4 className="font-medium text-gray-900">Reference Guides</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Quick reference cards for common procedures</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Download PDF Guides →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Headphones className="w-6 h-6 text-green-600" />
                <h4 className="font-medium text-gray-900">Audio Training</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Listen to training while working</p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Access Audio Lessons →
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <h4 className="font-medium text-gray-900">Support Chat</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">Get help from training experts</p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Start Chat Support →
              </button>
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
            Continue Training
          </button>
          
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Take Certification Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicWorkerTraining;