"use client";

import Image from "next/image";
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
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const formBody = new URLSearchParams();
      // Replace entry IDs below with your actual Google Form entry IDs
      formBody.append("entry.100053772", formData.email);
      formBody.append("entry.1786796031", formData.name);
      formBody.append("entry.2086034414", formData.graduationYear);
      formBody.append("entry.1038515024", formData.phone);
      formBody.append("entry.1825069237", formData.education);

      await fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeUhGeU1V3L_g0JdMyAhDE6LAhPq6chASH22JNLFetzayF9Bw/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody.toString(),
        }
      );

      toast.success("Session booked successfully!");
      setTimeout(() => setShow(false), 2000);
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="!mt-16 sm:!mt-4"
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm [font-family:var(--font-raleway)] flex items-center justify-center z-[999] p-2 sm:p-4">
        <div className="bg-white text-black w-full max-w-sm sm:max-w-md md:max-w-3xl max-h-[95vh] sm:max-h-[90vh] rounded-lg sm:rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
          {/* Close Button - Better positioned for mobile */}
          <button
            onClick={() => setShow(false)}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-xl font-bold transition-colors shadow-sm md:top-4 md:right-4"
          >
            ×
          </button>

          {/* Left Image - Hidden on very small screens, visible on sm+ */}
          <div className="hidden sm:block w-full md:w-1/2 h-32 sm:h-48 md:h-auto relative flex-shrink-0 overflow-hidden">
            <Image
              src="/code.jpg"
              alt="Internship Promo"
              fill // ✅ fill the parent container
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Right Form */}
          <div className="p-4 sm:p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-center relative overflow-y-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-cyan-800 leading-tight">
                Book a Free Session Now!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get career advice, training overview, and certificate guidance.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Name and Graduation Year Row */}
              <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  name="graduationYear"
                  type="text"
                  placeholder="Graduation Year"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Education */}
              <div>
                <input
                  name="education"
                  type="text"
                  placeholder="Educational Qualification"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm sm:text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white text-base sm:text-lg font-semibold rounded-md py-3 sm:py-3.5 transition-all duration-200 transform ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Request a Call"
                  )}
                </button>
              </div>
            </form>

            {/* Trust indicators for mobile */}
            <div className="mt-4 sm:hidden">
              <p className="text-xs text-gray-500 text-center">
                🔒 Your information is secure and confidential
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
