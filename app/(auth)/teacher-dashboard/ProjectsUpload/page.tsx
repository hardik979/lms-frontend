"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  const handleSubmit = async () => {
    if (!thumbnail) return toast.error("❌ Please upload a thumbnail");

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
      const res = await fetch("http://localhost:5000/api/projects/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("✅ Project uploaded successfully");
        setTitle("");
        setSubheading("");
        setObjective("");
        setTechStack([""]);
        setGithubRepo("");
        setThumbnail(null);
        setParts([{ title: "", description: "" }]);
      } else {
        const data = await res.json();
        toast.error(data.error || "❌ Upload failed");
      }
    } catch (err) {
      toast.error("❌ Server error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-cyan-300">Upload Project</h1>

      <Card className="bg-cyan-800 border-cyan-500 p-6 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Project Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white mb-2">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">
              Subheading (e.g., Backend Development)
            </Label>
            <Input
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">Objective</Label>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">
              Tech Stack (comma separated)
            </Label>
            <Input
              value={techStack.join(", ")}
              onChange={(e) => setTechStack(e.target.value.split(","))}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">GitHub Repo Link</Label>
            <Input
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="text-white"
            />
          </div>
          <div>
            <Label className="text-white mb-2">Select Course</Label>
            <Select onValueChange={setCourseId} value={courseId}>
              <SelectTrigger className="bg-cyan-800 text-white border-cyan-700">
                <SelectValue
                  placeholder="Choose course"
                  className="text-white"
                />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-cyan-900 p-6 mb-6">
        <CardHeader>
          <CardTitle className="text-white ">Project Parts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {parts.map((part, index) => (
            <div key={index} className="space-y-2">
              <Input
                className="text-white"
                placeholder={`Part ${index + 1} Title`}
                value={part.title}
                onChange={(e) =>
                  handlePartChange(index, "title", e.target.value)
                }
              />
              <Textarea
                placeholder={`Part ${index + 1} Description`}
                value={part.description}
                onChange={(e) =>
                  handlePartChange(index, "description", e.target.value)
                }
                className="text-white"
              />
            </div>
          ))}
          <Button variant="secondary" onClick={addPart}>
            + Add Another Part
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSubmit}>Submit Project</Button>
    </div>
  );
}
