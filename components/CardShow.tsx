"use client";

import {
  IconVideo,
  IconAlarm,
  IconArchive,
  IconHelpCircle,
} from "@tabler/icons-react";

export default function FlexibilitySection() {
  const faqs = [
    {
      icon: <IconVideo size={40} className="text-cyan-700" />,
      title: "What if I miss a class?",
      desc: "In case you miss a class, you can watch the recording later. If you miss multiple classes, you can switch to another Cohort.",
    },
    {
      icon: <IconAlarm size={40} className="text-cyan-700" />,
      title: "What if I can't manage job or schedule with class timings?",
      desc: "You can complete the course at your own pace through lecture recordings and learning materials.",
    },
    {
      icon: <IconArchive size={40} className="text-cyan-700" />,
      title: "Do I get lifetime access?",
      desc: "You will have lifetime access to all course content, recordings, materials, assessments, and projects.",
    },
    {
      icon: <IconHelpCircle size={40} className="text-cyan-700" />,
      title: "How will I resolve my doubts?",
      desc: "Get your doubts resolved by connecting with subject matter experts over text or video calls.",
    },
  ];

  return (
    <section className="bg-cyan-50 text-cyan-900 px-6 py-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-cyan-800">
          A Flexible Program Created{" "}
          <span className="text-sky-500 underline underline-offset-4">
            Just For You!
          </span>
        </h2>
      </div>

      {/* FAQ Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-6 border border-cyan-100 rounded-xl shadow-sm bg-white"
          >
            <div>{item.icon}</div>
            <div>
              <h4 className="font-semibold text-cyan-900 mb-1">{item.title}</h4>
              <p className="text-sm text-cyan-700">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md text-sm">
          Download Brochure
        </button>
        <button className="border border-cyan-600 text-cyan-600 px-5 py-2 rounded-md text-sm hover:bg-cyan-100">
          Download Placement Report
        </button>
      </div>
    </section>
  );
}
