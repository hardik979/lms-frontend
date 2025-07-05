"use client";
import React, { useState } from "react";
import { CheckCircle, User, Phone, Calendar, BookOpen, X } from "lucide-react";

export default function MentorshipForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    batch: "",
    topic: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mentorshipTopics = [
    "Technical concepts",
    "Interviews",
    "Career Guidance",
    "Resume Building",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowNotification(true);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      batch: "",
      topic: "",
    });
  };

  const isFormValid =
    formData.name && formData.phone && formData.batch && formData.topic;

  return (
    <div className="min-h-screen bg-cyan-950 flex items-center justify-center p-4 relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top-2">
          <CheckCircle size={20} />
          <span className="font-medium">
            Our mentors will contact you shortly!
          </span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 hover:bg-green-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl shadow-2xl p-8 border border-cyan-700/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyan-800/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-600/50">
              <BookOpen size={28} className="text-cyan-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Mentorship Request
            </h2>
            <p className="text-cyan-100">
              Get personalized guidance from our expert mentors
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-3 text-cyan-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-cyan-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all bg-slate-800/50 text-white placeholder-cyan-300"
                  required
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-3 text-cyan-400"
                />
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-cyan-600/50 bg-slate-800/70 text-cyan-300 text-sm rounded-l-lg">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="flex-1 pl-3 pr-4 py-3 border border-cyan-600/50 rounded-r-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all bg-slate-800/50 text-white placeholder-cyan-300"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Batch Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Batch
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-3 text-cyan-400"
                />
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  placeholder="Enter your batch (e.g., 2024-A, Jan-2024)"
                  className="w-full pl-10 pr-4 py-3 border border-cyan-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all bg-slate-800/50 text-white placeholder-cyan-300"
                  required
                />
              </div>
            </div>

            {/* Mentorship Topic Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-200 mb-2">
                Mentorship Topic
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-cyan-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all bg-slate-800/50 text-white"
                required
              >
                <option value="" className="bg-slate-800 text-cyan-300">
                  Select a mentorship topic
                </option>
                {mentorshipTopics.map((topic) => (
                  <option
                    key={topic}
                    value={topic}
                    className="bg-slate-800 text-white"
                  >
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid && !isSubmitting
                  ? "bg-cyan-600 hover:bg-cyan-700 hover:shadow-lg transform hover:scale-[1.02]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Request Mentorship"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-cyan-200">
              Our mentors typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
