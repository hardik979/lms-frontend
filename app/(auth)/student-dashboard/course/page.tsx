"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";
import { LockKeyhole, PlayIcon } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelectedCourseStore } from "@/store/useCourseStore";

export default function CourseClientPage() {
  const courseId = useSelectedCourseStore((s) => s.courseId);

  const { getToken } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState("free");
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Get course
        const courseRes = await fetch(
          `http://localhost:5000/api/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courseData = await courseRes.json();
        setCourse(courseData.course);

        // Get user info
        const userRes = await fetch(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setSubscription(userData.subscription);
        setPurchasedCourses(userData.purchasedCourses || []);

        // Get video progress
        const progressRes = await fetch(
          `http://localhost:5000/api/progress/chapter-progress?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = await progressRes.json();

        const progressMap: Record<string, number> = {};
        progressData.completedVideos?.forEach((entry: any) => {
          progressMap[entry.videoId] = entry.progress || 0;
        });
        setVideoProgress(progressMap);
      } catch (err) {
        console.error("❌ Failed to load course or progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, getToken]);

  if (loading) return <LoadingPage />;
  if (!course) return <div className="p-10 text-red-600">Course not found</div>;
  const allVideos = course.chapters.flatMap((ch: any) => ch.videos);
  const totalVideos = allVideos.length;

  const totalWatchedPercent = allVideos.reduce((sum: number, video: any) => {
    return sum + (videoProgress[video.cloudinaryId] || 0);
  }, 0);

  const overallProgress =
    totalVideos > 0 ? Math.round(totalWatchedPercent / totalVideos) : 0;
  const hasFullAccess =
    subscription === "subscribed" || purchasedCourses.includes(courseId!);

  return (
    <div className="max-w-full mx-auto py-5 px-4">
      {/* Top Row: Two Boxes */}
      <div className="flex flex-col md:flex-row gap-6  mb-6">
        <div
          className="flex-1 bg-cyan-950  shadow-md rounded-lg p-6"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Box 1 - Overview */}
          <h2 className="text-2xl text-white font-semibold mb-2">
            {course.title}
          </h2>
          <p className="text-sm text-neutral-200">6 months • 12 chapters</p>
          <p className="mt-2 text-white">{course.description}</p>
        </div>
        <div
          className="flex-1 bg-cyan-950 shadow-md rounded-lg p-6 flex flex-col items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Box 2 - Progress Circle */}
          <div className="w-28 h-28">
            <CircularProgressbar
              value={overallProgress}
              text={`${overallProgress}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#22d3ee", // Tailwind's cyan-400
                textColor: "#ffffff",
                trailColor: "#334155", // Tailwind slate-800
              })}
            />
          </div>

          <p className="mt-3 text-md text-neutral-200">Completed</p>
        </div>
      </div>

      {/* Bottom Row: Three Boxes */}

      {course.chapters.map((chapter: any, ci: number) => {
        const totalVideos = chapter.videos.length;
        const totalProgress = chapter.videos.reduce((sum: number, v: any) => {
          return sum + (videoProgress[v.cloudinaryId] || 0);
        }, 0);
        const averageProgress =
          totalVideos > 0 ? Math.round(totalProgress / totalVideos) : 0;

        return (
          <div
            key={ci}
            className="mb-8 bg-cyan-950 rounded-lg p-6 shadow-md"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            <div className="mb-3">
              <span className="text-sm text-cyan-200 font-medium uppercase block mb-1">
                Chapter {ci + 1}
              </span>

              <h3 className="text-xl font-semibold text-white">
                {chapter.title}
              </h3>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-cyan-100 mb-1">
                <span>Total lectures: {totalVideos}</span>
                <span>{averageProgress}%</span>
              </div>
              <div className="h-2 w-full bg-cyan-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {chapter.videos.map((video: any, vi: number) => {
                const isFree = ci === 0 && vi === 0;
                const isUnlocked = isFree || hasFullAccess;
                const watchedPercent = videoProgress[video.cloudinaryId] || 0;

                return (
                  <div
                    key={vi}
                    className={`p-4 rounded-md flex justify-between items-center ${
                      isUnlocked
                        ? "bg-cyan-50 text-black"
                        : "bg-cyan-800 text-cyan-200 opacity-60"
                    }`}
                    style={{
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  >
                    <span className="font-medium">
                      {video.title}

                      {watchedPercent >= 90 && (
                        <span className="text-green-600 ml-2 text-sm">✅</span>
                      )}
                    </span>

                    {isUnlocked ? (
                      <a
                        href={`/watch?video=${video.cloudinaryId}&course=${course._id}&chapter=${ci}&index=${vi}`}
                        className="text-sm font-semibold text-cyan-600 hover:text-cyan-800"
                      >
                        <PlayIcon />
                      </a>
                    ) : (
                      <span>
                        <LockKeyhole className="w-5 h-5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {hasFullAccess && (
              <div
                className="mt-4 p-4 rounded-md flex justify-center items-center bg-cyan-50 text-black"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              >
                <h1 className="text-lg font-semibold">Start The Test</h1>
              </div>
            )}

            {!hasFullAccess && (
              <div
                className="mt-4 p-4 rounded-md flex justify-center items-center bg-cyan-800 text-cyan-200 opacity-60"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              >
                <h1 className="text-lg font-semibold">
                  Start The Test{" "}
                  <span>
                    <LockKeyhole className="ml-2 mb-1  w-4 h-4 inline-block" />
                  </span>
                </h1>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
