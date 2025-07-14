"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { API_BASE_URL } from "@/lib/api";
import { CalendarDays, Clock, Video, AlertCircle, Users } from "lucide-react";
import moment from "moment";

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  meetLink: string;
  scheduledAt: string;
  courseId: string;
  allowedStudentEmails?: string[];
}

export default function LiveClassesSection() {
  const courseId = useSelectedCourseStore((s) => s.courseId);
  const { getToken } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        if (!token || !courseId) {
          setError("Authentication required or no course selected");
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/teacher/live-class?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setClasses(data.liveClasses || []);
      } catch (err) {
        console.error("Failed to fetch live classes:", err);
        setError("Failed to load live classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();

    // Update current time every 30 seconds
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [getToken, courseId]);

  const getClassStatus = (scheduledAt: string) => {
    const scheduled = new Date(scheduledAt);
    const diffInMinutes = (scheduled.getTime() - now.getTime()) / 60000;

    if (diffInMinutes <= 5 && diffInMinutes >= -30) {
      return { status: "live", canJoin: true };
    } else if (diffInMinutes < -30) {
      return { status: "ended", canJoin: false };
    } else {
      return { status: "upcoming", canJoin: false };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return (
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            Live
          </span>
        );
      case "ended":
        return (
          <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Ended
          </span>
        );
      default:
        return (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Upcoming
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        <p className="text-cyan-300 ml-3">Loading live classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/80 border border-red-800/50 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-300">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-cyan-950/80 border border-cyan-800/50 rounded-xl p-8 text-center">
        <Video className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
        <p className="text-cyan-400 text-lg">No live classes scheduled yet.</p>
        <p className="text-cyan-500 text-sm mt-2">
          Check back later or contact your teacher for updates.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {classes.map((cls) => {
        const { status, canJoin } = getClassStatus(cls.scheduledAt);
        const isUpcoming = status === "upcoming";
        const timeUntilClass = moment(cls.scheduledAt).fromNow();

        return (
          <div
            key={cls._id}
            className={`border rounded-xl p-6 shadow-md flex flex-col gap-4 transition-all duration-300 ${
              canJoin
                ? "bg-green-950/80 border-green-800/50 ring-2 ring-green-500/30"
                : "bg-cyan-950/80 border-cyan-800/50 hover:border-cyan-700/70"
            }`}
          >
            {/* Header with date and status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 text-sm">
                <CalendarDays className="w-4 h-4" />
                {moment(cls.scheduledAt).format("MMMM Do YYYY, h:mm A")}
              </div>
              {getStatusBadge(status)}
            </div>

            {/* Title and description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {cls.title}
              </h3>
              <p className="text-cyan-100 leading-relaxed">{cls.description}</p>
            </div>

            {/* Action button or status */}
            <div className="flex items-center justify-between mt-2">
              {canJoin ? (
                <a
                  href={cls.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md font-medium inline-flex items-center gap-2 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Video className="w-4 h-4" />
                  Join Now
                </a>
              ) : (
                <div className="text-cyan-400 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isUpcoming
                    ? `Starting ${timeUntilClass}`
                    : `Class ended ${timeUntilClass}`}
                </div>
              )}

              {/* Time remaining for upcoming classes */}
              {isUpcoming && (
                <div className="text-cyan-500 text-xs">
                  {moment(cls.scheduledAt).format("h:mm A")}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
