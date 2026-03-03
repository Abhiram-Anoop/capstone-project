import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../assets/component/card";
import { Label } from "../assets/component/lable";
import { Input } from "../assets/component/input";
import { Button } from "../assets/component/button";
import {
  Mic,
  User,
  TrendingUp,
  Heart,
  Activity,
  Thermometer,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReportDisplay from "./ReportDisplay";

// Map language codes from i18next to Web Speech API codes
const langCodeMap = {
  en: "en-US",
  hi: "hi-IN",
  pa: "pa-IN",
};

const VocalInputPage = () => {
  const { t, i18n } = useTranslation('symptomsPage'); // Use the merged namespace
  const [isRecording, setIsRecording] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    bloodPressure: "",
    temperature: "",
    symptoms: "",
  });
  const [step, setStep] = useState(0);
  const recognitionRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [report, setReport] = useState(null);

  // Dynamically get prompts from the translation file
  const prompts = useMemo(() => t('vocalInput.prompts', { returnObjects: true }), [t]);

  useEffect(() => {
    setPrompt(prompts[step]);
    speak(prompts[step]);
  }, [step, prompts]);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCodeMap[i18n.language] || "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(t('vocalInput.alerts.noSupport'));
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = langCodeMap[i18n.language] || "en-US"; // Set language dynamically
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => processTranscript(event.results[0][0].transcript);
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const processTranscript = (transcript) => {
    const newDetails = { ...patientDetails };

    switch (step) {
      case 0:
        newDetails.name = transcript.trim();
        break;
      case 1:
        const ageMatch = /(\d+)/.exec(transcript);
        if (ageMatch?.[1]) newDetails.age = ageMatch[1];
        break;
      case 2:
        const bpMatch = /(\d+)\s*(over|by)?\s*(\d+)?/i.exec(transcript);
        if (bpMatch?.[1]) {
          newDetails.bloodPressure = `${bpMatch[1]}/${bpMatch[3] || '80'}`;
        }
        break;
      case 3:
        const tempMatch = /(\d+(\.\d+)?)/.exec(transcript);
        if (tempMatch?.[1]) newDetails.temperature = tempMatch[1];
        break;
      case 4:
        newDetails.symptoms = (newDetails.symptoms ? `${newDetails.symptoms} ` : "") + transcript;
        break;
      default:
        break;
    }
    setPatientDetails(newDetails);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setPatientDetails({ ...patientDetails, [id]: value });
  };

  const handleNext = () => {
    if (step < prompts.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    setPatientDetails({ name: "", age: "", bloodPressure: "", temperature: "", symptoms: "" });
    setStep(0);
    setReport(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientDetails.name || !patientDetails.age || !patientDetails.symptoms) {
      alert(t('vocalInput.alerts.allDetailsRequired'));
      return;
    }

    const formData = {
      ...patientDetails,
      selectedSymptoms: patientDetails.symptoms.split(/,|\sand\s/i).map(symptom => {
        const trimmed = symptom.trim();
        return {
          id: trimmed.toLowerCase().replace(/\s/g, "-"),
          name: trimmed,
          category: "Voice Input",
        };
      }),
    };

    try {
      const response = await fetch("https://ai-doctor-assistant-backend-ai-ml.onrender.com/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setReport(result.report);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(t('vocalInput.alerts.submitError'));
    }
  };

  if (report) {
    return <ReportDisplay reportData={report} onReset={resetForm} />;
  }

  // Helper to render the current input field
  const renderInputField = () => {
    const fields = [
      { id: 'name', icon: <User className="w-4 h-4 mr-2" />, type: 'text' },
      { id: 'age', icon: <TrendingUp className="w-4 h-4 mr-2" />, type: 'number' },
      { id: 'bloodPressure', icon: <Heart className="w-4 h-4 mr-2" />, type: 'text' },
      { id: 'temperature', icon: <Thermometer className="w-4 h-4 mr-2" />, type: 'text' },
      { id: 'symptoms', icon: <Activity className="w-4 h-4 mr-2" />, type: 'textarea' },
    ];
    const currentField = fields[step];
    if (!currentField) return null;

    return (
        <motion.div
          key={currentField.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          <Label htmlFor={currentField.id} className="flex items-center">
            {currentField.icon} {t(`vocalInput.labels.${currentField.id}`)}
          </Label>
          {currentField.type === 'textarea' ? (
            <textarea
              id={currentField.id}
              className="w-full h-32 p-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
              value={patientDetails[currentField.id]}
              onChange={handleInputChange}
              readOnly={isRecording}
            />
          ) : (
            <Input
              id={currentField.id}
              type={currentField.type}
              value={patientDetails[currentField.id]}
              onChange={handleInputChange}
              readOnly={isRecording}
            />
          )}
        </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button>{t('vocalInput.goBackButton')}</Button>
        </Link>
      </div>

      <Card className="max-w-md w-full sm:max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">{t('vocalInput.title')}</CardTitle>
          <CardDescription className="text-sm text-gray-500 min-h-[20px]">{prompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <motion.button
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl shadow-lg transition-all duration-300 ${isRecording ? "bg-red-500" : "bg-sky-500 hover:bg-sky-600"}`}
              onClick={handleMicClick}
              animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className={`w-10 h-10 sm:w-12 sm:h-12 ${isRecording ? "animate-pulse" : ""}`} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {renderInputField()}
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <Button type="button" onClick={handleBack} disabled={step === 0}>
                {t('vocalInput.buttons.back')}
              </Button>
              {step < prompts.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  {t('vocalInput.buttons.next')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-sky-500 text-white font-semibold hover:bg-sky-600"
                  disabled={!patientDetails.symptoms}
                >
                  {t('vocalInput.buttons.submit')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocalInputPage;
