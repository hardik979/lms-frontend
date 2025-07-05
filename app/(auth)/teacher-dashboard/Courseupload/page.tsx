"use client";
import { useState } from "react";
import { Plus, Trash2, Upload, Play, Video, TestTube } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "@/lib/api";
type VideoForm = {
  title: string;
  file: File | null;
};

type TestQuestion = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

type ChapterForm = {
  title: string;
  videos: VideoForm[];
  testQuestions: TestQuestion[];
  testTitle: string;
  testDescription: string;
};

export default function CreateCoursePage() {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [chapters, setChapters] = useState<ChapterForm[]>([
    {
      title: "",
      videos: [{ title: "", file: null }],
      testQuestions: [],
      testTitle: "",
      testDescription: "",
    },
  ]);
  const [status, setStatus] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  const showNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        title: "",
        videos: [{ title: "", file: null }],
        testQuestions: [],
        testTitle: "",
        testDescription: "",
      },
    ]);
  };

  const handleRemoveChapter = (index: number) => {
    const updated = [...chapters];
    updated.splice(index, 1);
    setChapters(updated);
  };

  const handleAddVideo = (chapterIndex: number) => {
    const updated = [...chapters];
    updated[chapterIndex].videos.push({ title: "", file: null });
    setChapters(updated);
  };

  const handleAddTestQuestion = (chapterIndex: number) => {
    const updated = [...chapters];
    updated[chapterIndex].testQuestions.push({
      question: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
    setChapters(updated);
  };

  const handleRemoveTestQuestion = (
    chapterIndex: number,
    questionIndex: number
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].testQuestions.splice(questionIndex, 1);
    setChapters(updated);
  };

  const handleTestQuestionChange = (
    chapterIndex: number,
    questionIndex: number,
    field: string,
    value: string | object
  ) => {
    const updated = [...chapters];
    if (field === "options") {
      updated[chapterIndex].testQuestions[questionIndex].options = value as {
        A: string;
        B: string;
        C: string;
        D: string;
      };
    } else {
      (updated[chapterIndex].testQuestions[questionIndex] as any)[field] =
        value;
    }
    setChapters(updated);
  };

  const createTestsForCourse = async (courseId: string) => {
    const token = await getToken();

    for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
      const chapter = chapters[chapterIndex];

      if (chapter.testQuestions.length > 0) {
        try {
          // Create test for this chapter
          const testRes = await fetch(`${API_BASE_URL}/api/tests/create-test`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              courseId,
              chapterIndex,
              title: chapter.testTitle || `${chapter.title} Test`,
              description:
                chapter.testDescription || `Test for ${chapter.title}`,
            }),
          });

          if (testRes.ok) {
            const testData = await testRes.json();
            const testId = testData.test._id;

            // Add questions to the test
            for (const question of chapter.testQuestions) {
              await fetch(`${API_BASE_URL}/api/tests/${testId}/questions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(question),
              });
            }
          }
        } catch (err) {
          console.error(
            `Failed to create test for chapter ${chapterIndex}:`,
            err
          );
        }
      }
    }
  };
  const uploadFileToBunny = (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          onProgress(percent);
        }
      };

      xhr.onload = () =>
        xhr.status === 200 || xhr.status === 201
          ? resolve()
          : reject("Upload failed");
      xhr.onerror = () => reject("Upload failed");
      xhr.send(file);
    });
  };

  const uploadVideosToBunny = async (newCourse: any) => {
    for (let ci = 0; ci < chapters.length; ci++) {
      const frontendChapter = chapters[ci];
      const backendChapter = newCourse.chapters[ci];

      for (let vi = 0; vi < frontendChapter.videos.length; vi++) {
        const videoFile = frontendChapter.videos[vi].file;
        const uploadUrl = backendChapter.videos[vi]?.uploadUrl;

        if (videoFile && uploadUrl) {
          await uploadFileToBunny(videoFile, uploadUrl, (progress) => {
            setUploadProgress(50 + progress / 2); // Progress from 50% to 100%
          });
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !thumbnail) {
      showNotification("Please fill course title, description, and thumbnail.");
      return;
    }

    setStatus("Creating course metadata...");
    setIsUploading(true);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append(
      "chapters",
      JSON.stringify(
        chapters.map((ch) => ({
          title: ch.title,
          videos: ch.videos.map((v) => ({ title: v.title })),
        }))
      )
    );

    const token = await getToken();

    try {
      const res = await fetch(`${API_BASE_URL}/api/teacher/create-course`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        showNotification("❌ Failed: " + result.error);
        setIsUploading(false);
        return;
      }

      const newCourse = result.course;

      setUploadProgress(50);
      setStatus("Uploading videos directly to Bunny...");

      await uploadVideosToBunny(newCourse);

      setUploadProgress(80);
      setStatus("Creating tests...");
      await createTestsForCourse(newCourse._id);

      setUploadProgress(100);
      showNotification("✅ Course and tests created successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      showNotification("❌ Server error. Please try again later.");
    } finally {
      setStatus("");
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setChapters([
      {
        title: "",
        videos: [{ title: "", file: null }],
        testQuestions: [],
        testTitle: "",
        testDescription: "",
      },
    ]);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900  rounded-2xl">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-white shadow-2xl animate-in slide-in-from-right duration-500"
          >
            {notification}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-100 via-cyan-300 to-cyan-400 bg-clip-text text-transparent">
              Create New Course
            </h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            In This Section you can add a new course and create tests for it for
            students.
          </p>
        </div>

        {/* Course Details */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-cyan-300 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-white">
              Course Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter an engaging course title..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Course Thumbnail
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/70 hover:bg-white/20 transition-all cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <span>
                      {thumbnail ? thumbnail.name : "Choose thumbnail image"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-3">
                Course Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn in this course..."
                rows={6}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-8">
          {chapters.map((chapter, ci) => (
            <div
              key={ci}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              {/* Chapter Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white font-bold">
                    {ci + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Chapter {ci + 1}
                    </h3>
                    <p className="text-white/60">
                      Videos, content, and assessments
                    </p>
                  </div>
                </div>
                {chapters.length > 1 && (
                  <button
                    onClick={() => handleRemoveChapter(ci)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              {/* Chapter Title */}
              <div className="mb-8">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => {
                    const updated = [...chapters];
                    updated[ci].title = e.target.value;
                    setChapters(updated);
                  }}
                  placeholder="Enter chapter title..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Videos Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-medium text-white">Videos</h4>
                </div>

                <div className="space-y-4">
                  {chapter.videos.map((video, vi) => (
                    <div
                      key={vi}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl"
                    >
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Video {vi + 1} Title
                        </label>
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => {
                            const updated = [...chapters];
                            updated[ci].videos[vi].title = e.target.value;
                            setChapters(updated);
                          }}
                          placeholder="Enter video title..."
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Video File
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const updated = [...chapters];
                              updated[ci].videos[vi].file =
                                e.target.files?.[0] || null;
                              setChapters(updated);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/70 hover:bg-white/20 transition-all cursor-pointer">
                            <Play className="w-4 h-4" />
                            <span className="text-sm">
                              {video.file
                                ? video.file.name
                                : "Choose video file"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAddVideo(ci)}
                  className="flex items-center gap-2 px-4 py-2 mt-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-blue-500/30 rounded-xl text-blue-300 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Video
                </button>
              </div>

              {/* Test Section */}
              <div className="border-t border-white/10 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <TestTube className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-medium text-white">
                    Chapter Assessment
                  </h4>
                  <span className="text-white/50 text-sm">(Optional)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Test Title
                    </label>
                    <input
                      type="text"
                      value={chapter.testTitle}
                      onChange={(e) => {
                        const updated = [...chapters];
                        updated[ci].testTitle = e.target.value;
                        setChapters(updated);
                      }}
                      placeholder={`${chapter.title || "Chapter"} Assessment`}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Test Description
                    </label>
                    <input
                      type="text"
                      value={chapter.testDescription}
                      onChange={(e) => {
                        const updated = [...chapters];
                        updated[ci].testDescription = e.target.value;
                        setChapters(updated);
                      }}
                      placeholder="Brief description of the assessment"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Test Questions */}
                <div className="space-y-6">
                  {chapter.testQuestions.map((question, qi) => (
                    <div
                      key={qi}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/30 rounded-lg text-cyan-300 font-medium text-sm">
                            {qi + 1}
                          </div>
                          <span className="text-white font-medium">
                            Question {qi + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveTestQuestion(ci, qi)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Question
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) =>
                              handleTestQuestionChange(
                                ci,
                                qi,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Enter your question here..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(["A", "B", "C", "D"] as const).map((option) => (
                            <div key={option}>
                              <label className="block text-white/80 text-sm font-medium mb-2">
                                Option {option}
                              </label>
                              <input
                                type="text"
                                value={question.options[option]}
                                onChange={(e) =>
                                  handleTestQuestionChange(ci, qi, "options", {
                                    ...question.options,
                                    [option]: e.target.value,
                                  })
                                }
                                placeholder={`Enter option ${option}`}
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) =>
                                handleTestQuestionChange(
                                  ci,
                                  qi,
                                  "correctAnswer",
                                  e.target.value as "A" | "B" | "C" | "D"
                                )
                              }
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              Explanation
                            </label>
                            <input
                              type="text"
                              value={question.explanation}
                              onChange={(e) =>
                                handleTestQuestionChange(
                                  ci,
                                  qi,
                                  "explanation",
                                  e.target.value
                                )
                              }
                              placeholder="Why is this the correct answer?"
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAddTestQuestion(ci)}
                  className="flex items-center gap-2 px-4 py-2 mt-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-cyan-300 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-medium">
                {status || "Uploading..."}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-white/60 mt-2 text-sm">
              {uploadProgress}% completed
            </p>
          </div>
        )}

        {/* Final Buttons */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={handleAddChapter}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
          >
            <Plus className="w-4 h-4" />
            Add Chapter
          </button>

          <button
            onClick={handleSubmit}
            disabled={!!status || isUploading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl transition-all disabled:opacity-50"
          >
            {status ? "Processing..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
