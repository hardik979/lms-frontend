"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  UserCheck,
  Mail,
  Settings,
  ChevronDown,
  TrendingUp,
  Award,
  Clock,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    currentRole: string;
    newRole: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
    currentRole: "",
    newRole: "",
  });

  useEffect(() => {
    const loadAdminData = async () => {
      const token = await getToken();
      try {
        const [summaryRes, usersRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/api/admin/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSummary(await summaryRes.json());
        setUsers((await usersRes.json()).users);
        setCourses((await coursesRes.json()).courses);
      } catch (err) {
        console.error("Admin load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [getToken]);

  const handleRoleChangeRequest = (userId: string, newRole: string) => {
    const user = users.find((u) => u._id === userId);
    if (user && user.role !== newRole) {
      setConfirmationModal({
        isOpen: true,
        userId,
        userName: user.name || user.email,
        currentRole: user.role,
        newRole,
      });
    }
  };

  const confirmRoleChange = async () => {
    const token = await getToken();
    const { userId, newRole } = confirmationModal;

    setUpdatingUserId(userId);
    setConfirmationModal({ ...confirmationModal, isOpen: false });

    try {
      await fetch(`${API_BASE_URL}/api/admin/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole }),
      });

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const cancelRoleChange = () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-cyan-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cyan-200 text-lg font-medium">
            Loading dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-cyan-900 to-slate-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-cyan-950/70 backdrop-blur-xl border-b border-cyan-800/40 sticky top-0 z-40 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <Settings className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-cyan-400 text-sm flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Manage your platform with ease</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 text-cyan-300 text-sm"
              >
                <Clock className="w-4 h-4 inline mr-2" />
                {new Date().toLocaleDateString()}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Summary Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
        >
          <SummaryCard
            title="Total Users"
            value={summary.totalUsers}
            icon={Users}
            color="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <SummaryCard
            title="Students"
            value={summary.totalStudents}
            icon={GraduationCap}
            color="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <SummaryCard
            title="Teachers"
            value={summary.totalTeachers}
            icon={Award}
            color="from-purple-500 to-violet-500"
            delay={0.3}
          />
          <SummaryCard
            title="Courses"
            value={summary.totalCourses}
            icon={BookOpen}
            color="from-orange-500 to-red-500"
            delay={0.4}
          />
          <SummaryCard
            title="Active Students Today"
            value={summary.activeStudentsToday}
            icon={Activity}
            color="from-pink-500 to-rose-500"
            delay={0.5}
          />
        </motion.div>

        {/* Users Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-100">All Users</h2>
              <p className="text-cyan-400 text-sm">
                Manage user roles and permissions
              </p>
            </div>
          </div>

          <div className="bg-cyan-950/40 backdrop-blur-xl rounded-3xl border border-cyan-800/40 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60">
                  <tr>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Name
                    </th>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Email
                    </th>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Role
                    </th>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-t border-cyan-800/30 hover:bg-cyan-900/30 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            {user.imageUrl ? (
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={user.imageUrl}
                                alt={user.name || "User"}
                                className="w-12 h-12 rounded-full object-cover shadow-lg"
                              />
                            ) : (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <span className="text-white text-lg font-bold">
                                  {user.name?.charAt(0) || "U"}
                                </span>
                              </motion.div>
                            )}

                            <div>
                              <span className="text-cyan-100 font-semibold text-lg">
                                {user.name || "N/A"}
                              </span>
                              <div className="text-cyan-400 text-sm">
                                User ID: {user._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-cyan-400" />
                            <span className="text-cyan-200 text-lg">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                              user.role === "admin"
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                                : user.role === "teacher"
                                ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                                : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="relative">
                            <select
                              value={user.role}
                              disabled={updatingUserId === user._id}
                              onChange={(e) =>
                                handleRoleChangeRequest(
                                  user._id,
                                  e.target.value
                                )
                              }
                              className="appearance-none bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-700/60 text-cyan-200 rounded-xl px-6 py-3 pr-12 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium shadow-lg backdrop-blur-sm"
                            >
                              <option value="student">Student</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                            {updatingUserId === user._id && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                              />
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-cyan-100">All Courses</h2>
              <p className="text-cyan-400 text-sm">
                Overview of all available courses
              </p>
            </div>
          </div>

          <div className="bg-cyan-950/40 backdrop-blur-xl rounded-3xl border border-cyan-800/40 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60">
                  <tr>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Title
                    </th>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Description
                    </th>
                    <th className="px-8 py-6 text-left text-cyan-200 font-semibold text-lg">
                      Chapters
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {courses.map((course, index) => (
                      <motion.tr
                        key={course._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-t border-cyan-800/30 hover:bg-cyan-900/30 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                            >
                              <BookOpen className="w-7 h-7 text-white" />
                            </motion.div>
                            <div>
                              <span className="text-cyan-100 font-semibold text-lg">
                                {course.title}
                              </span>
                              <div className="text-cyan-400 text-sm">
                                Course ID: {course._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-cyan-200 max-w-md text-lg leading-relaxed">
                            {course.description}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-lg font-bold shadow-lg">
                              {course.chapterCount}
                            </span>
                            <span className="text-cyan-300 font-medium">
                              chapters
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmationModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-gradient-to-br from-cyan-950 to-slate-900 rounded-3xl border border-cyan-800/50 p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cyan-100">
                    Confirm Role Change
                  </h3>
                  <p className="text-cyan-400 text-sm">
                    This action will update user permissions
                  </p>
                </div>
              </div>

              <div className="mb-8 p-4 bg-cyan-900/30 rounded-xl border border-cyan-800/30">
                <p className="text-cyan-200 text-lg mb-2">
                  Are you sure you want to change{" "}
                  <span className="font-bold text-cyan-100">
                    {confirmationModal.userName}
                  </span>
                  's role?
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-cyan-400">From:</span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      confirmationModal.currentRole === "admin"
                        ? "bg-red-500/20 text-red-300"
                        : confirmationModal.currentRole === "teacher"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {confirmationModal.currentRole}
                  </span>
                  <span className="text-cyan-400">To:</span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      confirmationModal.newRole === "admin"
                        ? "bg-red-500/20 text-red-300"
                        : confirmationModal.newRole === "teacher"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {confirmationModal.newRole}
                  </span>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelRoleChange}
                  className="flex-1 px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmRoleChange}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Check className="w-5 h-5" />
                  <span>Confirm</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative group cursor-pointer"
    >
      <div className="bg-cyan-950/50 backdrop-blur-xl rounded-3xl border border-cyan-800/40 p-8 hover:border-cyan-600/60 transition-all duration-500 shadow-2xl group-hover:shadow-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-xl`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", bounce: 0.6 }}
            className="text-right"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-200 to-blue-300 bg-clip-text text-transparent">
              {value}
            </div>
          </motion.div>
        </div>
        <h3 className="text-cyan-300 font-semibold text-lg">{title}</h3>

        {/* Animated gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
          whileHover={{ opacity: 0.1 }}
        />

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full"
            animate={{ translateX: ["100%", "-100%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
