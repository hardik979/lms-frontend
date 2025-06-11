"use client";

import FAQAccordion from "@/components/AccordionUse";

import SuccessCarousel from "@/components/Carousel";

import Footer from "@/components/Footer";

import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";

import PopupModal from "@/components/ui/PopModel";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";
import {
  IconCalendar,
  IconMapPin,
  IconCertificate,
  IconSchool,
  IconCalendarDue,
  IconBuildingBank,
  IconUsersGroup,
  IconBooks,
  IconCircleCheckFilled,
} from "@tabler/icons-react";

export default function Page() {
  return (
    <>
      <Navbar />
      <PopupModal />
      {/* HERO SECTION */}
      <section
        className="text-white font-montserrat pt-[120px] min-h-screen py-12 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-cyan-950"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="max-w-2xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 px-3 py-3 rounded-md bg-white text-cyan-600 text-sm font-medium mb-4 w-fit shadow">
            <IconCalendar size={18} className="text-cyan-600" />
            <span>
              Few seats left — Launch your tech career by 16th May, 2025
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
            Become a Job ready - Full Stack Developer
          </h1>
          {/* 
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
            Become a Job-ready{" "}
            <RotatingText
              texts={[
                "Full Stack Developer",
                "Data Analyst",
                "AI Engineer",
                "Cloud Engineer",
              ]}
              mainClassName="inline-block px-1 text-cyan-400 whitespace-nowrap" // ✅ ensures no wrap
              staggerFrom="first"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              staggerDuration={0.03}
              splitLevelClassName="overflow-hidden"
              elementLevelClassName="inline-block"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
              auto
              loop
            />
          </h1> */}
          <div className="flex items-center gap-2 text-sm mb-4 text-white">
            <IconBuildingBank size={16} className="text-sky-400" />
            <span>Trusted by Hiring Partners like TCS, IBM, and Accenture</span>
          </div>

          <div className="space-y-3 text-sm text-white">
            <div className="flex items-start gap-2">
              <IconCircleCheckFilled
                size={16}
                className="text-green-400 mt-0.5"
              />
              <span>
                6-month hybrid online training with daily live mentorship
              </span>
            </div>
            <div className="flex items-start gap-2">
              <IconCircleCheckFilled
                size={16}
                className="text-green-400 mt-0.5"
              />
              <span>
                Work on 5+ real-world projects with GitHub portfolio support
              </span>
            </div>
            <div className="flex items-start gap-2">
              <IconCircleCheckFilled
                size={16}
                className="text-green-400 mt-0.5"
              />
              <span>
                Built for graduates, job-switchers & early professionals
              </span>
            </div>
            <div className="flex items-start gap-2">
              <IconCircleCheckFilled
                size={16}
                className="text-green-400 mt-0.5"
              />
              <span>
                AI-integrated curriculum with hands-on weekly coding challenges
              </span>
            </div>
            <div className="flex items-start gap-2">
              <IconCircleCheckFilled
                size={16}
                className="text-green-400 mt-0.5"
              />
              <span>Guaranteed job support with 100+ hiring partners</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="bg-cyan-600 text-white hover:bg-cyan-700 px-5 py-2 rounded-md">
              Explore Track
            </button>
            <button className="bg-cyan-950 text-yellow-400 border border-yellow-400 hover:bg-yellow-500 hover:text-cyan-950 px-5 py-2 rounded-md transition">
              Start Your Career
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <img
            src="/code.jpg"
            alt="Hero Image"
            className=" pt-6 shadow-2xl w-full h-auto max-w-full object-cover max-h-[500px] sm:max-h-[600px] md:max-h-[760px]"
          />
          <p className="text-center text-base text-cyan-300 mt-4 max-w-[90%]">
            India’s Practical Training Program for Future Tech Leaders
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-cyan-50 text-cyan-900 px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          <span className="text-sky-600 underline underline-offset-4">
            Job-Ready Placements
          </span>{" "}
          With Top Tech Firms
        </h2>

        <p className="text-cyan-700 max-w-2xl mx-auto mb-10">
          Join our flagship full stack program curated by IT JOBS FACTORY. Learn
          from industry experts, build real-world projects, and get guaranteed
          placement support with top-tier hiring partners.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {[
            ["1000+", "Learners Trained"],
            ["15 LPA", "Top Salary Package"],
            ["8 LPA", "Average Package"],
            ["200+", "Partner Companies"],
          ].map(([title, desc]) => (
            <div key={title}>
              <h3 className="text-3xl font-semibold text-cyan-900">{title}</h3>
              <p className="text-sm text-cyan-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="bg-cyan-950 text-white py-20 px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2">
          Powered by{" "}
          <span className="text-sky-400 underline underline-offset-4">
            IT JOBS FACTORY
          </span>
        </h2>

        <div className="flex justify-center items-center gap-4 mt-6 mb-8">
          <span className="text-2xl font-bold text-white">
            FUTURE-READY{" "}
            <span className="text-sky-400 underline">TECH CAREERS</span>
          </span>
        </div>

        <div className="max-w-6xl mx-auto bg-gradient-to-br from-cyan-700 via-sky-500 to-indigo-600 rounded-2xl p-6 sm:p-10">
          <p className="text-white mb-12 text-sm md:text-base max-w-4xl mx-auto">
            At IT JOBS FACTORY, we empower talent to succeed through hands-on
            learning, curated mentorship, and direct access to elite companies.
            Our vision is to make every student industry-ready and globally
            competitive.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              [
                <IconCertificate size={40} className="text-white" />,
                "Globally Recognized Tech Certifications",
              ],
              [
                <IconSchool size={40} className="text-white" />,
                "Live sessions with top industry mentors",
              ],
              [
                <IconCalendarDue size={40} className="text-white" />,
                "Extended placement support up to 12 months",
              ],
              [
                <IconBuildingBank size={40} className="text-white" />,
                "On-site industrial exposure programs",
              ],
              [
                <IconUsersGroup size={40} className="text-white" />,
                "1-on-1 mentorship from senior engineers",
              ],
              [
                <IconBooks size={40} className="text-white" />,
                "Comprehensive project-based curriculum",
              ],
            ].map(([icon, text], i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-3 text-white"
              >
                <div>{icon}</div>
                <p className="text-sm md:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATION SECTION */}
      <section className="bg-cyan-50 text-cyan-900 px-4 sm:px-6 py-20">
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
                "Mentorship from Real Engineers",
                "Learn directly from engineers working at top firms.",
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
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md">
                Explore Program
              </button>
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
