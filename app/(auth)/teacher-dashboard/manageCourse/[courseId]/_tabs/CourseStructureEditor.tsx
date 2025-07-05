"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Video,
  FileText,
  Save,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "@/lib/api";

type VideoForm = {
  title: string;
  file: File | null;
  cloudinaryId?: string;
  secureUrl?: string;
  thumbnail?: string;
};

type ChapterForm = {
  title: string;
  videos: VideoForm[];
};

type CourseStructureEditorProps = {
  course: {
    title: string;
    description: string;
    chapters: ChapterForm[];
  };
  courseId: string;
};

export default function CourseStructureEditor({
  course,
  courseId,
}: CourseStructureEditorProps) {
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [chapters, setChapters] = useState<ChapterForm[]>(
    course.chapters || []
  );
  const { getToken } = useAuth();

  const handleSaveCourse = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("chapters", JSON.stringify(chapters));

    chapters.forEach((chapter, ci) => {
      chapter.videos?.forEach((video, vi) => {
        if (video.file) {
          formData.append(`video-${ci}-${vi}`, video.file);
        }
      });
    });

    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/api/teacher/update-structure/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "PATCH",
          body: formData,
        }
      );

      if (res.ok) {
        alert("Course structure saved!");
      } else {
        const err = await res.json();
        console.error("Update failed:", err);
        alert("Update failed: " + (err?.error || "unknown error"));
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Something went wrong");
    }
  };

  const handleChapterChange = (index: number, value: string) => {
    const newChapters = [...chapters];
    newChapters[index].title = value;
    setChapters(newChapters);
  };

  const handleAddChapter = () => {
    setChapters([...chapters, { title: "", videos: [] }]);
  };

  const handleDeleteChapter = (index: number) => {
    const updated = [...chapters];
    updated.splice(index, 1);
    setChapters(updated);
  };

  const handleAddVideo = (chapterIndex: number) => {
    const updated = [...chapters];
    updated[chapterIndex].videos.push({ title: "", file: null });
    setChapters(updated);
  };

  const handleVideoTitleChange = (
    chapterIndex: number,
    videoIndex: number,
    title: string
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].videos[videoIndex].title = title;
    setChapters(updated);
  };

  const handleVideoFileChange = (
    chapterIndex: number,
    videoIndex: number,
    file: File | null
  ) => {
    const updated = [...chapters];
    updated[chapterIndex].videos[videoIndex].file = file;
    setChapters(updated);
  };

  const handleDeleteVideo = (chapterIndex: number, videoIndex: number) => {
    const updated = [...chapters];
    updated[chapterIndex].videos.splice(videoIndex, 1);
    setChapters(updated);
  };

  return (
    <div className="space-y-8">
      {/* Course Basic Information */}
      <div className="bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Course Information</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-cyan-200 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Course Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title..."
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-cyan-200 font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Course Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your course..."
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl min-h-[100px] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Course Chapters</h3>
              <p className="text-cyan-200/70">
                Organize your content into structured chapters
              </p>
            </div>
          </div>

          <Button
            onClick={handleAddChapter}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="mr-2 w-5 h-5" />
            Add Chapter
          </Button>
        </div>

        {chapters.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/30 via-slate-900/30 to-cyan-900/10 backdrop-blur-xl border border-dashed border-cyan-500/30 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-cyan-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              No Chapters Yet
            </h4>
            <p className="text-cyan-200/70 mb-6">
              Start building your course by adding your first chapter
            </p>
            <Button
              onClick={handleAddChapter}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 w-5 h-5" />
              Create First Chapter
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter: ChapterForm, ci: number) => (
              <div
                key={ci}
                className="bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 p-6 border-b border-cyan-500/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg">
                        {ci + 1}
                      </div>
                      <div className="flex-1">
                        <label className="text-cyan-200 font-medium text-sm mb-2 block">
                          Chapter {ci + 1} Title
                        </label>
                        <Input
                          value={chapter.title || ""}
                          onChange={(e) =>
                            handleChapterChange(ci, e.target.value)
                          }
                          placeholder={`Enter chapter ${ci + 1} title...`}
                          className="bg-slate-800/60 border-cyan-500/30 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl h-12"
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteChapter(ci)}
                      className="bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-300 rounded-xl w-12 h-12 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Videos Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-lg font-semibold text-white">
                        Chapter Videos
                      </h4>
                      <span className="bg-cyan-900/30 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                        {(chapter.videos && chapter.videos.length) || 0} videos
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVideo(ci)}
                      className="bg-slate-800/50 border-cyan-500/30 text-cyan-300 hover:bg-slate-700/50 hover:border-cyan-400/50 hover:text-cyan-200 rounded-xl transition-all duration-300"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Add Video
                    </Button>
                  </div>

                  {chapter.videos && chapter.videos.length > 0 ? (
                    <div className="space-y-4">
                      {chapter.videos.map((video: VideoForm, vi: number) => (
                        <div
                          key={vi}
                          className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 transition-all duration-300 hover:border-cyan-500/30"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                              <PlayCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <label className="text-slate-300 font-medium text-sm mb-2 block">
                                Video {vi + 1} Title
                              </label>
                              <Input
                                value={video.title || ""}
                                onChange={(e) =>
                                  handleVideoTitleChange(ci, vi, e.target.value)
                                }
                                placeholder={`Enter video ${vi + 1} title...`}
                                className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400/50 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-lg h-10"
                              />
                            </div>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteVideo(ci, vi)}
                              className="bg-red-900/20 border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/50 hover:text-red-300 rounded-lg w-10 h-10 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* File Upload or Video Display */}
                          <div className="space-y-4">
                            {/* Check for existing video using secureUrl or cloudinaryId */}
                            {video.secureUrl || video.cloudinaryId ? (
                              // Show existing video
                              <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden border border-slate-600/50 shadow-lg bg-black">
                                  <video
                                    controls
                                    className="w-full max-w-2xl"
                                    preload="metadata"
                                    poster={video.thumbnail || undefined}
                                  >
                                    <source
                                      src={video.secureUrl}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </div>

                                {/* Video Info */}
                                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                      <Video className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div>
                                      <p className="text-green-300 font-medium">
                                        Video Uploaded
                                      </p>
                                      <p className="text-green-200/70 text-sm">
                                        {video.cloudinaryId
                                          ? `ID: ${video.cloudinaryId}`
                                          : "Stored video"}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Option to replace video */}
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                      handleVideoFileChange(
                                        ci,
                                        vi,
                                        e.target.files?.[0] || null
                                      )
                                    }
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id={`video-replace-${ci}-${vi}`}
                                  />
                                  <label
                                    htmlFor={`video-replace-${ci}-${vi}`}
                                    className="flex items-center justify-center w-full p-3 border border-cyan-500/30 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group"
                                  >
                                    <div className="text-center">
                                      <Video className="w-6 h-6 text-cyan-400 mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" />
                                      <p className="text-cyan-300 font-medium text-sm">
                                        Replace Video
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            ) : (
                              // Show upload option for new videos
                              <>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                      handleVideoFileChange(
                                        ci,
                                        vi,
                                        e.target.files?.[0] || null
                                      )
                                    }
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id={`video-${ci}-${vi}`}
                                  />
                                  <label
                                    htmlFor={`video-${ci}-${vi}`}
                                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-cyan-500/30 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group"
                                  >
                                    <div className="text-center">
                                      <Video className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                                      <p className="text-cyan-300 font-medium">
                                        {video.file
                                          ? "Change Video File"
                                          : "Upload Video File"}
                                      </p>
                                      <p className="text-slate-400 text-sm mt-1">
                                        Click to browse or drag and drop
                                      </p>
                                    </div>
                                  </label>
                                </div>

                                {video.file && (
                                  <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <Video className="w-4 h-4 text-green-400" />
                                      </div>
                                      <div>
                                        <p className="text-green-300 font-medium">
                                          File Selected
                                        </p>
                                        <p className="text-green-200/70 text-sm">
                                          {video.file.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-900/30 to-slate-800/30 border border-dashed border-slate-600/30 rounded-xl p-8 text-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Video className="w-6 h-6 text-purple-400" />
                      </div>
                      <h5 className="text-white font-medium mb-2">
                        No Videos Yet
                      </h5>
                      <p className="text-slate-400 text-sm mb-4">
                        Add videos to this chapter to get started
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddVideo(ci)}
                        className="bg-slate-800/50 border-cyan-500/30 text-cyan-300 hover:bg-slate-700/50 hover:border-cyan-400/50 hover:text-cyan-200 rounded-xl"
                      >
                        <Plus className="mr-2 w-4 h-4" />
                        Add First Video
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={handleSaveCourse}
          className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
        >
          <Save className="mr-3 w-6 h-6" />
          Save Course Structure
        </Button>
      </div>
    </div>
  );
}
