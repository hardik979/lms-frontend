"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
  const { getToken } = useAuth();

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
          const testRes = await fetch(
            "http://localhost:5000/api/tests/create-test",
            {
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
            }
          );

          if (testRes.ok) {
            const testData = await testRes.json();
            const testId = testData.test._id;

            // Add questions to the test
            for (const question of chapter.testQuestions) {
              await fetch(
                `http://localhost:5000/api/tests/${testId}/questions`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(question),
                }
              );
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

  const handleSubmit = async () => {
    if (!title || !description || !thumbnail) {
      toast.error("Please fill course title, description, and thumbnail.");
      return;
    }

    setStatus("Uploading course...");

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

    chapters.forEach((chapter, ci) => {
      chapter.videos.forEach((video, vi) => {
        if (video.file) {
          formData.append(`video-${ci}-${vi}`, video.file);
        }
      });
    });

    const token = await getToken();

    try {
      const res = await fetch(
        "http://localhost:5000/api/teacher/create-course",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();
      if (res.ok) {
        setStatus("Creating tests...");

        // Create tests after course is created successfully
        await createTestsForCourse(result.course._id);

        toast.success("✅ Course and tests created successfully!");
        setStatus("");
      } else {
        toast.error("❌ Failed: " + result.error);
        setStatus("");
      }
    } catch (err) {
      toast.error("❌ Server error. Please try again later.");
      setStatus("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-bold text-cyan-300">Create New Course</h1>

      <Card className="p-6 space-y-4 bg-cyan-800 border-cyan-500">
        <div>
          <Label className="text-white">Course Title</Label>
          <Input
            className="text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-white">Course Description</Label>
          <Textarea
            className="text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-white">Course Thumbnail</Label>
          <Input
            className="text-white"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </div>
      </Card>

      {chapters.map((chapter, ci) => (
        <Card key={ci} className="p-6 bg-cyan-800 border-cyan-500 space-y-6">
          <div className="flex justify-between items-center">
            <Label className="text-white text-lg font-semibold">
              Chapter {ci + 1}
            </Label>
            {chapters.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveChapter(ci)}
              >
                Remove Chapter
              </Button>
            )}
          </div>

          <div>
            <Label className="text-white">Chapter Title</Label>
            <Input
              className="text-white"
              value={chapter.title}
              onChange={(e) => {
                const updated = [...chapters];
                updated[ci].title = e.target.value;
                setChapters(updated);
              }}
            />
          </div>

          {/* Videos Section */}
          <div className="space-y-4">
            <Label className="text-white text-md font-medium">Videos</Label>
            {chapter.videos.map((video, vi) => (
              <div
                key={vi}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-cyan-700 rounded"
              >
                <div>
                  <Label className="text-white">Video {vi + 1} Title</Label>
                  <Input
                    className="text-white"
                    value={video.title}
                    onChange={(e) => {
                      const updated = [...chapters];
                      updated[ci].videos[vi].title = e.target.value;
                      setChapters(updated);
                    }}
                  />
                </div>
                <div>
                  <Label className="text-white">Video File</Label>
                  <Input
                    className="text-white"
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const updated = [...chapters];
                      updated[ci].videos[vi].file = e.target.files?.[0] || null;
                      setChapters(updated);
                    }}
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="text-cyan-900 border-cyan-700"
              onClick={() => handleAddVideo(ci)}
            >
              + Add Video
            </Button>
          </div>

          {/* Test Section */}
          <div className="space-y-4 border-t border-cyan-600 pt-4">
            <Label className="text-white text-md font-medium">
              Chapter Test (Optional)
            </Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Test Title</Label>
                <Input
                  className="text-white"
                  placeholder={`${chapter.title || "Chapter"} Test`}
                  value={chapter.testTitle}
                  onChange={(e) => {
                    const updated = [...chapters];
                    updated[ci].testTitle = e.target.value;
                    setChapters(updated);
                  }}
                />
              </div>
              <div>
                <Label className="text-white">Test Description</Label>
                <Input
                  className="text-white"
                  placeholder="Brief description of the test"
                  value={chapter.testDescription}
                  onChange={(e) => {
                    const updated = [...chapters];
                    updated[ci].testDescription = e.target.value;
                    setChapters(updated);
                  }}
                />
              </div>
            </div>

            {/* Test Questions */}
            {chapter.testQuestions.map((question, qi) => (
              <Card
                key={qi}
                className="p-4 bg-cyan-700 border-cyan-600 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Label className="text-white font-medium">
                    Question {qi + 1}
                  </Label>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveTestQuestion(ci, qi)}
                  >
                    Remove
                  </Button>
                </div>

                <div>
                  <Label className="text-white">Question</Label>
                  <Textarea
                    className="text-white"
                    placeholder="Enter your question here..."
                    value={question.question}
                    onChange={(e) =>
                      handleTestQuestionChange(
                        ci,
                        qi,
                        "question",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white">Option A</Label>
                    <Input
                      className="text-white"
                      value={question.options.A}
                      onChange={(e) =>
                        handleTestQuestionChange(ci, qi, "options", {
                          ...question.options,
                          A: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-white">Option B</Label>
                    <Input
                      className="text-white"
                      value={question.options.B}
                      onChange={(e) =>
                        handleTestQuestionChange(ci, qi, "options", {
                          ...question.options,
                          B: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-white">Option C</Label>
                    <Input
                      className="text-white"
                      value={question.options.C}
                      onChange={(e) =>
                        handleTestQuestionChange(ci, qi, "options", {
                          ...question.options,
                          C: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-white">Option D</Label>
                    <Input
                      className="text-white"
                      value={question.options.D}
                      onChange={(e) =>
                        handleTestQuestionChange(ci, qi, "options", {
                          ...question.options,
                          D: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white">Correct Answer</Label>
                    <select
                      className="w-full p-2 rounded bg-cyan-600 text-white border border-cyan-500"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleTestQuestionChange(
                          ci,
                          qi,
                          "correctAnswer",
                          e.target.value as "A" | "B" | "C" | "D"
                        )
                      }
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-white">Explanation (Optional)</Label>
                    <Input
                      className="text-white"
                      placeholder="Why is this the correct answer?"
                      value={question.explanation}
                      onChange={(e) =>
                        handleTestQuestionChange(
                          ci,
                          qi,
                          "explanation",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              className="text-cyan-900 border-cyan-700"
              onClick={() => handleAddTestQuestion(ci)}
            >
              + Add Test Question
            </Button>
          </div>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="border-cyan-700 text-cyan-900"
          onClick={handleAddChapter}
        >
          + Add Chapter
        </Button>
        <Button onClick={handleSubmit} disabled={!!status}>
          {status || "Create Course"}
        </Button>
      </div>

      {status && <p className="text-cyan-400">{status}</p>}
    </div>
  );
}
