"use client";

import SuccessCarousel from "@/components/Carousel";
import { useState } from "react";

export default function HireFromUsSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission logic (e.g., send to API)
    console.log("Form submitted", form);
  };

  return (
    <>
      <section className="bg-cyan-950 pt-[200px] text-white px-6 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          {/* Left: Value Prop */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Skip the Hunt – Meet Ready to Hire Tech Talent
            </h2>
            <p className="text-cyan-100 text-lg leading-relaxed mb-4">
              Join 200+ companies who have hired skilled developers, DevOps
              engineers, and cloud professionals from IT Jobs Factory. Our
              students are trained on real-world projects and are ready to make
              an impact from day one.
            </p>
            <p className="text-cyan-100 text-lg leading-relaxed mb-4">
              We offer a pool of pre-vetted, job-ready candidates with expertise
              in Java, Full Stack, DevOps, and Cloud technologies. Get in touch
              to find your next hire today.
            </p>
            <p className="text-cyan-100 text-lg leading-relaxed">
              Fill out the form and our team will reach out to schedule a
              personalized hiring consultation.
            </p>
          </div>

          {/* Right: Contact Form */}
          <div className="flex-1 bg-cyan-900/40 rounded-2xl p-6 md:p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-cyan-800 text-white placeholder-cyan-300 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-cyan-800 text-white placeholder-cyan-300 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="hr@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-cyan-800 text-white placeholder-cyan-300 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Tech Corp Pvt. Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 rounded-lg bg-cyan-800 text-white placeholder-cyan-300 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="We are looking to hire 3 full stack developers..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
      <SuccessCarousel />
    </>
  );
}
