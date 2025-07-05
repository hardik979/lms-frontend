"use client";

import { Target, Rocket } from "lucide-react";
import FAQAccordion from "@/components/AccordionUse";
import SuccessCarousel from "@/components/Carousel";

export default function AboutSection() {
  return (
    <>
      {/* WHO WE ARE - Full Height with Responsive Fix */}
      <section className="bg-gradient-to-br from-cyan-950 via-cyan-900 to-slate-900 min-h-[100dvh] mt-16 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 pt-[120px] sm:pt-[140px] lg:pt-[160px] flex flex-col justify-center relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-cyan-400 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-sky-300 rounded-full blur-xl sm:blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 sm:bottom-40 left-1/4 w-18 sm:w-28 lg:w-36 h-18 sm:h-28 lg:h-36 bg-cyan-300 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-1/3 w-14 sm:w-20 lg:w-28 h-14 sm:h-20 lg:h-28 bg-sky-400 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[15px_15px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-6 sm:gap-8 lg:gap-12 relative z-10">
          {/* Who We Are Box */}
          <div className="group relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-cyan-900/80 to-cyan-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl max-w-5xl mx-auto text-center border border-cyan-600/40 hover:border-cyan-500/60 transition-all duration-500">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Who We Are
              </h3>
              <p className="text-cyan-100 text-base sm:text-lg lg:text-xl leading-relaxed">
                At{" "}
                <span className="font-bold bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">
                  IT Jobs Factory
                </span>
                , we're dedicated to bridging the gap between aspiring tech
                professionals and employers. With over a decade of experience,
                we offer immersive, job-focused training tailored to the demands
                of today's IT industry. Our programs empower fresh graduates and
                experienced professionals alike with real-world projects and
                100% job assistance.
              </p>
            </div>
          </div>

          {/* Mission & Vision row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full max-w-6xl">
            {/* Mission */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/90 to-cyan-800/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-cyan-600/40 hover:border-yellow-500/40 transition-all duration-500 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    Mission
                  </h3>
                </div>
                <p className="text-cyan-100 leading-relaxed text-sm sm:text-base lg:text-lg">
                  IT Jobs Factory is dedicated to bridging the gap between IT
                  aspirants and employers by providing high-quality,
                  industry-relevant training and 100% job assistance. We empower
                  both fresh graduates and working professionals to secure their
                  dream IT roles through personalized training in Java, DevOps,
                  Cloud, AI, Data Analytics, Full Stack Development, and more.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-500 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative bg-gradient-to-br from-cyan-900/90 to-sky-800/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-cyan-600/40 hover:border-yellow-500/40 transition-all duration-500 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <Rocket className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                    Vision
                  </h3>
                </div>
                <p className="text-cyan-100 leading-relaxed text-sm sm:text-base lg:text-lg">
                  Our vision is to turn IT dreams into reality by empowering job
                  seekers with the skills and confidence to thrive in the
                  industry through hands-on projects, expert mentorship,
                  continuous learning opportunities, and strong portfolios that
                  showcase their capabilities to potential employers and
                  recruiters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion />
      <SuccessCarousel />
    </>
  );
}
