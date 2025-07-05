"use client";

import { useState } from "react";

type CurriculumItem = {
  id: number;
  title: string;
  addon?: string;
  duration?: string;
  topics: string[];
};

const sqlCurriculum: CurriculumItem[] = [
  {
    id: 1,
    title: "SQL Installation & Introduction",
    addon: "Quick Start Setup & Overview",
    duration: "3 days",
    topics: [
      "Installation",
      "What is DBMS and RDBMS?",
      "Oracle - History and Version",
      "SQL - Case Sensitivity",
      "Batch User Creation",
      "Overview of basic SQL concepts",
    ],
  },
  {
    id: 2,
    title: "Basic SQL Queries",
    addon: "CRUD operations and Query Identification",
    duration: "8 days",
    topics: [
      "DDL - Create, Alter, Drop, Rename",
      "DML - Insert, Update, Delete",
      "TCL - Commit, Rollback",
      "DCL - Grant, Revoke",
      "DQL - Select",
      "Mock test - Query Identification",
    ],
  },
  {
    id: 3,
    title: "SQL Clauses and Datatypes",
    addon: "Foundations of Query Structuring",
    duration: "4 days",
    topics: [
      "SQL Datatypes - Number, Varchar, Char, Date",
      "Where Clause",
      "Having Clause",
      "Group By Clause",
      "Order By Clause",
      "Mock test - Clause based questions",
    ],
  },
  {
    id: 4,
    title: "Introductory SQL Practice",
    addon: "Writing your first SQL",
    duration: "3 days",
    topics: [
      "Selection (all, tab, dual)",
      "SQL Comments",
      "Table Creation",
      "Mock test - SQL Practice",
    ],
  },
  {
    id: 5,
    title: "Operators & Query Types Recap",
    addon: "Hands-on queries with DDL, DML, TCL, etc.",
    duration: "3 days",
    topics: [
      "Table Creation and Insertion",
      "Table Copy",
      "Mock test - DDL, DML, TCL, DCL, DQL Scenarios",
    ],
  },
  {
    id: 6,
    title: "Operators and Set Operations",
    addon: "Real-world operations with conditionals",
    duration: "4 days",
    topics: [
      "Arithmetic, Comparison, Logical Operators",
      "Set Operations - Union, Intersect, Minus",
      "Row to Column and vice versa",
      "Mock test - Operator Scenarios",
    ],
  },
  {
    id: 7,
    title: "Advanced Functions & Aliases",
    addon: "Table aliasing and aggregate logic",
    duration: "5 days",
    topics: [
      "SQL Alias - Table & Column",
      "Window Analytic Functions",
      "Aggregate Functions, Group By, Having",
      "Pseudo Columns, Dense Rank()",
      "Mock test - Analytic Functions",
    ],
  },
  {
    id: 8,
    title: "Joins & Subqueries",
    addon: "Mastering SQL Relationships",
    duration: "6 days",
    topics: [
      "Inner, Self, Outer, Cross, Natural Joins",
      "Mock test - Record Calculation with Joins",
      "Nested, Correlated & Inline Subqueries",
      "Mock test - Subquery Scenarios",
    ],
  },
  {
    id: 9,
    title: "String & Date Functions",
    addon: "Transforming & cleaning data",
    duration: "1 day",
    topics: [
      "Upper, Lower, instr, substr, replace, case, concat, trim, ltrim, rtrim, rpad, lpad, nvl, round, trunc, to_number, to_char, to_date",
    ],
  },
  {
    id: 10,
    title: "Constraints, Indexing & Views",
    addon: "Performance Optimization",
    duration: "4 days",
    topics: [
      "Constraints (PRIMARY, FOREIGN, NULL, UNIQUE, CHECK)",
      "Mock test - Constraints",
      "Index - B Tree, Bitmap, Function Based",
      "Explain Plan Reading",
      "Views vs Materialized Views",
    ],
  },
  {
    id: 11,
    title: "Data Export & Import",
    addon: "Backup & Restore using impdp/expdp",
    duration: "1 day",
    topics: ["Data Import/Export using impdp, expdp"],
  },
];

const linuxCurriculum: CurriculumItem[] = [
  {
    id: 1,
    title: "Linux Basics & Commands",
    addon: "Core Linux foundation",
    duration: "4 days",
    topics: [
      "Installation and History of Linux - Setting up your first environment",
      "Basic commands - Essential file & directory operations",
      "File System Navigation & Maintenance - Understanding directory hierarchy",
      "File System Display Commands - Listing contents efficiently",
      "List commands filesystem - Managing files with ls variations",
    ],
  },
  {
    id: 2,
    title: "Search, Edit & Text Processing",
    addon: "Grep, Wildcards, Sed & Awk",
    duration: "4 days",
    topics: [
      "Grep command - Searching patterns in files",
      "Wildcards edition - Flexible filename matching",
      "Sed command - In-place text replacements",
      "Awk command - Field-level data manipulation",
      "Cut, Sort, Uniq commands - Organizing and cleaning text data",
    ],
  },
  {
    id: 3,
    title: "User & Permission Management",
    addon: "Secure multi-user management",
    duration: "3 days",
    topics: [
      "User Management tasks - Creating and deleting users",
      "File Permissioning commands - chmod, chown, chgrp basics",
      "User & Link Management - Hard & soft links essentials",
    ],
  },
  {
    id: 4,
    title: "System Tools & Monitoring",
    addon: "System info and performance monitoring",
    duration: "3 days",
    topics: [
      "Diff command, Cmp command - Comparing file contents",
      "User Session & System Monitoring Commands - w, who, uptime",
      "System Identity & Info Commands - uname, hostname",
      "File System & Disk Utilities - df, du usage",
    ],
  },
  {
    id: 5,
    title: "Advanced Shell Commands",
    addon: "Master essential Linux utilities",
    duration: "3 days",
    topics: [
      "Find command - Locating files with advanced criteria",
      "Locate and updatedb - Quick file location database",
      "xargs command - Batch command execution",
      "tee command - Redirecting and duplicating output",
      "head and tail utilities - Previewing file beginnings & ends",
    ],
  },
  {
    id: 6,
    title: "Linux Processes & Jobs",
    addon: "Manage foreground & background tasks",
    duration: "3 days",
    topics: [
      "ps, top, htop - Process monitoring tools overview",
      "bg, fg, jobs, kill, pkill - Managing job states",
      "nice & renice - Adjusting process priorities",
      "Process monitoring with pgrep and pstree - Visualizing process trees",
    ],
  },
  {
    id: 7,
    title: "Package Management & System Updates",
    addon: "Install, remove, and update software",
    duration: "2 days",
    topics: [
      "apt, yum, dnf basics - Installing & removing packages",
      "Software repositories - Managing sources for software",
      "Managing dependencies - Resolving conflicts and requirements",
      "Updating and upgrading packages - Keeping your system current",
    ],
  },
  {
    id: 8,
    title: "Networking Commands & Tools",
    addon: "Configure & troubleshoot networking",
    duration: "4 days",
    topics: [
      "ifconfig & ip commands - Configuring network interfaces",
      "ping, traceroute, netstat - Testing connectivity & routes",
      "ss & nc basics - Socket status and simple TCP/UDP checks",
      "hostname, hosts, and DNS configs - Managing hostnames and name resolution",
    ],
  },
  {
    id: 9,
    title: "Linux Filesystems & Disk Management",
    addon: "Optimize disk usage & manage partitions",
    duration: "3 days",
    topics: [
      "df, du, and lsblk - Checking disk space and block devices",
      "Mounting and unmounting devices - Accessing new storage",
      "Fstab basics - Configuring persistent mounts",
      "Disk quotas - Limiting user disk usage",
    ],
  },
  {
    id: 10,
    title: "Linux Shell Scripting",
    addon: "Automate tasks with Bash scripts",
    duration: "5 days",
    topics: [
      "Shell scripting operators - Building logical expressions",
      "Conditionals (if, if-else, elif) - Branching program flow",
      "Loops (for, while, until) - Automating repetitive tasks",
      "Functions in scripts - Organizing reusable code blocks",
      "Practical automation examples - Writing scripts for real tasks",
    ],
  },
];

export default function JobCurriculumSection() {
  const [selectedCourse, setSelectedCourse] = useState<"sql" | "linux">("sql");
  const [selectedSql, setSelectedSql] = useState<number>(1);
  const activeSql = sqlCurriculum.find((item) => item.id === selectedSql);

  return (
    <section className="bg-cyan-50  [font-family:var(--font-raleway)] text-cyan-900 py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Curriculum and{" "}
          <span className="text-sky-500 underline underline-offset-4">
            Learning Track
          </span>
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setSelectedCourse("sql")}
            className={`px-4 py-2 rounded-md font-semibold border transition-all ${
              selectedCourse === "sql"
                ? "bg-cyan-600 text-white border-cyan-700"
                : "bg-white text-cyan-700 border-cyan-300 hover:border-cyan-500"
            }`}
          >
            SQL
          </button>
          <button
            onClick={() => setSelectedCourse("linux")}
            className={`px-4 py-2 rounded-md font-semibold border transition-all ${
              selectedCourse === "linux"
                ? "bg-cyan-600 text-white border-cyan-700"
                : "bg-white text-cyan-700 border-cyan-300 hover:border-cyan-500"
            }`}
          >
            Linux
          </button>
        </div>
      </div>
      {selectedCourse === "sql" ? (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {sqlCurriculum.map((item) => {
              const isActive = selectedSql === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSql(item.id)}
                  className={`cursor-pointer border p-4 rounded-md transition-all ${
                    isActive
                      ? "bg-white text-cyan-900 border-cyan-600 shadow"
                      : "border-cyan-300 hover:border-cyan-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`font-bold text-lg ${
                        isActive ? "text-cyan-700" : "text-cyan-500"
                      }`}
                    >
                      0{item.id}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isActive ? "text-cyan-900" : "text-cyan-800"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? "text-cyan-700" : "text-cyan-600"
                        }`}
                      >
                        Add-On: {item.addon}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeSql && (
            <div className="bg-white border border-cyan-200 rounded-md p-6 h-fit shadow-sm">
              <div className="flex justify-between mb-4">
                <h4 className="text-lg font-semibold text-cyan-900">Topics</h4>
                <span className="text-sm text-sky-600 font-medium">
                  Duration: {activeSql.duration}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm text-cyan-800">
                {activeSql.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {linuxCurriculum.map((item) => {
              const isActive = selectedSql === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSql(item.id)}
                  className={`cursor-pointer border p-4 rounded-md transition-all ${
                    isActive
                      ? "bg-white text-cyan-900 border-cyan-600 shadow"
                      : "border-cyan-300 hover:border-cyan-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`font-bold text-lg ${
                        isActive ? "text-cyan-700" : "text-cyan-500"
                      }`}
                    >
                      0{item.id}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isActive ? "text-cyan-900" : "text-cyan-800"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? "text-cyan-700" : "text-cyan-600"
                        }`}
                      >
                        Add-On: {item.addon}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {linuxCurriculum.find((i) => i.id === selectedSql) && (
            <div className="bg-white border border-cyan-200 rounded-md p-6 h-fit shadow-sm">
              <div className="flex justify-between mb-4">
                <h4 className="text-lg font-semibold text-cyan-900">Topics</h4>
                <span className="text-sm text-sky-600 font-medium">
                  Duration:{" "}
                  {linuxCurriculum.find((i) => i.id === selectedSql)?.duration}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-2 text-sm text-cyan-800">
                {linuxCurriculum
                  .find((i) => i.id === selectedSql)
                  ?.topics.map((topic, idx) => (
                    <li key={idx}>{topic}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
