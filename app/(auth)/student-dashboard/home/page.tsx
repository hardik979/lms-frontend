"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import CurriculumSection from "@/components/dataAnalyticCurriculum";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import LoadingPage from "@/components/Loader";

const Home = () => {
  const { getToken, isSignedIn } = useAuth();

  // Use both courseId and setCourseId from Zustand store
  const selectedCourseId = useSelectedCourseStore((s) => s.courseId);
  const setCourseId = useSelectedCourseStore((s) => s.setCourseId);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState<boolean | null>(
    null
  );

  // Set default course ID if none selected
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseId("683047f0007b2b71a9a1f4da"); // default fallback course
    }
  }, [selectedCourseId, setCourseId]);

  useEffect(() => {
    const fetchCourseAndUser = async () => {
      const token = await getToken();
      if (!token || !selectedCourseId) return;

      try {
        // Fetch course details
        const courseRes = await fetch(
          `http://localhost:5000/api/courses/${selectedCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courseData = await courseRes.json();
        setSelectedCourse(courseData.course);

        // Fetch user info
        const userRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (userData.purchasedCourses?.includes(selectedCourseId)) {
          setHasPurchasedCourse(true);
        } else {
          setHasPurchasedCourse(false);
        }
      } catch (err) {
        console.error("❌ Error loading course or user data", err);
      }
    };

    if (isSignedIn && selectedCourseId) {
      fetchCourseAndUser();
    }
  }, [getToken, isSignedIn, selectedCourseId]);

  if (!selectedCourse) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen py-4 md:px-10">
      {/* Conditional Banner */}
      {hasPurchasedCourse === false && (
        <section
          className="bg-cyan-950 text-white rounded-xl shadow-md p-6 md:p-8 mb-4 w-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-neutral-50">
              Complete your application for{" "}
              <span className="text-cyan-400">{selectedCourse.title}</span>
            </h2>
            <span className="mt-2 md:mt-0 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
              Submission Pending
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full mt-4">
            <div className="relative w-full h-1 bg-gray-200 rounded-full">
              <div className="absolute h-1 bg-cyan-400 rounded-full w-[5%]" />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-300 mt-2">
              <span className="w-[15%] text-left">
                Profile
                <br />
                Completion
              </span>
              <span className="w-[20%] text-center">
                Application
                <br />
                Verification
              </span>
              <span className="w-[20%] text-center">
                Reserve
                <br />a Seat
              </span>
              <span className="w-[20%] text-center">
                Payment
                <br />
                Completion
              </span>
              <span className="w-[15%] text-right">Onboarding</span>
            </div>
          </div>
        </section>
      )}

      {hasPurchasedCourse && (
        <section
          className="bg-cyan-950 text-white rounded-xl shadow-md p-6 md:p-8 mb-4 w-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2">
            🎉 You're All Set!
          </h2>
          <p className="text-neutral-300">
            You have already purchased <strong>{selectedCourse.title}</strong>.
            Start learning now!
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/learn">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-md transition">
                Go to Classroom
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Program Overview */}
      <section
        className="bg-cyan-950 rounded-xl shadow-md p-6 md:p-8 w-full"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-cyan-400 mb-2">
          {selectedCourse.title} by{" "}
          <span className="text-cyan-50">IT Jobs Factory</span>
        </h2>
        <ul className="list-disc list-inside text-neutral-300 text-sm md:text-base space-y-2 mb-6">
          <li>Curriculum re-engineered for the post ChatGPT era</li>
          <li>12-month part-time program with live online classes</li>
          <li>No prior coding experience required</li>
        </ul>

        {!hasPurchasedCourse && (
          <div className="flex justify-center">
            <Link href="/Onboarding">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-md transition">
                Continue Application
              </button>
            </Link>
          </div>
        )}

        <p className="text-sm text-cyan-500 mt-4 text-center">
          <CalendarCheck className="inline-block mr-2" />
          Next Cohort Starts Soon
        </p>
      </section>

      {/* Curriculum Component */}
      <CurriculumSection />

      {/* Certificate */}
      <section
        className="bg-cyan-950 rounded-xl w-full shadow-md p-6 md:p-10 my-4  flex flex-col md:flex-row items-center justify-between gap-8"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Get a Verified Certificate of Completion
          </h2>
          <ul className="list-none space-y-4 text-neutral-300 text-sm md:text-base">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-[3px]">
                <IconCircleCheckFilled />
              </span>
              Earn a certificate after successfully completing the course.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-[3px]">
                <IconCircleCheckFilled />
              </span>
              Perfect for LinkedIn, resumes, and job applications.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-[3px]">
                <IconCircleCheckFilled />
              </span>
              Demonstrates hands-on training and industry-ready skills.
            </li>
          </ul>
          <a href="/brochure" target="_blank" rel="noopener noreferrer">
            <button className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-5 py-2 rounded-md transition">
              Download Brochure
            </button>
          </a>
        </div>
        <div className="flex-shrink-0 max-w-sm w-full">
          <Image
            src="/certificate.png"
            alt="Course Completion Certificate"
            width={500}
            height={350}
            className="rounded-md border border-gray-300"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
