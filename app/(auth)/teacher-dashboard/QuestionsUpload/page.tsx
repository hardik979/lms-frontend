"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Course } from "@/types"; // make sure you have this type defined

export default function PracticeUploadPage() {
  const { getToken } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = await getToken();
      try {
        const res = await fetch("http://localhost:5000/api/users/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCourses(data.courses || []);
        setCourseId(data.courses?.[0]?._id || "");
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    fetchCourses();
  }, [getToken]);

  const handleAddField = (setFn: any) => {
    setFn((prev: any[]) => [...prev, { input: "", output: "" }]);
  };

  const handleChange = (
    setFn: any,
    i: number,
    field: string,
    value: string
  ) => {
    setFn((prev: any[]) => {
      const copy = [...prev];
      copy[i][field] = value;
      return copy;
    });
  };

  const handleSubmit = async () => {
    const token = await getToken();

    if (!title || !description || !courseId) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/practise/create-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            difficulty,
            courseId,
            examples: JSON.stringify(examples),
            testCases: JSON.stringify(testCases),
          }),
        }
      );

      if (res.ok) {
        toast.success("✅ Practice question created!");
        setTitle("");
        setDescription("");
        setExamples([{ input: "", output: "" }]);
        setTestCases([{ input: "", output: "" }]);
      } else {
        const data = await res.json();
        toast.error("❌ Failed: " + data.error);
      }
    } catch (err) {
      toast.error("❌ Server error. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-bold text-cyan-300">
        Upload Practice Question
      </h1>

      <Card className="p-6 bg-cyan-800 border-cyan-500 space-y-4">
        <div>
          <Label className="text-white">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-white"
          />
        </div>

        <div>
          <Label className="text-white">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-white"
            rows={5}
          />
        </div>

        <div>
          <Label className="text-white">Course</Label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="text-black w-full p-2 rounded"
          >
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-white">Difficulty</Label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-black w-full p-2 rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </Card>

      <Card className="p-6 bg-cyan-800 border-cyan-500 space-y-4">
        <h2 className="text-lg font-semibold text-white">Examples</h2>
        {examples.map((ex, i) => (
          <div key={i} className="flex gap-4">
            <Input
              placeholder="Input"
              className="text-white"
              value={ex.input}
              onChange={(e) =>
                handleChange(setExamples, i, "input", e.target.value)
              }
            />
            <Input
              placeholder="Output"
              className="text-white"
              value={ex.output}
              onChange={(e) =>
                handleChange(setExamples, i, "output", e.target.value)
              }
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => handleAddField(setExamples)}
          className="text-cyan-900 border-cyan-700"
        >
          + Add Example
        </Button>
      </Card>

      <Card className="p-6 bg-cyan-800 border-cyan-500 space-y-4">
        <h2 className="text-lg font-semibold text-white">Test Cases</h2>
        {testCases.map((tc, i) => (
          <div key={i} className="flex gap-4">
            <Input
              placeholder="Input"
              className="text-white"
              value={tc.input}
              onChange={(e) =>
                handleChange(setTestCases, i, "input", e.target.value)
              }
            />
            <Input
              placeholder="Output"
              className="text-white"
              value={tc.output}
              onChange={(e) =>
                handleChange(setTestCases, i, "output", e.target.value)
              }
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => handleAddField(setTestCases)}
          className="text-cyan-900 border-cyan-700"
        >
          + Add Test Case
        </Button>
      </Card>

      <Button onClick={handleSubmit}>Submit Question</Button>
    </div>
  );
}
