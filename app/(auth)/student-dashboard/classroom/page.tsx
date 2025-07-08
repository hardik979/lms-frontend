"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { API_BASE_URL } from "@/lib/api";
import { CalendarDays, Clock, Video } from "lucide-react";
import moment from "moment";

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  meetLink: string;
  scheduledAt: string;
  courseId: string;
}

export default function LiveClassesSection() {
  const courseId = useSelectedCourseStore((s) => s.courseId);
  const { getToken } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const token = await getToken();
        if (!token || !courseId) return;

        const res = await fetch(
          `${API_BASE_URL}/api/teacher/live-class?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setClasses(data.liveClasses || []);
      } catch (err) {
        console.error("Failed to fetch live classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000); // update every 30s

    return () => clearInterval(interval);
  }, [getToken, courseId]);

  if (loading) {
    return <p className="text-cyan-300 text-center">Loading live classes...</p>;
  }

  if (classes.length === 0) {
    return (
      <p className="text-cyan-400 text-center">
        No live classes scheduled yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6">
      {classes.map((cls) => {
        const scheduled = new Date(cls.scheduledAt);
        const diffInMinutes = (scheduled.getTime() - now.getTime()) / 60000;
        const showJoinNow = diffInMinutes <= 5 && diffInMinutes >= -30;

        return (
          <div
            key={cls._id}
            className="bg-cyan-950/80 border border-cyan-800/50 rounded-xl p-6 shadow-md flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 text-cyan-300 text-sm">
              <CalendarDays className="w-4 h-4" />
              {moment(cls.scheduledAt).format("MMMM Do YYYY, h:mm A")}
            </div>
            <h3 className="text-xl font-semibold text-white">{cls.title}</h3>
            <p className="text-cyan-100">{cls.description}</p>

            {showJoinNow ? (
              <a
                href={cls.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md mt-3 inline-flex items-center gap-2 w-max"
              >
                <Video className="w-4 h-4" />
                Join Now
              </a>
            ) : (
              <div className="text-cyan-400 mt-2 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Available at {moment(cls.scheduledAt).format("h:mm A")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
