"use client";

import FAQAccordion from "@/components/AccordionUse";
import SuccessCarousel from "@/components/Carousel";

export default function AboutSection() {
  return (
    <>
      <section className="bg-cyan-950 pt-[160px] min-h-screen text-white px-6 py-20 flex items-center">
        <div className="max-w-4xl mx-auto bg-cyan-900/40 rounded-2xl p-8 md:p-12 shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Who We Are
          </h2>

          <p className="text-cyan-100 text-lg mb-6 leading-relaxed text-center">
            At <span className="text-white font-semibold">IT Jobs Factory</span>
            , we’re dedicated to bridging the gap between aspiring tech
            professionals and employers. With over a decade of experience, we
            offer immersive, job-focused training tailored to the demands of
            today’s IT industry.
          </p>

          <p className="text-cyan-100 text-lg mb-6 leading-relaxed text-center">
            Our programs empower fresh graduates and experienced professionals
            alike through hands-on learning in technologies such as{" "}
            <span className="text-white font-medium">
              Java, DevOps, and Cloud
            </span>
            . Every course includes real-world projects and 100% job assistance.
          </p>

          <p className="text-cyan-100 text-lg leading-relaxed text-center">
            Whether you're just starting out or upskilling for the future,{" "}
            <span className="text-white font-semibold">IT Jobs Factory</span> is
            your trusted partner in turning IT dreams into reality.
          </p>
        </div>
      </section>
      {/* STATS SECTION */}
      <section className="bg-cyan-50 text-cyan-800 px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          <span className="text-sky-500 underline underline-offset-4">
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
              <h3 className="text-3xl font-semibold text-cyan-800">{title}</h3>
              <p className="text-sm text-cyan-600">{desc}</p>
            </div>
          ))}
        </div>

        <button className="bg-cyan-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-cyan-700 transition">
          Download Career Report
        </button>
      </section>
      <FAQAccordion />
      <SuccessCarousel />
    </>
  );
}
