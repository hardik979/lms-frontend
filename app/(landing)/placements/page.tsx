"use client";

import SuccessCarousel from "@/components/Carousel";
import Marquee from "@/components/Marquee";
import { AlmaXTimeline } from "@/components/ui/TimelineDemo";

export default function PlacementsSection() {
  return (
    <>
      <section className="bg-cyan-950 text-white  px-6 py-20 min-h-screen pt-[160px]">
        <div className="max-w-6xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Proven Placement Success
          </h2>
          <p className="text-cyan-100 text-lg max-w-3xl mx-auto mb-12">
            Our placement team works tirelessly to connect our graduates with
            top tech employers. With 100% placement support, live project
            experience, and in-demand tech training, our students land roles at
            companies that value real skills.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-cyan-900/40 p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-sky-400 mb-2">100%</h3>
              <p className="text-cyan-100">Placement Assistance</p>
            </div>
            <div className="bg-cyan-900/40 p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-sky-400 mb-2">150+</h3>
              <p className="text-cyan-100">Hiring Partners</p>
            </div>
            <div className="bg-cyan-900/40 p-6 rounded-xl shadow-lg">
              <h3 className="text-3xl font-bold text-sky-400 mb-2">₹12 LPA</h3>
              <p className="text-cyan-100">Highest Package Offered</p>
            </div>
          </div>

          {/* Quote/Testimonial */}
          <div className="bg-cyan-900/30 p-8 rounded-xl shadow-inner max-w-4xl mx-auto mb-16">
            <p className="text-xl font-medium italic text-cyan-100">
              “Thanks to IT Jobs Factory’s project-based training and
              mentorship, I secured my first developer role within weeks of
              graduation.”
            </p>
            <p className="mt-4 text-cyan-400 font-semibold">
              — Shalini Rajpal, Citius Tech
            </p>
          </div>

          {/* CTA */}
          <a
            href="/success-stories"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            View Success Stories
          </a>
        </div>
      </section>
      <SuccessCarousel />
      <AlmaXTimeline />
      <Marquee />
    </>
  );
}
