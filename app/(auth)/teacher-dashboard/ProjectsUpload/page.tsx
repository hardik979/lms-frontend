"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Plus,
  X,
  Book,
  FileText,
  Github,
  Image,
  Target,
  Code,
  CheckCircle,
  ArrowDownRight,
} from "lucide-react";

export default function UploadProjectPage() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [subheading, setSubheading] = useState("");
  const [objective, setObjective] = useState("");
  const [techStack, setTechStack] = useState([""]);
  const [githubRepo, setGithubRepo] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [parts, setParts] = useState([{ title: "", description: "" }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/users/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data.courses || []);
    };
    fetchCourses();
  }, [getToken]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handlePartChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setParts((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addPart = () => {
    setParts((prev) => [...prev, { title: "", description: "" }]);
  };

  const removePart = (index: number) => {
    if (parts.length > 1) {
      setParts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setThumbnail(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!thumbnail) return toast.error("❌ Please upload a thumbnail");

    setIsUploading(true);
    setUploadProgress(0);

    const token = await getToken();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("subheading", subheading);
    formData.append("objective", objective);
    formData.append("techStack", techStack.join(","));
    formData.append("githubRepo", githubRepo);
    formData.append("courseId", courseId);
    formData.append("parts", JSON.stringify(parts));
    formData.append("thumbnail", thumbnail);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const res = await fetch("http://localhost:5000/api/projects/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (res.ok) {
        toast.success("✅ Project uploaded successfully");
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          // Reset form
          setTitle("");
          setSubheading("");
          setObjective("");
          setTechStack([""]);
          setGithubRepo("");
          setThumbnail(null);
          setParts([{ title: "", description: "" }]);
          setCourseId("");
        }, 1500);
      } else {
        const data = await res.json();
        toast.error(data.error || "❌ Upload failed");
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (err) {
      toast.error("❌ Server error");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Upload Project
          </h1>
          <p className="text-cyan-200/80 text-lg">
            Upload Projects for Courses here{" "}
            <ArrowDownRight className="w-5 h-5 inline text-cyan-200/80" />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Book className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Project Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter your project title..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Subheading
                  </label>
                  <input
                    type="text"
                    value={subheading}
                    onChange={(e) => setSubheading(e.target.value)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="e.g., Backend Development"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Objective
                  </label>
                  <textarea
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    rows={4}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    placeholder="Describe what students will learn and achieve..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <Code className="w-4 h-4 inline mr-2" />
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    value={techStack.join(", ")}
                    onChange={(e) =>
                      setTechStack(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="React, Node.js, MongoDB..."
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Select Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map((course: any) => (
                      <option
                        key={course._id}
                        value={course._id}
                        className="bg-cyan-900"
                      >
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Thumbnail & Parts */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Thumbnail Upload */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Image className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Project Thumbnail
                </h2>
              </div>

              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-cyan-600/50 hover:border-cyan-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {thumbnail ? (
                  <div className="space-y-4">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <p className="text-green-300 font-medium">
                      {thumbnail.name}
                    </p>
                    <button
                      onClick={() => setThumbnail(null)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-cyan-300 mx-auto" />
                    <div>
                      <p className="text-white font-medium mb-2">
                        Drop your thumbnail here
                      </p>
                      <p className="text-cyan-200/70 text-sm">
                        or click to browse
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbnail(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Project Parts */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-900/30 backdrop-blur-sm border border-cyan-700/50  rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Project Parts
                  </h2>
                </div>
                <button
                  onClick={addPart}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Part
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {parts.map((part, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-cyan-800/20 border border-cyan-600/30 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-300 font-medium">
                          Part {index + 1}
                        </span>
                        {parts.length > 1 && (
                          <button
                            onClick={() => removePart(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Part title..."
                        value={part.title}
                        onChange={(e) =>
                          handlePartChange(index, "title", e.target.value)
                        }
                        className="w-full bg--900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                      <textarea
                        placeholder="Part description..."
                        value={part.description}
                        onChange={(e) =>
                          handlePartChange(index, "description", e.target.value)
                        }
                        rows={3}
                        className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold px-12 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isUploading ? "Uploading..." : "Submit Project"}
          </button>
        </motion.div>

        {/* Upload Progress Modal */}
        <AnimatePresence>
          {isUploading && (
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
                    <Upload className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Uploading Project
                  </h3>
                  <p className="text-cyan-200/70 mb-6">
                    Please wait while we process your project...
                  </p>

                  <div className="w-full bg-cyan-900/50 rounded-full h-3 mb-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <p className="text-cyan-300 font-medium">
                    {Math.round(uploadProgress)}% Complete
                  </p>

                  {uploadProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-300 font-medium">
                        Upload Complete!
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
