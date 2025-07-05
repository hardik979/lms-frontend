"use client";

import SuccessCarousel from "@/components/Carousel";
import Marquee from "@/components/Marquee";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";

export default function PlacementsSection() {
  // https://369c-2401-4900-8823-93fd-9d02-9a0e-7f9c-9148.ngrok-free.app
  return (
    <>
      <section className="bg-cyan-950 text-white h-screen pt-[120px] sm:pt-[140px] lg:pt-[160px] px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col justify-center flex-grow">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Proven Placement Success
          </h2>
          <p className="text-cyan-100 text-sm sm:text-base md:text-lg max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2 sm:px-0">
            Our placement team works tirelessly to connect our graduates with
            top tech employers. With 100% placement support, live project
            experience, and in-demand tech training, our students land roles at
            companies that value real skills.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
            <div className="bg-cyan-900/40 p-3 sm:p-4 rounded-lg shadow-lg hover:bg-cyan-900/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl sm:text-2xl font-bold text-sky-400 mb-1">
                100%
              </h3>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Placement Assistance
              </p>
            </div>
            <div className="bg-cyan-900/40 p-3 sm:p-4 rounded-lg shadow-lg hover:bg-cyan-900/50 transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl sm:text-2xl font-bold text-sky-400 mb-1">
                150+
              </h3>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Hiring Partners
              </p>
            </div>
            <div className="bg-cyan-900/40 p-3 sm:p-4 rounded-lg shadow-lg hover:bg-cyan-900/50 transition-all duration-300 transform hover:scale-105 sm:col-span-3 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold text-sky-400 mb-1">
                ₹15 LPA
              </h3>
              <p className="text-cyan-100 text-xs sm:text-sm">
                Highest Package Offered
              </p>
            </div>
          </div>

          {/* Quote/Testimonial */}
          <div className="bg-cyan-900/30 p-4 sm:p-5 rounded-lg shadow-inner max-w-md sm:max-w-lg md:max-w-2xl mx-auto mb-8 sm:mb-10 border border-cyan-800/30">
            <p className="text-sm sm:text-base md:text-lg italic text-cyan-100 leading-relaxed">
              "Thanks to IT Jobs Factory's project-based training and
              mentorship, I secured my first developer role within weeks of
              graduation."
            </p>
            <p className="mt-2 sm:mt-3 text-cyan-400 font-semibold text-xs sm:text-sm">
              — Shalini Rajpal, Citius Tech
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="/bootcamp"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm w-full sm:w-auto text-center"
            >
              Join Our Bootcamp Now!
            </a>
            <a
              href="#contact"
              className="inline-block bg-white hover:bg-gray-100 text-cyan-950 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-xs sm:text-sm w-full sm:w-auto text-center border-2 border-white"
            >
              Get More Info
            </a>
          </div>
        </div>
      </section>

      {/* Components with responsive spacing */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        <SuccessCarousel />
        <AlmaXTimeline />
        <Marquee />
      </div>
    </>
  );
}
