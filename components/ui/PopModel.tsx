"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function PopupModal() {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    graduationYear: "",
    phone: "",
    education: "",
    college: "",
    city: "",
    program: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Session booked successfully!");
        setTimeout(() => setShow(false), 2000);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white text-black max-w-6xl w-full h-[700px] rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row relative">
          {/* Left Image */}
          <div className="md:w-1/2 h-64 md:h-full">
            <img
              src="/code.jpg"
              alt="Internship Promo"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right Form */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center h-full relative overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 z-10 text-xl font-bold text-gray-500 hover:text-red-500"
            >
              &times;
            </button>

            <h3 className="text-4xl font-bold mb-2 text-cyan-800">
              Book a Live Demo Session
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get career advice, training overview, and certificate guidance.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Full Width */}
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded text-sm"
              />
              {/* Full Name + Grad Year */}
              <div className="flex gap-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-1/2 border px-4 py-2 rounded text-sm"
                />
                <input
                  name="graduationYear"
                  type="text"
                  placeholder="Graduation Year"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                  className="w-1/2 border px-4 py-2 rounded text-sm"
                />
              </div>

              {/* Job Title + Program */}
              <div className="flex gap-4">
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-1/2 border px-4 py-2 rounded text-sm bg-white"
                >
                  <option value="">Job Title</option>
                  <option value="B.Tech CSE">B.Tech CSE</option>
                  <option value="BSc CS">BSc CS</option>
                  <option value="Diploma CS">Diploma CS</option>
                  <option value="Working Professional">
                    Working Professional
                  </option>
                </select>

                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  className="w-1/2 border px-4 py-2 rounded text-sm bg-white"
                >
                  <option value="">Select Program</option>
                  <option value="Full Stack Internship">
                    Full Stack Internship
                  </option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps + Cloud">DevOps + Cloud</option>
                  <option value="Frontend Bootcamp">Frontend Bootcamp</option>
                </select>
              </div>
              {/* Phone Number */}
              <input
                name="phone"
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded text-sm"
              />
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold rounded-md py-3 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Request a Call"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
