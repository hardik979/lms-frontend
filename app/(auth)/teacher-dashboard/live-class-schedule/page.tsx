"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Calendar, Video, ArrowDownRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function LiveClassSchedulerPage() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    meetLink: "",
    scheduledAt: "",
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data.courses || []);
    };
    fetchCourses();
  }, [getToken]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.courseId) {
      toast.error("❌ Please select a course");
      return;
    }

    setLoading(true);
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}/api/teacher/live-class`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      toast.success("✅ Live class scheduled successfully");
      setForm({
        title: "",
        description: "",
        courseId: "",
        meetLink: "",
        scheduledAt: "",
      });
    } else {
      toast.error("❌ Failed to schedule class");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6 rounded-2xl">
      <motion.div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Schedule Live Class
          </h1>
          <p className="text-cyan-200/80 text-lg">
            Enter details to schedule a session
            <ArrowDownRight className="w-5 h-5 inline text-cyan-200/80 ml-2" />
          </p>
        </div>

        <div className="space-y-4 bg-cyan-900/30 border border-cyan-700/50 rounded-2xl p-6">
          <div>
            <label className="block text-cyan-200 font-medium mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Class title"
              className="w-full bg-cyan-900/20 border border-cyan-600/50 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-cyan-200 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What's this class about?"
              className="w-full bg-cyan-900/20 border border-cyan-600/50 rounded-xl px-4 py-3 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-cyan-200 font-medium mb-1">
              Select Course
            </label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full bg-cyan-900/20 border border-cyan-600/50 rounded-xl px-4 py-3 text-white"
            >
              <option value="">-- Choose a course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-cyan-200 font-medium mb-1">
              Google Meet Link
            </label>
            <input
              name="meetLink"
              value={form.meetLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/xyz"
              className="w-full bg-cyan-900/20 border border-cyan-600/50 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="block text-cyan-200 font-medium mb-1">
              Scheduled At
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className="w-full bg-cyan-900/20 border border-cyan-600/50 rounded-xl px-4 py-3 text-white"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-xl w-full"
          >
            {loading ? "Scheduling..." : "Schedule Class"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
