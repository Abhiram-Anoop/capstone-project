import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer.jsx";
import {
  ArrowLeft,
  User,
  UserCheck,
  Stethoscope,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  IndianRupee,
  HeartPulse,
  GraduationCap,
  University,
  CheckCircle2,
  Medal,
  Award,
  BookOpen,
  CalendarCheck,
  FileText,
  CalendarDays,
  Globe,
  Languages,
  Activity,
  StethoscopeIcon,
  Microscope,
  Heart,
} from "lucide-react";

const doctors = [
  {
    id: "1",
    name: "Dr. Michael Chen",
    specialization: "Cardiologist",
    experience: "15 years",
    rating: 4.8,
    price: 1500,
    image: "https://i.pravatar.cc/100?img=11",
    hospital: "Heart Care Center, Medical District, Downtown",
    phone: "+1 (555) 123-4567",
    email: "dr.chen@heartcare.com",
    timing: "9:00 AM - 5:00 PM",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["English", "Mandarin", "Spanish"],
    specializations: [
      "Interventional Cardiology",
      "Cardiac Catheterisation",
      "Coronary Angioplasty",
      "Heart Disease Prevention",
    ],
  },
  {
    id: "2",
    name: "Dr. Sarah Williams",
    specialization: "Neurologist",
    experience: "12 years",
    rating: 4.6,
    price: 800,
    image: "https://i.pravatar.cc/100?img=12",
    hospital: "Neuro Care Hospital, Uptown",
    phone: "+1 (555) 234-5678",
    email: "dr.lee@neurocare.com",
    timing: "10:00 AM - 6:00 PM",
    workingDays: ["Mon", "Wed", "Fri"],
    languages: ["English", "French"],
    specializations: [
      "Brain Surgery",
      "Stroke Treatment",
      "Epilepsy Management",
    ],
  },
  {
    id: "3",
    name: "Dr. Rajesh Gupta",
    specialization: "Orthopedic",
    experience: "12 years",
    rating: 4.6,
    price: 1200,
    image: "https://i.pravatar.cc/100?img=13",
    hospital: "Neuro Care Hospital, Uptown",
    phone: "+1 (555) 234-5678",
    email: "dr.lee@neurocare.com",
    timing: "10:00 AM - 6:00 PM",
    workingDays: ["Mon", "Wed", "Fri"],
    languages: ["English", "French"],
    specializations: [
      "Brain Surgery",
      "Stroke Treatment",
      "Epilepsy Management",
    ],
  },
  {
    id: "4",
    name: "Dr.Neha Sharma",
    specialization: "Dermatologists",
    experience: "8 years",
    rating: 4.6,
    price: 1000,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    hospital: "Neuro Care Hospital, Uptown",
    phone: "+1 (555) 234-5678",
    email: "dr.lee@neurocare.com",
    timing: "10:00 AM - 6:00 PM",
    workingDays: ["Mon", "Wed", "Fri"],
    languages: ["English", "French"],
    specializations: [
      "Brain Surgery",
      "Stroke Treatment",
      "Epilepsy Management",
    ],
  },
];

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const doctor = doctors.find((doc) => doc.id === id);

  if (!doctor) {
    return (
      <div className="p-10 text-center text-red-500 text-lg font-semibold">
        Doctor not found!
      </div>
    );
  }

  return (
   <>
   <Header></Header>
   <div className="bg-[#F0F2F5] min-h-screen p-6 md:p-10 font-sans">
  {/* Full width container */}
  <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-10">
    {/* Header */}
    <div className="flex items-center text-[#4B5563] mb-6">
      <ArrowLeft
        className="w-6 h-6 mr-2 cursor-pointer text-[#14B8A6]"
        onClick={() => navigate(-1)}
      />
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <User className="text-[#14B8A6]" /> Doctor Profile
      </h2>
    </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-grow flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-[#F7F9FB] rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden border-4 border-[#10B981] shadow-md">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-3xl font-bold text-[#1F2937] flex items-center gap-2">
                  {doctor.name} <UserCheck className="text-[#10B981]" />
                </h3>
                <p className="text-lg text-[#4B5563] mt-1 flex items-center gap-2">
                  <Stethoscope className="text-[#10B981]" />{" "}
                  {doctor.specialization}
                </p>
                <div className="flex items-center justify-center sm:justify-start mt-2 space-x-2 text-[#F59E0B] font-semibold">
                  <Star fill="#F59E0B" className="text-[#F59E0B]" />
                  <span>{doctor.rating}</span>
                  <span className="text-sm font-normal text-[#9CA3AF] ml-2">
                    {doctor.experience} experience
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-[#4B5563]">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#10B981]" />
                    <span className="text-sm">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-[#10B981]" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#10B981]" />
                    <span className="text-sm">{doctor.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-[#10B981]" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                </div>

                <div className="mt-4 text-3xl font-bold text-[#06b6d4] flex items-center gap-2">
                  <IndianRupee /> {doctor.price}
                  <span className="text-sm font-normal text-[#6B7280]">
                    per consultation
                  </span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-[#F7F9FB] rounded-lg p-6">
              <div className="flex items-center text-[#1F2937] mb-4">
                <User className="text-[#9CA3AF] mr-3" />
                <h4 className="text-xl font-semibold">About {doctor.name}</h4>
              </div>
              <p className="text-[#4B5563] leading-relaxed">
                {doctor.name} is a highly experienced {doctor.specialization}{" "}
                with over {doctor.experience} in treating patients.{" "}
                <HeartPulse className="inline text-[#EF4444]" /> Known for
                patient-centered care and expertise in{" "}
                {doctor.specializations.join(", ")}.
              </p>
            </div>

            {/* Education (Dummy for now) */}
            <div className="bg-[#F7F9FB] rounded-lg p-6">
              <div className="flex items-center text-[#1F2937] mb-4">
                <GraduationCap className="text-[#9CA3AF] mr-3" />
                <h4 className="text-xl font-semibold">
                  Education & Qualifications
                </h4>
              </div>
              <p className="text-[#4B5563] mb-4 flex items-center gap-2">
                <University className="text-[#10B981]" />{" "}
                MD Cardiology, Harvard Medical School; MBBS, Johns Hopkins
                University
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-[#4B5563] text-sm">
                  <CheckCircle2 className="text-[#10B981] mr-2" /> Board
                  Certified Interventional Specialist
                </li>
                <li className="flex items-center text-[#4B5563] text-sm">
                  <Medal className="text-[#10B981] mr-2" /> Awarded for
                  Excellence
                </li>
              </ul>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex-shrink-0 lg:w-80 flex flex-col gap-6">
           {/* Buttons */}
<div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-3">
  {/* Book Appointment */}
  <button className="bg-gradient-to-r from-cyan-500 to-teal-400 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300">
    📅 Book Appointment
  </button>

  {/* Generate Report */}
  <button className="border border-gray-300 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 
    transition-all duration-300 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700">
    📄 Generate Report
  </button>
</div>


            {/* Schedule */}
            <div className="bg-[#F7F9FB] rounded-lg p-6">
              <div className="flex items-center text-[#1F2937] mb-4">
                <CalendarDays className="text-[#9CA3AF] mr-3" />
                <h5 className="text-lg font-semibold">Working Schedule</h5>
              </div>
              <p className="text-sm text-[#4B5563] mb-2 flex items-center gap-2">
                <Clock className="text-[#10B981]" /> Hours: {doctor.timing}
              </p>
              <p className="text-sm text-[#4B5563] mb-2 flex items-center gap-2">
                <CalendarDays className="text-[#10B981]" /> Available Days:
              </p>
              <div className="flex gap-2 flex-wrap">
                {doctor.workingDays.map((day, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-cyan-500 to-teal-400  text-white text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-[#F7F9FB] rounded-lg p-6">
              <div className="flex items-center text-[#1F2937] mb-4">
                <Globe className="text-[#9CA3AF] mr-3" />
                <h5 className="text-lg font-semibold">Languages</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="bg-[#E5E7EB] text-[#4B5563] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <Languages /> {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-[#F7F9FB] rounded-lg p-6">
              <div className="flex items-center text-[#1F2937] mb-4">
                <HeartPulse className="text-[#9CA3AF] mr-3" />
                <h5 className="text-lg font-semibold">Specializations</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {doctor.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-cyan-500 to-teal-400  text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default DoctorProfile;
