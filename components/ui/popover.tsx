"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Shield,
  CheckCircle,
  Loader2,
  Sparkles,
  Award,
} from "lucide-react";

const toast = {
  success: (message: string) => {
    console.log("✅ Success:", message);
  },
  error: (message: string) => {
    console.log("❌ Error:", message);
  },
};

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
    }, 3000); // Reduced to 3 seconds for demo
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
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateInputs()) return;
    setIsSubmitting(true);

    try {
      const formBody = new URLSearchParams();
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
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const formFieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center z-[999] p-4"
          style={{
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white text-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-800 transition-all duration-200 backdrop-blur-sm border border-gray-200/50"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={15} />
            </motion.button>

            {/* Left Panel - Visual/Branding */}
            <motion.div
              className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 p-8 flex-col justify-center relative overflow-hidden"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative z-10 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex items-center mb-4">
                    <Sparkles className="text-yellow-400 mr-3" size={32} />
                    <h2 className="text-3xl font-bold">Free Career Session</h2>
                  </div>
                  <p className="text-cyan-100 text-lg leading-relaxed">
                    Get personalized career guidance from industry experts
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  {[
                    { icon: Award, text: "Expert Career Counseling" },
                    { icon: BookOpen, text: "Training Program Overview" },
                    { icon: CheckCircle, text: "Certificate Guidance" },
                    { icon: Calendar, text: "Flexible Scheduling" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center text-cyan-50"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <item.icon className="mr-3 text-cyan-300" size={20} />
                      <span className="text-sm">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className="flex items-center text-cyan-100">
                    <Shield className="mr-2 text-green-300" size={16} />
                    <span className="text-sm font-medium">
                      100% Secure & Confidential
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div
              className="flex-1 p-6 lg:p-8 flex flex-col justify-center overflow-y-auto"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Mobile Header */}
              <div className="lg:hidden mb-6 text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Book Your Free Session
                  </h3>
                  <p className="text-gray-600">
                    Get expert career guidance today
                  </p>
                </motion.div>
              </div>

              {/* Desktop Header */}
              <motion.div
                className="hidden lg:block mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text ">
                  Book Your Free Session
                </h3>
                <p className="text-gray-600 text-lg">
                  Fill out the form below and we'll get back to you within 24
                  hours
                </p>
              </motion.div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email */}
                <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </motion.div>

                {/* Name and Graduation Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        name="graduationYear"
                        type="text"
                        placeholder="Graduation Year"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Education */}
                <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <div className="relative">
                    <GraduationCap
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="education"
                      type="text"
                      placeholder="Educational Qualification (e.g., B.Tech, MBA)"
                      value={formData.education}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Mobile Number (+91 XXXXXXXXXX)"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={formFieldVariants}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                  className="pt-4"
                >
                  <motion.div
                    onClick={handleSubmit}
                    className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-lg font-semibold rounded-xl py-4 transition-all duration-200 transform cursor-pointer ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-xl hover:shadow-cyan-500/25 active:scale-[0.98]"
                    }`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={20} />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Phone size={18} />
                        Request a Call Back
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <Shield className="mr-2" size={16} />
                  <span>
                    Your information is secure and will never be shared
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
