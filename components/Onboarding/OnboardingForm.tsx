"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepBasicInfo from "./StepBasicInfo";
import StepEducation from "./StepEducation";
import StepWork from "./StepWork";
import StepGoals from "./StepGoals";
import StepPayment from "./StepPayment";

const steps = ["Basic Info", "Education", "Work Exp.", "Goals", "Payment"];

export default function OnboardingForm() {
  const [step, setStep] = useState(0);

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasicInfo next={next} />;
      case 1:
        return <StepEducation next={next} prev={prev} />;
      case 2:
        return <StepWork next={next} prev={prev} />;
      case 3:
        return <StepGoals next={next} prev={prev} />;
      case 4:
        return <StepPayment prev={prev} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl min-h-[500px] bg-white rounded-xl shadow-xl p-6 md:p-8 transition-all duration-300 overflow-hidden">
      {/* Stepper Tabs */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`text-sm font-medium transition-all duration-200 ${
                step === i
                  ? "text-cyan-600 border-b-2 border-cyan-600 pb-1"
                  : step > i
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Animated Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
