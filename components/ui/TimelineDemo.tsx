"use client";

import { Timeline } from "@/components/ui/timeline";
import {
  IconCertificate,
  IconBriefcase,
  IconChecklist,
  IconDeviceLaptop,
  IconUsers,
  IconMessageChatbot,
  IconFileAnalytics,
  IconBuildingBank,
} from "@tabler/icons-react";

export function AlmaXTimeline() {
  const data = [
    {
      title: "1. Eligibility Criteria",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <IconCertificate
                  size={36}
                  className="mx-auto text-yellow-400 mb-2"
                />
              ),
              title: "Minimum Education",
              desc: "Open to graduates or final-year students from any stream.",
            },
            {
              icon: (
                <IconBriefcase
                  size={36}
                  className="mx-auto text-orange-400 mb-2"
                />
              ),
              title: "Career Switch Friendly",
              desc: "Ideal for job switchers and early-career professionals.",
            },
            {
              icon: (
                <IconChecklist
                  size={36}
                  className="mx-auto text-sky-400 mb-2"
                />
              ),
              title: "Basic Aptitude Check",
              desc: "Qualify through an initial screening or aptitude test.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md text-center text-black shadow-sm"
            >
              {icon}
              <h4 className="font-semibold">{title}</h4>
              <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "2. Program Curriculum",
      content: (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <IconDeviceLaptop
                  size={36}
                  className="mx-auto text-green-500 mb-2"
                />
              ),
              title: "Hands-on Projects",
              desc: "Build live, real-world applications with mentorship.",
            },
            {
              icon: (
                <IconBriefcase
                  size={36}
                  className="mx-auto text-purple-500 mb-2"
                />
              ),
              title: "Interview Simulations",
              desc: "Practice mock interviews with expert guidance.",
            },
            {
              icon: (
                <IconChecklist
                  size={36}
                  className="mx-auto text-pink-500 mb-2"
                />
              ),
              title: "Performance Tracking",
              desc: "Regular evaluations to monitor skill growth.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md text-center text-black shadow-sm"
            >
              {icon}
              <h4 className="font-semibold">{title}</h4>
              <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "3. Career Support",
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <IconUsers size={36} className="mx-auto text-sky-400 mb-2" />
              ),
              title: "1-on-1 Mentorship",
              desc: "Personalized guidance from working IT professionals.",
            },
            {
              icon: (
                <IconMessageChatbot
                  size={36}
                  className="mx-auto text-cyan-400 mb-2"
                />
              ),
              title: "Profile Optimization",
              desc: "Get expert feedback on your resume and LinkedIn.",
            },
            {
              icon: (
                <IconFileAnalytics
                  size={36}
                  className="mx-auto text-blue-400 mb-2"
                />
              ),
              title: "Skill Readiness Reports",
              desc: "Receive weekly reports on your job readiness level.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md text-center text-black shadow-sm"
            >
              {icon}
              <h4 className="font-semibold">{title}</h4>
              <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "4. Job Placement Support",
      content: (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <IconBuildingBank
                  size={36}
                  className="mx-auto text-yellow-400 mb-2"
                />
              ),
              title: "Partner Network Access",
              desc: "Get exclusive referrals to 1200+ hiring partners.",
            },
            {
              icon: (
                <IconBriefcase
                  size={36}
                  className="mx-auto text-cyan-500 mb-2"
                />
              ),
              title: "Full-Time Job Support",
              desc: "Ongoing assistance until you land your dream job.",
            },
            {
              icon: (
                <IconChecklist
                  size={36}
                  className="mx-auto text-green-500 mb-2"
                />
              ),
              title: "Unlimited Interviews",
              desc: "Appear for interviews until you get placed successfully.",
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md text-center text-black shadow-sm"
            >
              {icon}
              <h4 className="font-semibold">{title}</h4>
              <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip bg-cyan-950 text-white py-24 px-6">
      <Timeline data={data} />
    </div>
  );
}
