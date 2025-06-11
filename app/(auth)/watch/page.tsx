"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const videoId = searchParams.get("video");
  const courseId = searchParams.get("course");
  const chapterIndex = Number(searchParams.get("chapter"));
  const videoIndex = Number(searchParams.get("index"));

  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [subscription, setSubscription] = useState("free");
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [resumeTime, setResumeTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (!token || !courseId) return;

      try {
        const userRes = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setSubscription(userData.subscription);
        setPurchasedCourses(userData.purchasedCourses || []);

        const isFreeLesson = chapterIndex === 0 && videoIndex === 0;
        const hasAccess =
          userData.subscription === "subscribed" ||
          userData.purchasedCourses.includes(courseId);

        if (!isFreeLesson && !hasAccess) {
          router.push("/subscribe");
          return;
        }

        const courseRes = await fetch(
          `http://localhost:5000/api/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courseData = await courseRes.json();
        setCourse(courseData.course);

        // Fetch resume time
        const progressRes = await fetch(
          `http://localhost:5000/api/progress/chapter-progress?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = await progressRes.json();
        const entry = progressData.completedVideos?.find(
          (v: any) => v.videoId === videoId
        );
        if (entry?.lastWatchedTime) {
          setResumeTime(entry.lastWatchedTime);
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, videoId, chapterIndex, videoIndex, getToken]);

  const goTo = (ci: number, vi: number, vid: string) => {
    router.push(
      `/watch?video=${vid}&course=${courseId}&chapter=${ci}&index=${vi}`
    );
  };

  const isFirstLesson = chapterIndex === 0 && videoIndex === 0;
  const isLastLesson =
    course &&
    chapterIndex === course.chapters.length - 1 &&
    videoIndex === course.chapters[chapterIndex].videos.length - 1;

  const goToNext = () => {
    const currentChapter = course.chapters[chapterIndex];
    if (videoIndex + 1 < currentChapter.videos.length) {
      goTo(
        chapterIndex,
        videoIndex + 1,
        currentChapter.videos[videoIndex + 1].cloudinaryId
      );
    } else if (chapterIndex + 1 < course.chapters.length) {
      goTo(
        chapterIndex + 1,
        0,
        course.chapters[chapterIndex + 1].videos[0].cloudinaryId
      );
    }
  };

  const goToPrevious = () => {
    if (videoIndex > 0) {
      goTo(
        chapterIndex,
        videoIndex - 1,
        course.chapters[chapterIndex].videos[videoIndex - 1].cloudinaryId
      );
    } else if (chapterIndex > 0) {
      const prevChapter = course.chapters[chapterIndex - 1];
      const lastVideo = prevChapter.videos[prevChapter.videos.length - 1];
      goTo(
        chapterIndex - 1,
        prevChapter.videos.length - 1,
        lastVideo.cloudinaryId
      );
    }
  };

  const sendProgressUpdate = async (watchedPercent: number) => {
    const token = await getToken();
    if (!token || !videoId || !courseId || !videoRef.current) return;

    const lastWatchedTime = Math.floor(videoRef.current.currentTime);

    await fetch("http://localhost:5000/api/progress/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        videoId,
        watchedPercent,
        lastWatchedTime,
      }),
    });
  };

  const handleVideoPause = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;
    if (percent >= 5) sendProgressUpdate(Math.min(100, percent));
  };

  const handleVideoEnd = () => sendProgressUpdate(100);

  const handleResume = () => {
    if (videoRef.current && resumeTime) {
      videoRef.current.currentTime = resumeTime;
      setResumeTime(null); // hide resume button
    }
  };

  if (!videoId || loading || !course) return <LoadingPage />;
  const currentVideo = course.chapters[chapterIndex].videos[videoIndex];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b shadow-sm bg-cyan-950">
        <Link
          href={`/student-dashboard/course?id=${courseId}&t=${Date.now()}`}
          className="text-sm text-white font-medium"
        >
          ← Back
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="bg-cyan-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1">
            <span className="bg-cyan-800 rounded-md px-2 py-1">Lesson</span>
            {currentVideo?.title || "Loading..."} <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-cyan-900 text-white border border-cyan-800 shadow-lg max-h-[300px] overflow-y-auto w-[280px]">
            {course.chapters.map((ch: any, ci: number) =>
              ch.videos.map((vid: any, vi: number) => (
                <DropdownMenuItem
                  key={`${ci}-${vi}`}
                  onClick={() => goTo(ci, vi, vid.cloudinaryId)}
                >
                  {vid.title}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-6" />
      </div>

      <div
        className="flex-1 flex flex-col justify-center items-center bg-black relative"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <video
          controls
          ref={videoRef}
          onPause={handleVideoPause}
          onEnded={handleVideoEnd}
          className="w-full h-full max-w-6xl max-h-[80vh] object-contain"
          src={`https://res.cloudinary.com/doliynoks/video/upload/${videoId}.mp4`}
        />
        {resumeTime && (
          <div className="absolute bottom-[4.5rem] left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={handleResume}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200"
            >
              Continue Watching
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between p-4 border-t bg-cyan-950">
        {!isFirstLesson ? (
          <button
            onClick={goToPrevious}
            className="text-sm text-white bg-cyan-700 px-4 py-2 rounded-md hover:bg-cyan-800 transition"
          >
            ← Previous Lesson
          </button>
        ) : (
          <div />
        )}

        {!isLastLesson && (
          <button
            onClick={goToNext}
            className="text-sm text-white bg-cyan-700 px-4 py-2 rounded-md hover:bg-cyan-800 transition"
          >
            Next Lesson →
          </button>
        )}
      </div>
    </div>
  );
}
