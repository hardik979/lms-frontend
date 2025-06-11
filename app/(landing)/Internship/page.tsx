"use client";

import FAQAccordion from "@/components/AccordionUse";
import FlexibilitySection from "@/components/CardShow";
import SuccessCarousel from "@/components/Carousel";
import CurriculumSection from "@/components/CurriculumSection";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";
import { IconCalendar, IconStarFilled } from "@tabler/icons-react";

export default function HeroSection() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Section 1: Hero Content */}
        <section
          className="flex-grow text-white pt-[140px] pb-24 px-4 sm:px-10 bg-cyan-950 font-sans"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-start gap-16">
            {/* LEFT: MAIN CONTENT */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-white text-cyan-700 px-4 py-2 rounded-md shadow w-fit text-sm font-medium">
                <IconCalendar size={18} />
                <span>Next Cohort Starts on 16th May, 2025</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Web Development course with{" "}
                <span className="text-cyan-400">Internship Certification</span>
              </h1>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled key={i} size={16} />
                  ))}
                </div>
                <span>Rated 4.8/5 by 10,000+ learners</span>
              </div>

              <ul className="text-sm space-y-2 pl-2">
                <li> Globally recognized certification</li>
                <li> Curriculum rebuilt for the AI era</li>
                <li> 12-month flexible online learning</li>
                <li> No coding experience needed</li>
              </ul>

              <div className="flex gap-4 flex-wrap pt-4">
                <button className="bg-cyan-600 text-white hover:bg-cyan-700 px-5 py-2 rounded-md">
                  Start Your Application
                </button>
                <button className="border border-white hover:bg-white hover:text-cyan-950 text-white px-5 py-2 rounded-md font-semibold transition">
                  Explore Program
                </button>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">
                Book a Free Demo Session
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Join our expert-led session and explore your tech career path.
              </p>

              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Graduation Year"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white w-full py-2 rounded-md text-sm font-bold"
                >
                  Book Your Demo Session
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Section 2: Stats Banner */}
        <section className="bg-cyan-950 text-white border-t border-white/10 px-4 sm:px-10 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 text-center gap-y-6">
            {/* Duration */}
            <div>
              <p className="text-sm text-cyan-300 mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">12 Months</p>
            </div>

            {/* Eligibility */}
            <div>
              <p className="text-sm text-cyan-300 mb-1">Eligibility</p>
              <p className="text-lg font-semibold text-white">
                Graduates & Working Professionals
              </p>
            </div>

            {/* Learning Mode */}
            <div>
              <p className="text-sm text-cyan-300 mb-1">Learning Mode</p>
              <p className="text-lg font-semibold text-white">
                Online Live Classes
              </p>
            </div>

            {/* Next Cohort */}
            <div>
              <p className="text-sm text-cyan-300 mb-1">Next Cohort</p>
              <p className="text-lg font-semibold text-white">
                Starts 16th May
              </p>
            </div>
          </div>
        </section>
      </div>
      <CurriculumSection />
      <FAQAccordion />
      <SuccessCarousel />

      <AlmaXTimeline />
      <FlexibilitySection />
    </>
  );
}
