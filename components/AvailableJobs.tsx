"use client";

import { useState, useEffect, useRef } from "react";
import { IconBrandLinkedin } from "@tabler/icons-react";
import LoadingPage from "./Loader";

type JobItem = {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string;
  job_country: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
};

const jobTypes = ["Remote", "Onsite", "Hybrid"];
const domains = [
  "Data Science",
  "Web Development",
  "AI",
  "Analytics",
  "Production support",
];

export default function JobBoardPage() {
  const [location, setLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const lastQueryRef = useRef<string>("");

  const buildQuery = () => {
    let base = "production support";
    if (selectedJobType) base += ` ${selectedJobType}`;
    if (selectedDomain) base += ` ${selectedDomain}`;
    if (location.trim()) base += ` in ${location.trim()}`;
    return base;
  };

  const fetchJobs = async () => {
    const query = buildQuery();
    if (query === lastQueryRef.current) return;

    setLoading(true);
    lastQueryRef.current = query;

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      query
    )}&page=1&num_pages=1&country=in&date_posted=week`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "34d3dc6e0bmsh1a19e1668998e51p1f20b1jsnf6d34a1fb60a",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });
      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedJobType, selectedDomain]);

  return (
    <div className=" bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen flex flex-col md:flex-row text-white">
      {/* Sidebar */}
      <aside className="md:w-72 w-full p-6  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-cyan-800">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru"
            className="w-full border rounded px-3 py-2 text-sm text-white bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <button
            onClick={fetchJobs}
            className="mt-2 bg-cyan-600 text-white text-sm px-3 py-1 rounded hover:bg-cyan-700"
          >
            Search
          </button>
        </div>

        {/* Job Type Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Job Location Type
          </label>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedJobType(type === selectedJobType ? null : type)
                }
                className={`text-sm px-3 py-1 rounded-full border ${
                  selectedJobType === type
                    ? "bg-cyan-600 text-white"
                    : "bg-cyan-900 text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Domain</label>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() =>
                  setSelectedDomain(domain === selectedDomain ? null : domain)
                }
                className={`text-sm px-3 py-1 rounded-full border ${
                  selectedDomain === domain
                    ? "bg-cyan-600 text-white"
                    : "bg-cyan-900 text-white"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-cyan-100 mb-6 underline">
          Job Openings
        </h1>

        {loading ? (
          <LoadingPage />
        ) : jobs.length === 0 ? (
          <p className="text-cyan-300">No jobs found for current filters.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6 rounded-2xl border border-cyan-700 shadow-lg transition hover:scale-[1.01] hover:shadow-xl"
              >
                {/* Job Title */}
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{job.job_title}</h2>
                    <p className="text-sm text-cyan-200 mt-1">
                      {job.employer_name}
                    </p>
                    <p className="text-sm text-cyan-300">
                      {job.job_city}, {job.job_country}
                    </p>
                  </div>
                  <div className="text-xs text-cyan-400">
                    {new Date(
                      job.job_posted_at_datetime_utc
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedDomain && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow">
                      {selectedDomain}
                    </span>
                  )}
                  {selectedJobType && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow">
                      {selectedJobType}
                    </span>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="mt-2">
                  <a
                    href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
                      job.job_title + " " + job.employer_name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline"
                  >
                    <IconBrandLinkedin size={18} />
                    View on LinkedIn
                  </a>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3 flex-wrap">
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm rounded-xl shadow"
                    rel="noreferrer"
                  >
                    Apply
                  </a>
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    className="border border-cyan-500 text-cyan-300 hover:bg-cyan-800 px-4 py-2 text-sm rounded-xl"
                    rel="noreferrer"
                  >
                    View JD
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
