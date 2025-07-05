"use client";
import React, { useState } from "react";
import FAQAccordion from "@/components/AccordionUse";
import FlexibilitySection from "@/components/CardShow";
import SuccessCarousel from "@/components/Carousel";

import { AlmaXTimeline } from "@/components/ui/TimelineDemo";

import {
  Calendar,
  Users,
  Clock,
  Award,
  CheckCircle,
  Globe,
  BookOpen,
  Target,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    graduationYear: "",
    mobile: "",
  });
  const course = "Full Stack Web Development";
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900"></div>

        {/* Section 1: Hero Content - Takes most of the screen */}
        <section className="flex-1 text-white pt-[120px] sm:pt-[140px] lg:pt-[160px] pb-8 px-4 sm:px-6 lg:px-10 relative z-10 flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center gap-8 lg:gap-12">
              {/* LEFT: MAIN CONTENT */}
              <div className="space-y-6 lg:space-y-8">
                {/* Badge */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-white to-cyan-50 text-cyan-700 px-4 py-2.5 rounded-full shadow-lg w-fit text-sm font-semibold border border-white/20">
                  <div className="p-1 bg-cyan-600 rounded-full">
                    <Calendar size={12} className="text-white" />
                  </div>
                  <span>Coming Soon - Stay Tuned!</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>

                {/* Main Heading */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    Full Stack Web Development{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                      Coming Soon
                    </span>
                  </h1>
                  <p className="text-base text-cyan-200 max-w-xl pt-2">
                    Be the first to know when our comprehensive Full Stack Web
                    Development program launches. Master HTML, CSS, JavaScript,
                    React, Node.js, and databases to build end-to-end web
                    applications and accelerate your career.
                  </p>
                </div>

                {/* Features List */}
                <div className="grid sm:grid-cols-2 gap-3 text-base">
                  {[
                    { icon: Award, text: "Globally recognized certification" },
                    {
                      icon: BookOpen,
                      text: "Curriculum rebuilt for the AI era",
                    },
                    { icon: Clock, text: "6-month flexible online learning" },
                    { icon: Target, text: "No prior experience needed" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
                    >
                      <div className="p-1 bg-cyan-600/20 rounded-full">
                        <item.icon size={14} className="text-cyan-300" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-sm text-cyan-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>100% Placement Assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>Certification on Completion</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: FUNCTIONAL FORM */}
              <div className="bg-white/95 backdrop-blur-lg text-gray-800 rounded-2xl shadow-2xl p-6 lg:p-8 w-full max-w-md mx-auto border border-white/20 hover:shadow-3xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2 text-gray-900">
                    Book Your Free Demo Session
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Join our expert-led session and explore your tech career
                    path with personalized guidance.
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    // Validate phone
                    if (!/^\d{10}$/.test(formData.mobile)) {
                      toast.error(
                        "Please enter a valid 10-digit phone number."
                      );
                      return;
                    }

                    const formBody = new URLSearchParams();
                    formBody.append("entry.623629957", formData.email);
                    formBody.append("entry.253505507", formData.fullName);
                    formBody.append("entry.323010805", formData.graduationYear);
                    formBody.append("entry.616364387", formData.mobile);
                    formBody.append("entry.1804617433", course);

                    try {
                      await fetch(
                        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfGqIOm1AojG5QBNZRSCcfrHphc77rnvaEg7_OSnZfGKm9gTA/formResponse",
                        {
                          method: "POST",
                          mode: "no-cors",
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                          body: formBody.toString(),
                        }
                      );
                      toast.success("Session booked successfully!");
                    } catch (error) {
                      console.error("Submit error", error);
                      toast.error("Failed to submit");
                    }
                  }}
                  className="space-y-4"
                >
                  {[
                    {
                      name: "fullName",
                      placeholder: "Full Name",
                      type: "text",
                    },
                    {
                      name: "email",
                      placeholder: "Email Address",
                      type: "email",
                    },
                    {
                      name: "graduationYear",
                      placeholder: "Graduation Year",
                      type: "text",
                    },
                  ].map((field, i) => (
                    <div key={i} className="relative">
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        required
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm hover:border-gray-300"
                      />
                    </div>
                  ))}

                  {/* Mobile field with +91 prefix */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 font-medium text-sm">
                        +91
                      </span>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="10-digit Phone Number"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mobile: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      pattern="\d{10}"
                      maxLength={10}
                      required
                      className="w-full pl-12 px-3 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-cyan-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm hover:border-gray-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white w-full py-3 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} />
                    Book Your Demo Session
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Compact Stats Banner - Fixed height at bottom */}
        <section className="bg-gradient-to-r from-cyan-900 to-cyan-800 text-white border-t border-cyan-700/50 px-4 sm:px-6 lg:px-10 py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Duration", value: "6 Months", icon: Clock },
                {
                  label: "Eligibility",
                  value: "Graduates & Working Professionals",
                  icon: Users,
                },
                {
                  label: "Learning Mode",
                  value: "Live Classes and Recorded Lectures",
                  icon: Globe,
                },
                {
                  label: "Cohort",
                  value: "Coming Soon!",
                  icon: Calendar,
                },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="p-2 bg-cyan-600/20 rounded-full w-fit mx-auto mb-3 group-hover:bg-cyan-600/30 transition-colors">
                    <stat.icon size={20} className="text-cyan-300" />
                  </div>
                  <p className="text-xs text-cyan-200 mb-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-sm lg:text-base font-bold text-white leading-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <FAQAccordion />
      <SuccessCarousel />

      <AlmaXTimeline />
      <FlexibilitySection />
    </>
  );
}
