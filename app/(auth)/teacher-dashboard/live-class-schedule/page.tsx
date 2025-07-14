"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Video,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Play,
  ArrowRight,
  Link2,
  MessageSquare,
  FileText,
  Users,
  Search,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// Type definitions
interface Course {
  _id: string;
  title: string;
  students?: number;
}

interface Student {
  email: string;
}

interface FormData {
  title: string;
  description: string;
  courseId: string;
  meetLink: string;
  scheduledAt: string;
}

interface CustomCalendarProps {
  selectedDateTime: string;
  onDateTimeSelect: (dateTime: string) => void;
  onClose: () => void;
}

// Multi-Select Student Dropdown Component
const StudentMultiSelect: React.FC<{
  students: Student[];
  selectedEmails: string[];
  onSelectionChange: (emails: string[]) => void;
}> = ({ students, selectedEmails, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student selection
  const handleStudentToggle = (email: string) => {
    if (selectedEmails.includes(email)) {
      onSelectionChange(selectedEmails.filter((e) => e !== email));
    } else {
      onSelectionChange([...selectedEmails, email]);
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedEmails.length === students.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(students.map((s) => s.email));
    }
  };

  // Remove selected student
  const removeStudent = (email: string) => {
    onSelectionChange(selectedEmails.filter((e) => e !== email));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Students Display */}
      {selectedEmails.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedEmails.map((email) => (
            <motion.span
              key={email}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 bg-cyan-500/20 text-cyan-200 px-3 py-1 rounded-full text-sm border border-cyan-500/30"
            >
              {email}
              <button
                onClick={() => removeStudent(email)}
                className="ml-1 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-left flex items-center justify-between hover:bg-cyan-900/40"
      >
        <span
          className={
            selectedEmails.length > 0 ? "text-white" : "text-cyan-300/60"
          }
        >
          {selectedEmails.length > 0
            ? `${selectedEmails.length} student${
                selectedEmails.length > 1 ? "s" : ""
              } selected`
            : "Select students (optional)"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-cyan-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-cyan-600/50 rounded-2xl shadow-2xl z-50 max-h-80 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-cyan-700/30">
              <div className="relative">
                <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg pl-10 pr-4 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-cyan-300/60"
                />
              </div>
            </div>

            {/* Select All/None */}
            <div className="p-3 border-b border-cyan-700/30">
              <button
                onClick={handleSelectAll}
                className="w-full text-left px-3 py-2 hover:bg-cyan-700/30 rounded-lg transition-colors flex items-center gap-3 text-cyan-200 hover:text-white"
              >
                <div className="w-5 h-5 rounded border border-cyan-500/50 flex items-center justify-center">
                  {selectedEmails.length === students.length && (
                    <Check className="w-3 h-3 text-cyan-400" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {selectedEmails.length === students.length
                    ? "Deselect All"
                    : "Select All"}
                </span>
              </button>
            </div>

            {/* Students List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-cyan-300/60">
                  {searchQuery ? "No students found" : "No students available"}
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <motion.button
                    key={student.email}
                    onClick={() => handleStudentToggle(student.email)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-700/30 transition-colors flex items-center gap-3 text-cyan-200 hover:text-white border-b border-cyan-700/10 last:border-b-0"
                    whileHover={{ x: 2 }}
                  >
                    <div className="w-5 h-5 rounded border border-cyan-500/50 flex items-center justify-center">
                      {selectedEmails.includes(student.email) && (
                        <Check className="w-3 h-3 text-cyan-400" />
                      )}
                    </div>
                    <span className="text-sm">{student.email}</span>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom Calendar Component
const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDateTime,
  onDateTimeSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDateTime ? new Date(selectedDateTime) : new Date()
  );

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (year: number, month: number, day: number): boolean => {
    if (!selectedDateTime) return false;
    const dateStr = formatDate(year, month, day);
    return selectedDateTime.startsWith(dateStr);
  };

  const isPastDate = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const renderCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const dateStr = formatDate(year, month, day);
      const isPast = isPastDate(year, month, day);

      days.push(
        <motion.button
          key={day}
          whileHover={!isPast ? { scale: 1.05 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
          onClick={() => {
            if (!isPast) {
              // If there's already a time selected, preserve it
              const existingTime = selectedDateTime
                ? selectedDateTime.split("T")[1]
                : "09:00";
              onDateTimeSelect(`${dateStr}T${existingTime}`);
              onClose();
            }
          }}
          disabled={isPast}
          className={`
            h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all
            ${
              isSelected(year, month, day)
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                : isToday(year, month, day)
                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                : isPast
                ? "text-gray-500 cursor-not-allowed opacity-50"
                : "text-cyan-200 hover:bg-cyan-700/30 hover:text-white cursor-pointer hover:shadow-md"
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-cyan-600/50 rounded-2xl p-6 shadow-2xl z-50 min-w-[350px]"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-cyan-700/30 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-300" />
        </button>
        <h3 className="text-cyan-200 font-semibold text-lg">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-cyan-700/30 rounded-xl transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-cyan-300" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-cyan-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      <div className="mt-4 pt-3 border-t border-cyan-700/30">
        <p className="text-xs text-cyan-400/70 text-center">
          Past dates are disabled
        </p>
      </div>
    </motion.div>
  );
};

const LiveClassSchedulerPage: React.FC = () => {
  const { getToken } = useAuth();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    courseId: "",
    meetLink: "",
    scheduledAt: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, [getToken]);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async (): Promise<void> => {
      setLoadingStudents(true);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [getToken]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Update selected course when courseId changes
    if (name === "courseId") {
      const course = courses.find((c) => c._id === value);
      setSelectedCourse(course || null);
    }
  };

  const handleDateTimeSelect = (dateTime: string): void => {
    setForm({ ...form, scheduledAt: dateTime });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!form.courseId) {
      toast.error("❌ Please select a course");
      return;
    }

    if (!form.title.trim()) {
      toast.error("❌ Please enter a class title");
      return;
    }

    if (!form.scheduledAt) {
      toast.error("❌ Please select date and time");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const payload = {
        ...form,
        allowedStudentEmails: selectedStudentEmails, // ✅ Send selected student emails
      };

      const res = await fetch(`${API_BASE_URL}/api/teacher/live-class`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("✅ Live class scheduled successfully");
        setForm({
          title: "",
          description: "",
          courseId: "",
          meetLink: "",
          scheduledAt: "",
        });
        setSelectedCourse(null);
        setSelectedStudentEmails([]);
      } else {
        toast.error("❌ Failed to schedule class");
      }
    } catch (error) {
      console.error("Error scheduling class:", error);
      toast.error("❌ Failed to schedule class");
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-cyan-400/30">
              <Video className="w-8 h-8 text-cyan-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Schedule Live Class
          </h1>
        </motion.div>

        {/* Main Form */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl">
              <Play className="w-6 h-6 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Class Details</h2>
          </div>

          <div className="space-y-6">
            {/* Course Selection */}
            <div>
              <label className="block text-cyan-200 font-medium mb-3">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Select Course
              </label>
              <div className="relative">
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all appearance-none"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-5 h-5 text-cyan-400 absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>

            {/* Class Title */}
            <div>
              <label className="block text-cyan-200 font-medium mb-3">
                <FileText className="w-4 h-4 inline mr-2" />
                Class Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter an engaging class title..."
                className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-cyan-300/60"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-cyan-200 font-medium mb-3">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will students learn in this session?"
                className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none placeholder-cyan-300/60"
                rows={3}
              />
            </div>

            {/* Student Selection */}
            <div>
              <label className="block text-cyan-200 font-medium mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Select Students
                <span className="text-cyan-400/70 text-sm ml-2">
                  (Leave empty to allow all students)
                </span>
              </label>
              {loadingStudents ? (
                <div className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-cyan-300/60 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mr-3"></div>
                  Loading students...
                </div>
              ) : (
                <StudentMultiSelect
                  students={students}
                  selectedEmails={selectedStudentEmails}
                  onSelectionChange={setSelectedStudentEmails}
                />
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cyan-200 font-medium mb-3">
                  <CalendarDays className="w-4 h-4 inline mr-2" />
                  Date & Time
                </label>
                <div className="relative" ref={calendarRef}>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all text-left flex items-center justify-between hover:bg-cyan-900/40"
                  >
                    <span
                      className={
                        form.scheduledAt ? "text-white" : "text-cyan-300/60"
                      }
                    >
                      {form.scheduledAt
                        ? formatDisplayDateTime(form.scheduledAt)
                        : "Select date and time"}
                    </span>
                    <Calendar className="w-5 h-5 text-cyan-400" />
                  </button>

                  <AnimatePresence>
                    {showCalendar && (
                      <CustomCalendar
                        selectedDateTime={form.scheduledAt}
                        onDateTimeSelect={handleDateTimeSelect}
                        onClose={() => setShowCalendar(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block text-cyan-200 font-medium mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </label>
                <input
                  type="time"
                  value={form.scheduledAt ? form.scheduledAt.split("T")[1] : ""}
                  onChange={(e) => {
                    const date = form.scheduledAt
                      ? form.scheduledAt.split("T")[0]
                      : new Date().toISOString().split("T")[0];
                    setForm({
                      ...form,
                      scheduledAt: `${date}T${e.target.value}`,
                    });
                  }}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            </div>

            {/* Meet Link */}
            <div>
              <label className="block text-cyan-200 font-medium mb-3">
                <Link2 className="w-4 h-4 inline mr-2" />
                Google Meet Link
              </label>
              <input
                name="meetLink"
                value={form.meetLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/xyz-abc-def"
                className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-cyan-300/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-cyan-700/30">
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all transform disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Scheduling Class...
                </>
              ) : (
                <>
                  Schedule Live Class
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Scheduling Your Class
                  </h3>
                  <p className="text-cyan-200/70 mb-6">
                    Please wait while we set up your live session...
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LiveClassSchedulerPage;
