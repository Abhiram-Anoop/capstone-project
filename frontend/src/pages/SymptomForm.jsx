// SymptomForm.jsx

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Stethoscope, User, TrendingUp, Heart, Activity, Brain, Thermometer, Eye, Ear, Pill, Syringe, Clipboard, Scan, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../assets/component/card";
import { Checkbox } from "../assets/component/checkbox";
import { Button } from "../assets/component/button";
import { Badge } from "../assets/component/badge";
import { AnimatePresence, motion } from "framer-motion";
import { Label } from "../assets/component/lable";
import { Input } from "../assets/component/input";
import ReportDisplay from "./ReportDisplay";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";

// Map symptom IDs to Lucide icons
const symptomIcons = {
  fever: <Thermometer className="w-4 h-4" />,
  fatigue: <Heart className="w-4 h-4" />,
  chills: <Thermometer className="w-4 h-4" />,
  weakness: <Heart className="w-4 h-4" />,
  cough: <Stethoscope className="w-4 h-4" />,
  "shortness-breath": <Stethoscope className="w-4 h-4" />,
  "chest-pain": <Heart className="w-4 h-4" />,
  "sore-throat": <Stethoscope className="w-4 h-4" />,
  headache: <Brain className="w-4 h-4" />,
  dizziness: <Brain className="w-4 h-4" />,
  confusion: <Brain className="w-4 h-4" />,
  "memory-loss": <Brain className="w-4 h-4" />,
  "vision-changes": <Eye className="w-4 h-4" />,
  "hearing-loss": <Ear className="w-4 h-4" />,
  "ringing-ears": <Ear className="w-4 h-4" />,
  nausea: <X className="w-4 h-4" />,
  vomiting: <Syringe className="w-4 h-4" />,
  diarrhea: <Clipboard className="w-4 h-4" />,
  "abdominal-pain": <Scan className="w-4 h-4" />,
};

const SymptomForm = () => {
  const { t } = useTranslation('symptomsPage');
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [patientDetails, setPatientDetails] = useState({ name: "", age: "", bloodPressure: "", pulseRate: "" });
  const [report, setReport] = useState(null);
  
  // Dynamically build symptoms list from JSON
  const symptoms = useMemo(() => {
    const symptomKeys = Object.keys(t('symptoms', { returnObjects: true }));
    return symptomKeys.map(key => ({
      id: key,
      ...t(`symptoms.${key}`, { returnObjects: true }),
      icon: symptomIcons[key] || <Pill className="w-4 h-4" />,
    }));
  }, [t]);

  // Dynamically build categories list from JSON
  const categories = useMemo(() => {
    const categoryKeys = Object.keys(t('categories', { returnObjects: true }));
    return categoryKeys.map(key => ({
      id: key,
      name: t(`categories.${key}`),
    }));
  }, [t]);

  const filteredSymptoms =
    selectedCategory === "all"
      ? symptoms
      : symptoms.filter((s) => s.category.toLowerCase() === selectedCategory);

  const handleSymptomChange = (symptomId, checked) => {
    setSelectedSymptoms(prev => checked ? [...prev, symptomId] : prev.filter(id => id !== symptomId));
  };

  const handlePatientDetailsChange = (e) => {
    const { id, value } = e.target;
    setPatientDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleStep1Submit = () => {
    if (!patientDetails.name || !patientDetails.age) {
      alert(t('alerts.nameAgeRequired'));
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = async () => {
    if (selectedSymptoms.length === 0) {
      alert(t('alerts.symptomRequired'));
      return;
    }
    const formData = {
      ...patientDetails,
      selectedSymptoms: symptoms
        .filter(s => selectedSymptoms.includes(s.id))
        .map(s => ({ id: s.id, name: s.name, category: s.category })),
    };

    console.log("Submitting data to backend:", formData);
    try {
      // Use environment variable for API base URL
      const API_BASE = import.meta.env.VITE_BACKEND_URL || 
                       (typeof process !== 'undefined' && process.env?.REACT_APP_BACKEND_URL) ||
                       "https://telehealth-connect-2.preview.emergentagent.com";
      
      const response = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setReport(result.report);
      alert(t('alerts.submitSuccess'));
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(t('alerts.submitError'));
    }
  };

  if (report) return <ReportDisplay reportData={report} />;

  const progress = (step / 2) * 100;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-green-500 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('title')}</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">{t('description')}</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
            <span>{t('progress.label')}</span>
            <span>{t('progress.step', { step: step })}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 1 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 50 : -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {step === 1 ? (
              <Card className="border border-gray-200 bg-white shadow-sm rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-800">{t('step1.title')}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">{t('step1.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="flex items-center text-gray-700"><User className="w-4 h-4 mr-2 text-blue-500" />{t('step1.nameLabel')}</Label>
                      <Input id="name" value={patientDetails.name} onChange={handlePatientDetailsChange} placeholder={t('step1.namePlaceholder')} className="focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="age" className="flex items-center text-gray-700"><TrendingUp className="w-4 h-4 mr-2 text-blue-500" />{t('step1.ageLabel')}</Label>
                      <Input id="age" type="number" value={patientDetails.age} onChange={handlePatientDetailsChange} placeholder={t('step1.agePlaceholder')} className="focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="bloodPressure" className="flex items-center text-gray-700"><Heart className="w-4 h-4 mr-2 text-blue-500" />{t('step1.bpLabel')}</Label>
                      <Input id="bloodPressure" value={patientDetails.bloodPressure} onChange={handlePatientDetailsChange} placeholder={t('step1.bpPlaceholder')} className="focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pulseRate" className="flex items-center text-gray-700"><Activity className="w-4 h-4 mr-2 text-blue-500" />{t('step1.pulseLabel')}</Label>
                      <Input id="pulseRate" type="number" value={patientDetails.pulseRate} onChange={handlePatientDetailsChange} placeholder={t('step1.pulsePlaceholder')} className="focus:ring-blue-500 focus:border-blue-500 border-gray-300" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-6">
                    <Button onClick={handleStep1Submit} size="lg" className="px-8 py-3 text-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-full">{t('step1.continueButton')}</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-3xl">
                  <CardHeader className="pb-3"><CardTitle className="text-lg font-semibold text-gray-800">{t('step2.filterTitle')}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category.id)} className={`transition-all duration-200 rounded-full ${selectedCategory === category.id ? "bg-blue-500 text-white hover:bg-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedSymptoms.length > 0 && (
                  <Card className="border border-blue-200 bg-blue-50 rounded-3xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                        <Badge variant="secondary" className="px-2 py-1 bg-blue-500 text-white">{selectedSymptoms.length}</Badge>
                        {t('step2.summaryTitle')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.filter(s => selectedSymptoms.includes(s.id)).map(symptom => (
                          <Badge key={symptom.id} variant="default" className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800">{symptom.icon}{symptom.name}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="border border-gray-200 bg-white shadow-sm rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{t('step2.selectionTitle')}</CardTitle>
                    <CardDescription className="text-gray-600">{t('step2.selectionDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {filteredSymptoms.map((symptom) => (
                          <motion.div key={symptom.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className={`flex items-center space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedSymptoms.includes(symptom.id) ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white hover:bg-gray-50"}`} onClick={() => handleSymptomChange(symptom.id, !selectedSymptoms.includes(symptom.id))}>
                            <Checkbox id={symptom.id} checked={selectedSymptoms.includes(symptom.id)} onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked)} />
                            <div className="flex items-center gap-2 flex-1">
                              <div className="text-blue-600">{symptom.icon}</div>
                              <label htmlFor={symptom.id} className="font-medium text-gray-800 cursor-pointer flex-1">{symptom.name}</label>
                              <Badge variant="outline" className="text-xs hidden sm:block">{t(`categories.${symptom.category.toLowerCase()}`)}</Badge>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-6">
                  <Button onClick={() => setStep(1)} size="lg" className="px-8 py-3 text-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full">{t('step2.backButton')}</Button>
                  <Button onClick={handleStep2Submit} disabled={selectedSymptoms.length === 0} size="lg" className="px-8 py-3 text-lg font-semibold disabled:opacity-50 bg-blue-500 text-white hover:bg-blue-600 rounded-full">{t('step2.submitButton')}</Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default SymptomForm;
