"use client";

import Image from "next/image";

const students = [
  {
    name: "Arkopravo Pradhan",
    role: "Data Analyst",
    hike: "Placed At",
    company: "TATA STEEL",
    tags: ["Tech Background", "Fresher", "Data Science"],
    quote:
      "AlmaBetter is the perfect place to start if you want a robust data science program",
    image: "/students/1.jpg", // replace with your local or hosted image
  },
  {
    name: "Soumyajit Das",
    role: "Business Analyst",
    hike: "110% Hike",
    company: "TCS",
    tags: ["Tech Background", "Working Professional", "Data Science"],
    quote: "A Journey that completely changed my life.",
    image: "/students/2.jpg",
  },
  {
    name: "Sharad Tawade",
    role: "System Engineer",
    hike: "75% Hike",
    company: "Tech Mahindra",
    tags: ["Tech Background", "Working Professional", "Data Science"],
    quote:
      "AlmaBetter’s Mentors are highly skilled and support you at every stage.",
    image: "/students/3.jpg",
  },
  {
    name: "Arkopravo Pradhan",
    role: "Data Analyst",
    hike: "Placed At",
    company: "TATA STEEL",
    tags: ["Tech Background", "Fresher", "Data Science"],
    quote:
      "AlmaBetter is the perfect place to start if you want a robust data science program",
    image: "/students/1.jpg", // replace with your local or hosted image
  },
  {
    name: "Soumyajit Das",
    role: "Business Analyst",
    hike: "110% Hike",
    company: "TCS",
    tags: ["Tech Background", "Working Professional", "Data Science"],
    quote: "A Journey that completely changed my life.",
    image: "/students/2.jpg",
  },
  {
    name: "Sharad Tawade",
    role: "System Engineer",
    hike: "75% Hike",
    company: "Tech Mahindra",
    tags: ["Tech Background", "Working Professional", "Data Science"],
    quote:
      "AlmaBetter’s Mentors are highly skilled and support you at every stage.",
    image: "/students/3.jpg",
  },
  // Add more...
];

export default function SuccessStoriesGrid() {
  return (
    <section className="bg-white text-black px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Take a peek into the{" "}
          <span className="text-red-600 underline underline-offset-4">
            journeys of our students
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {students.map((s, i) => (
          <div
            key={i}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="relative h-52 w-full bg-red-500">
              <Image src={s.image} alt={s.name} fill className="object-cover" />
              <div className="absolute bottom-0 w-full bg-black/40 text-white p-3">
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs opacity-90">{s.role}</div>
                <div className="text-[10px] bg-white text-black inline-block mt-1 px-2 py-0.5 rounded-full">
                  {s.hike}
                </div>
                <div className="text-xs text-white mt-1 font-bold">
                  {s.company}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {s.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-800 mb-4">{s.quote}</p>
              <a
                href="#"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
