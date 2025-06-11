"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import { CODING_QUESTIONS, LANGUAGES } from "@/constants";

// Dynamically import Monaco Editor
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type LanguageId = (typeof LANGUAGES)[number]["id"];

type CodingQuestion = {
  id: string;
  title: string;
  description: string;
  starterCode: Record<LanguageId, string>;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
};

export default function LeetCodePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion>(
    CODING_QUESTIONS[0]
  );
  const [language, setLanguage] = useState<LanguageId>(LANGUAGES[0].id);
  const [code, setCode] = useState<string>(
    selectedQuestion.starterCode[language]
  );
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    setCode(selectedQuestion.starterCode[language]);
  }, [selectedQuestion, language]);

  const handleRunCode = () => {
    // TODO: Connect to Judge0 here
    setOutput("👀 Output placeholder — integrate Judge0 to run actual code.");
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-4rem)]"
    >
      {/* LEFT: PROBLEM */}
      <ResizablePanel minSize={35} defaultSize={45}>
        <div
          className="p-6 overflow-y-auto  bg-cyan-950 h-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="flex justify-between mb-4 gap-3">
            <Select
              value={selectedQuestion.id}
              onValueChange={(id) =>
                setSelectedQuestion(CODING_QUESTIONS.find((q) => q.id === id)!)
              }
            >
              <SelectTrigger className="w-[200px] text-white">
                <SelectValue placeholder="Select Question" />
              </SelectTrigger>
              <SelectContent>
                {CODING_QUESTIONS.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={language}
              onValueChange={(l: LanguageId) => setLanguage(l)}
            >
              <SelectTrigger className="w-[160px] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    <div className="flex items-center gap-2">
                      <img
                        src={`/${lang.id}.png`}
                        alt={lang.name}
                        className="w-5 h-5 object-contain"
                      />
                      {lang.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPTION */}
          <Card className="mb-6">
            <CardHeader className="flex items-center gap-2">
              <BookIcon className="w-5 h-5 text-primary" />
              <CardTitle>{selectedQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {selectedQuestion.description}
              </p>
            </CardContent>
          </Card>

          {/* EXAMPLES */}
          <Card className="mb-6">
            <CardHeader className="flex items-center gap-2">
              <LightbulbIcon className="w-5 h-5 text-yellow-500" />
              <CardTitle>Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedQuestion.examples.map((example, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium">Example {idx + 1}</p>
                  <pre className="bg-muted/50 p-3 rounded-md font-mono text-sm whitespace-pre-wrap">
                    Input: {example.input}
                    {"\n"}Output: {example.output}
                    {example.explanation &&
                      `\nExplanation: ${example.explanation}`}
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CONSTRAINTS */}
          {Array.isArray(selectedQuestion.constraints) &&
            selectedQuestion.constraints.length > 0 && (
              <Card>
                <CardHeader className="flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 text-blue-500" />
                  <CardTitle>Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                    {selectedQuestion.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* RIGHT: CODE + OUTPUT */}
      <ResizablePanel defaultSize={55}>
        <ResizablePanelGroup direction="vertical">
          {/* Top: CODE EDITOR */}
          <ResizablePanel defaultSize={75}>
            <Editor
              height="100%"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
                padding: { top: 16, bottom: 16 },
              }}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Bottom: RUN / SUBMIT PANEL */}
          <ResizablePanel defaultSize={25}>
            <div className="h-full border-t px-4 py-3 space-y-3 bg-muted overflow-y-auto">
              <div className="flex items-center gap-3">
                <Button onClick={handleRunCode}>Run Code</Button>
                <Button variant="outline">Submit</Button>
              </div>
              <div className="bg-background p-3 rounded text-sm font-mono border">
                <p className="font-medium text-muted-foreground mb-1">
                  Output:
                </p>
                <pre>{output}</pre>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
