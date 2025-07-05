"use client";

import FAQAccordion from "@/components/AccordionUse";

import SuccessCarousel from "@/components/Carousel";

import Footer from "@/components/Footer";

import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import RotatingText from "@/components/TextChange";

import PopupModal from "@/components/ui/PopModel";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";
import {
  IconCalendar,
  IconMapPin,
  IconCertificate,
  IconSchool,
  IconBuildingBank,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    graduationYear: "",
    phone: "",
    education: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error(
        "Please enter a valid 10-digit phone number without country code."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const formBody = new URLSearchParams();
      // Replace entry IDs below with your actual Google Form entry IDs

      formBody.append("entry.1786796031", formData.name);

      formBody.append("entry.1038515024", formData.phone);
      formBody.append("entry.1825069237", formData.education);

      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeUhGeU1V3L_g0JdMyAhDE6LAhPq6chASH22JNLFetzayF9Bw/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString(),
        }
      );

      toast.success("Enquiry Submitted Successfully!");
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />

      <PopupModal />
      <a
        href="https://wa.me/+919425645642?text=Hi%2C%20can%20you%20tell%20me%20more" // Replace with your number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-colors duration-300"
      >
        <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8" />
      </a>

      {/* HERO SECTION */}
      <section
        className="text-white pt-[120px] sm:pt-[140px] lg:pt-[160px] py-4 px-4 sm:px-6 flex items-center justify-center bg-cyan-950 min-h-screen"
        style={{
          backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="w-full max-w-7xl h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center mb-6 lg:mb-8">
            {/* Title Content - Now appears first on mobile */}
            <div className="lg:col-span-3 order-1">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-cyan-900 text-xs sm:text-sm font-medium mb-3 w-fit shadow">
                <IconCalendar size={16} className="text-cyan-900" />
                <span>Few seats left — Enroll now to secure your spot!</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 lg:mb-4 leading-tight">
                <RotatingText
                  texts={[
                    "Build Your Career in Tech with Real Industry Skills",
                    "Kickstart Your Successful Career in the IT Industry",
                    "Get Ready for a Future-Proof Career in Tech",
                  ]}
                  mainClassName="inline-block text-sky-400 whitespace-nowrap text-center"
                  staggerFrom="first"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  staggerDuration={0.03}
                  splitLevelClassName="overflow-hidden"
                  elementLevelClassName="inline-block"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={5000}
                  auto
                  loop
                />
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm mt-4 mb-3 text-white">
                <IconBuildingBank size={16} className="text-sky-400" />
                <span>
                  Trusted by Hiring Partners like TCS, IBM, and Accenture
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-white word-spacing">
                <div className="flex items-start gap-2">
                  <IconCircleCheckFilled
                    size={14}
                    className="text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    Join our 3-Month Job Bootcamp — master monitoring & incident
                    response with Grafana, Splunk, and more.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <IconCircleCheckFilled
                    size={14}
                    className="text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    Work on Industry grade Monitoring and Observability tools.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <IconCircleCheckFilled
                    size={14}
                    className="text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    Built for Graduates, Job-Switchers & Early Professionals.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <IconCircleCheckFilled
                    size={14}
                    className="text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    AI-integrated curriculum with hands-on weekly Quizes and
                    Assignments.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <IconCircleCheckFilled
                    size={14}
                    className="text-green-400 mt-0.5 flex-shrink-0"
                  />
                  <span>
                    100% Job Placement Assistance with Interview Prep.
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-3 sm:gap-4 flex-wrap">
                <a href={"/brochure"} target="_blank" rel="noopener noreferrer">
                  <button className="bg-cyan-600 text-white hover:bg-cyan-700 px-4 sm:px-5 py-2 rounded-md text-xs sm:text-sm transition-colors">
                    Explore Track
                  </button>
                </a>
                <Link href={"/bootcamp"}>
                  <button className="bg-cyan-950 text-yellow-400 border border-yellow-400 hover:bg-yellow-500 hover:text-cyan-950 px-4 sm:px-5 py-2 rounded-md transition text-xs sm:text-sm">
                    Start Your Career
                  </button>
                </Link>
              </div>
            </div>

            {/* Combined Image and Form - Now appears second on mobile */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-2xl mt-4 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 order-2 max-w-md mx-auto lg:mx-0 w-full">
              <div className="h-32 sm:h-40 lg:h-48 xl:h-56 relative overflow-hidden">
                <Image
                  src="/code3.png"
                  alt="Hero Image"
                  fill // ✅ this tells Next.js to stretch image to fill parent
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority // optional: remove if not above the fold
                />
              </div>
              <div className="p-4 sm:p-5 text-white">
                <h3 className="text-base sm:text-lg font-semibold mb-3 text-center text-white">
                  Book Your Free Career Counseling
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-cyan-700 bg-cyan-800 text-white placeholder-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm"
                  />
                  <input
                    type="text"
                    name="education"
                    placeholder="Educational Qualification"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-cyan-700 bg-cyan-800 text-white placeholder-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm"
                  />
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-cyan-300 font-medium text-xs sm:text-sm">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit Phone Number"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ""); // allow only digits
                        setFormData({ ...formData, phone: val });
                      }}
                      pattern="\d{10}"
                      maxLength={10}
                      required
                      className="w-full pl-12 px-3 py-2 border border-cyan-700 bg-cyan-800 text-white placeholder-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-cyan-900 hover:bg-slate-200 hover:text-cyan-800 py-2 rounded-md font-semibold transition text-xs sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*Hero section ended */}
      {/* CERTIFICATION SECTION */}
      <section className="bg-cyan-50   text-cyan-900 px-4 sm:px-6 py-20">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Earn Your{" "}
            <span className="text-sky-500 underline underline-offset-4">
              Professional Tech Certification
            </span>
          </h2>
          <p className="text-cyan-600 mt-2 max-w-2xl mx-auto">
            Prove your expertise with certifications trusted by recruiters.
            Showcase your project portfolio and boost your job readiness with
            globally valued credentials.
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 font-semibold mb-12 text-cyan-700 flex-wrap text-center">
          <span>IT JOBS FACTORY</span>

          <span>Industry Experts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 max-w-xl mx-auto">
            {[
              [
                <IconCertificate size={42} className="text-cyan-600 mt-1" />,
                "Certification by IT JOBS FACTORY",
                "Recognized by top recruiters across domains.",
              ],
              [
                <IconSchool size={32} className="text-cyan-600 mt-1" />,
                "Mentorship from Real Software Engineers",
                "Learn directly from software engineers working at top firms.",
              ],
              [
                <IconMapPin size={32} className="text-cyan-600 mt-1" />,
                "Real-world Industry Projects",
                "Gain practical experience with real company projects.",
              ],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="flex items-start gap-4">
                {icon}
                <div>
                  <h3 className="font-semibold text-cyan-800">{title}</h3>
                  <p className="text-cyan-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-4 mt-6">
              <Link href={"/bootcamp"}>
                {" "}
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md">
                  Explore Program
                </button>
              </Link>

              <a href="/brochure" target="_blank" rel="noopener noreferrer">
                <button className="border border-cyan-600 text-cyan-600 hover:bg-sky-50 px-5 py-2 rounded-md">
                  Download Brochure
                </button>
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src="/certificate.png"
              alt="Certification Sample"
              className="rounded-md shadow-md border border-cyan-200 w-full max-w-lg h-auto"
            />
          </div>
        </div>
      </section>
      {/* Add-ons */}
      <FAQAccordion />
      <Marquee />
      <AlmaXTimeline />
      <SuccessCarousel />
      <Footer />
    </>
  );
}
