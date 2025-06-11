"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertCircleIcon,
  BookIcon,
  FileQuestionIcon,
  LightbulbIcon,
} from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { LANGUAGES } from "@/constants";
import LoadingPage from "@/components/Loader";
import SolveLayout from "@/components/SolveLayout";

// Dynamically import Monaco
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function SolvePage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const [question, setQuestion] = useState<any>(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("Click Run to see output");

  const [solved, setSolved] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<
    { _id: string; title: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();

      // Fetch all questions and user data
      const [qRes, userRes] = await Promise.all([
        fetch(
          `http://localhost:5000/api/practise/questions/665070b5fc13ae1a970003e4`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const { questions } = await qRes.json();
      const user = await userRes.json();

      setAllQuestions(questions || []);
      setSolved(user.solvedProblems?.map((q: any) => q.questionId) || []);
    };

    fetchData();
  }, [getToken]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/practise/question/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setQuestion(data);
      setCode(data.starterCode?.[language] || "// Write your code here");
    };

    if (id) fetchQuestion();
  }, [id, getToken]);

  const handleRunCode = () => {
    setOutput("🧪 Judge0 integration coming soon...");
  };

  // Navigation logic
  const currentIndex = allQuestions.findIndex((q) => q._id === id);
  const prevQuestionId =
    currentIndex > 0 ? allQuestions[currentIndex - 1]?._id : null;
  const nextQuestionId =
    currentIndex < allQuestions.length - 1
      ? allQuestions[currentIndex + 1]?._id
      : null;

  const goToPrev = () => {
    if (prevQuestionId) router.push(`/solve/${prevQuestionId}`);
  };

  const goToNext = () => {
    if (nextQuestionId) router.push(`/solve/${nextQuestionId}`);
  };

  if (!question) return <LoadingPage />;

  return (
    <SolveLayout
      title={question.title}
      difficulty={question.difficulty}
      isSolved={solved.includes(question._id)}
      onPrev={goToPrev}
      onNext={goToNext}
      disablePrev={!prevQuestionId}
      disableNext={!nextQuestionId}
      allQuestions={allQuestions}
    >
      <div className="w-full h-screen bg-white">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* LEFT PANEL */}
          <ResizablePanel minSize={30} defaultSize={45}>
            <div
              className="p-6 h-full overflow-y-auto bg-cyan-950 text-white space-y-6"
              style={{
                backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
                backgroundSize: "40px 40px",
              }}
            >
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                  <FileQuestionIcon className="w-5 h-5" />
                  {question.title}
                </h1>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[160px] bg-cyan-900 text-white border-cyan-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/${lang.id}.png`}
                            alt={lang.name}
                            width={20}
                            height={20}
                          />
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <Card className="mb-4">
                <CardHeader className="flex items-center gap-2">
                  <BookIcon className="w-5 h-5 text-primary" />
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm text-black">
                    {question.description}
                  </p>
                </CardContent>
              </Card>

              {/* Examples */}
              <Card className=" border-cyan-700">
                <CardHeader className="flex items-center gap-2">
                  <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.isArray(question.examples) ? (
                    question.examples.map((ex: any, i: number) => (
                      <div key={i}>
                        <p className="text-sm font-medium  mb-1">
                          Example {i + 1}
                        </p>
                        <pre className="bg-muted/80 p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
                          Input: {ex.input}
                          {"\n"}Output: {ex.output}
                          {ex.explanation && `\nExplanation: ${ex.explanation}`}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <p className="text-red-400 text-sm">
                      Invalid examples format
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Test Cases */}
              {Array.isArray(question.testCases) &&
                question.testCases.length > 0 && (
                  <Card className=" border-cyan-700">
                    <CardHeader className="flex items-center gap-2">
                      <AlertCircleIcon className="w-5 h-5 " />
                      <CardTitle>Test Cases</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {question.testCases.map((tc: any, i: number) => (
                        <pre
                          key={i}
                          className="bg-muted/80 p-3 rounded-md font-mono whitespace-pre-wrap"
                        >
                          Test Case {i + 1}:{"\n"}Input: {tc.input}
                          {"\n"}Output: {tc.output}
                        </pre>
                      ))}
                    </CardContent>
                  </Card>
                )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* RIGHT PANEL */}
          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={70}>
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme="vs-light"
                  onChange={(val) => setCode(val || "")}
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    wordWrap: "on",
                    automaticLayout: true,
                  }}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Output Panel */}
              <ResizablePanel defaultSize={30}>
                <div className="h-full bg-gray-100 p-4 space-y-4 overflow-y-auto">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRunCode}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ▶ Run Code
                    </Button>
                    <Button variant="secondary" className="ml-2 bg-neutral-200">
                      Submit
                    </Button>
                  </div>
                  <div className="bg-white p-3 rounded text-sm font-mono border">
                    <p className="font-semibold text-gray-600 mb-1">Output:</p>
                    <pre>{output}</pre>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SolveLayout>
  );
}
