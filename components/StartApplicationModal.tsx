"use client";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartApplicationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="relative bg-white rounded-lg w-full max-w-md p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center text-cyan-900">
          Start Your Application
        </h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none transition"
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none transition"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white hover:bg-cyan-700 py-3 rounded-md font-semibold transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
