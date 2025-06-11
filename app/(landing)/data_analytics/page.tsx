"use client";

import FlexibilitySection from "@/components/CardShow";
import SuccessCarousel from "@/components/Carousel";
import ScanAnimation from "@/components/ScanAnimation";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";
import { IconCalendar } from "@tabler/icons-react";

const DataAnalyticsPage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-cyan-950 text-white">
        {/* Section 1: Hero + Form */}
        <section
          className="flex-grow pt-[160px] px-6 md:px-20"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                IT JOBS FACTORY{" "}
                <span className="text-sky-400">Data Analytics</span>
                <br />
                Program with Specialisation in{" "}
                <span className="text-sky-400">AI</span>
              </h1>
              <p className="mt-4 text-lg text-cyan-100">
                AI integrated Data Science Course{" "}
                <span className="font-semibold text-white">Online</span>
              </p>
              <p className="mt-4 text-cyan-200 text-base max-w-xl">
                Learn how to turn data into decisions with industry-ready skills
                and hands-on training — powered by AI-driven tools.
              </p>
              <ul className="mt-6 text-cyan-100 font-medium space-y-2">
                <li>• Live Class</li>
                <li>• 1:1 mentorship</li>
                <li>• Industry projects</li>
              </ul>

              {/* Bottom Info Row */}
              <div className="mt-8 flex flex-col sm:flex-row gap-6 text-sm">
                <div className="flex items-center gap-2 text-cyan-100">
                  <IconCalendar size={20} />
                  <span>
                    Next Batch starts in{" "}
                    <strong className="text-white">MAY</strong>
                  </span>
                </div>
                <a
                  href="#"
                  className="text-sky-400 font-medium border-b border-sky-400 hover:opacity-80 w-fit"
                >
                  Download Brochure
                </a>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="bg-cyan-900/40 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md mx-auto border border-cyan-800">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Book a <span className="text-sky-400 font-bold">FREE</span> live
                class
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-cyan-700 p-3 rounded bg-cyan-950 text-white placeholder-cyan-400"
                />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full border border-cyan-700 p-3 rounded bg-cyan-950 text-white placeholder-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Year of Passing"
                  className="w-full border border-cyan-700 p-3 rounded bg-cyan-950 text-white placeholder-cyan-400"
                />
                <div className="flex gap-2">
                  <select className="border border-cyan-700 p-3 rounded w-1/3 bg-cyan-950 text-white">
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-2/3 border border-cyan-700 p-3 rounded bg-cyan-950 text-white placeholder-cyan-400"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded font-medium transition"
                >
                  Book Live Class
                </button>
                <p className="text-xs text-cyan-400 mt-2">
                  Already have an account?{" "}
                  <a href="#" className="text-sky-400 underline">
                    click here
                  </a>
                  <br />
                  By creating an account I have read and agree to IT JOBS
                  FACTORY’s{" "}
                  <a href="#" className="underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Section 2: Bottom Info Banner */}
        <section className="border-t border-white/10 px-4 sm:px-10 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 text-center gap-y-6">
            <div>
              <p className="text-sm text-cyan-300 mb-1">Duration</p>
              <p className="text-lg font-semibold text-white">12 Months</p>
            </div>
            <div>
              <p className="text-sm text-cyan-300 mb-1">Eligibility</p>
              <p className="text-lg font-semibold text-white">
                Graduates & Working Professionals
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-300 mb-1">Learning Mode</p>
              <p className="text-lg font-semibold text-white">
                Online Live Classes
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-300 mb-1">Next Cohort</p>
              <p className="text-lg font-semibold text-white">
                Starts 16th May
              </p>
            </div>
          </div>
        </section>
      </div>
      <SuccessCarousel />

      <AlmaXTimeline />
      <FlexibilitySection />
    </>
  );
};

export default DataAnalyticsPage;
