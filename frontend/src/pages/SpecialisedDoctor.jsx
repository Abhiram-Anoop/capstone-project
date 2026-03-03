import React from "react";
import { Link } from "react-router-dom";
import Header from "../assets/component/Header";
import Footer from "../assets/component/Footer";

const defaultImage = "https://via.placeholder.com/150?text=Doctor";

const doctors = [
  {
    title: "General Physician",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmSkhIrLUwpHVGvtgHlVbY3vtyHyflCnp-fQ&s",
  },
  {
    title: "Pediatrician",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-pediatric-web.png?w=256&q=75",
  },
  {
    title: "Gynecologist / Obstetrician ",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-gynic-web.png?w=256&q=75",
  },
  {
    title: "Cardiologist",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-cardiology-web.png?w=256&q=75",
  },
  {
    title: "Neurologist",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-neurology-web.png?w=256&q=75",
  },
  {
    title: "Orthopedic Doctor",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-orthopedic-web.png?w=256&q=75",
  },
  {
    title: "Dermatologist",
    img: "https://media.istockphoto.com/id/2085838284/photo/doctor-using-dermoscope-on-patients-face.webp?a=1&b=1&s=612x612&w=0&k=20&c=P_GJ9rwE8pb0zx6-i7iDztl8J-0t9m3q9gHDQ_XVh_w=",
  },
  {
    title: "Psychiatrist",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-psychiatric-web.png?w=256&q=75",
  },
  {
    title: "Ophthalmologist",
    img: "https://www.centreforsight.net/wp-content/uploads/2022/10/pediatric-ophthalmologist.webp",
  },
  {
    title: "ENT Specialist",
    img: "https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/managing_oral_and_nasal_ulcers_in_lupus_slideshow/1800ss_getty_rf_doctor_examining_nose.jpg?resize=750px:*&output-quality=75",
  },
  {
    title: "Gastroenterologist",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-gastrology-web.png?w=256&q=75",
  },
  {
    title: "Pulmonologist",
    img: "https://media.istockphoto.com/id/1609493340/photo/doctor-examining-the-health-of-the-patients-lungs-pulmonologist-doctor-lungs-specialist.jpg?s=612x612&w=0&k=20&c=yhRY0bs-Poyd1_0Vq98-bGIjT4596axEq03xD4Qrda8=",
  },
  {
    title: "Nephrologist",
    img: "https://my.clevelandclinic.org/-/scassets/images/org/health/articles/24214-nephrologist",
  },
  {
    title: "Endocrinologist",
    img: "https://media.gettyimages.com/id/184956723/photo/female-doctor-examining-her-patient.jpg?s=612x612&w=gi&k=20&c=TOBmy2ZJgJG_ugE28nk8p8C-HpWmgqmHqjrWzARQs-Q=",
  },
  {
    title: "Oncologist",
    img: "https://akam.cdn.jdmagicbox.com/images/icons/iphone/newfilter/ip-oncologist-web.png?w=256&q=75",
  },
  {
    title: "Urologist",
    img: "https://i0.wp.com/vivekanandahospital.in/wp-content/uploads/2021/04/urology.jpg?fit=1200%2C747&ssl=1",
  },
];

const SpecialisedDoctor = () => {
  return (
    <>
      <Header />
      <div className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 tracking-tight">
          Specialised Healthcare Support
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {doctors.map((doc, index) => (
            <Link
              to={`/find-doctor?specialty=${encodeURIComponent(doc.title)}`}
              key={index}
            >
              <div
                className="relative bg-white rounded-xl shadow-sm border border-gray-100
                           hover:shadow-lg hover:border-blue-300/50 transform hover:-translate-y-1 hover:scale-105 
                           transition-all duration-200 ease-out flex flex-col items-center cursor-pointer p-4"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-200/20 to-cyan-200/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex flex-col items-center relative z-10">
                  <img
                    src={doc.img ? doc.img : defaultImage}
                    alt={doc.title}
                    className="w-24 h-24 object-contain mb-4"
                  />
                  <h3 className="text-sm font-medium text-gray-800 mb-1 text-center">
                    {doc.title}
                  </h3>
                  <span className="block w-10 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mb-2"></span>
                  <p className="text-xs text-gray-600 text-center">
                    Expert care in {doc.title.toLowerCase()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SpecialisedDoctor;