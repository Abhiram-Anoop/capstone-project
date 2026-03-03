import { Stethoscope, Heart, Brain, Thermometer, Eye, Ear, Pill, Syringe, Clipboard, Scan, X } from "lucide-react";

export const symptoms = [
  // General
  { id: "fever", name: "Fever", category: "General", icon: <Thermometer className="w-4 h-4" /> },
  { id: "fatigue", name: "Fatigue", category: "General", icon: <Heart className="w-4 h-4" /> },
  { id: "chills", name: "Chills", category: "General", icon: <Thermometer className="w-4 h-4" /> },
  { id: "weakness", name: "Weakness", category: "General", icon: <Heart className="w-4 h-4" /> },
  
  // Respiratory
  { id: "cough", name: "Cough", category: "Respiratory", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "shortness-breath", name: "Shortness of breath", category: "Respiratory", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "chest-pain", name: "Chest pain", category: "Respiratory", icon: <Heart className="w-4 h-4" /> },
  { id: "sore-throat", name: "Sore throat", category: "Respiratory", icon: <Stethoscope className="w-4 h-4" /> },
  
  // Neurological
  { id: "headache", name: "Headache", category: "Neurological", icon: <Brain className="w-4 h-4" /> },
  { id: "dizziness", name: "Dizziness", category: "Neurological", icon: <Brain className="w-4 h-4" /> },
  { id: "confusion", name: "Confusion", category: "Neurological", icon: <Brain className="w-4 h-4" /> },
  { id: "memory-loss", name: "Memory problems", category: "Neurological", icon: <Brain className="w-4 h-4" /> },
  
  // Sensory
  { id: "vision-changes", name: "Vision changes", category: "Sensory", icon: <Eye className="w-4 h-4" /> },
  { id: "hearing-loss", name: "Hearing problems", category: "Sensory", icon: <Ear className="w-4 h-4" /> },
  { id: "ringing-ears", name: "Ringing in ears", category: "Sensory", icon: <Ear className="w-4 h-4" /> },
  
  // Gastrointestinal
  { id: "nausea", name: "Nausea", category: "Gastrointestinal", icon: <X className="w-4 h-4" /> },
  { id: "vomiting", name: "Vomiting", category: "Gastrointestinal", icon: <Syringe className="w-4 h-4" /> },
  { id: "diarrhea", name: "Diarrhea", category: "Gastrointestinal", icon: <Clipboard className="w-4 h-4" /> },
  { id: "abdominal-pain", name: "Stomach ache", category: "Gastrointestinal", icon: <Scan className="w-4 h-4" /> },
];