"use client";
import "../app/globals.css";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { useRef } from "react";

const successStories = [
  {
    name: "Anjali Pandey",
    company: "IPG Mediabrands",
    image: "/anjali.jpg",
    quote:
      "IT Jobs Factory helped me launch my career with confidence and strong mentorship.",
    package: "9 LPA",
  },
  {
    name: "Rishi Swarnkar",
    company: "Northern Trust",
    image: "/Rishi.jpeg",
    quote:
      "The practical training and job readiness sessions at IT Jobs Factory prepared me for real-world success.",
    package: "8.4 LPA",
  },
  {
    name: "Shalini Rajpal",
    company: "Citius Tech",
    image: "/shalini.jpeg",
    quote:
      "The structured curriculum and real-world projects at IT Jobs Factory gave me the confidence to thrive in my new role.",
    package: "7.0 LPA",
  },
  {
    name: "Prabhanshu Mishra",
    company: "Northern Trust",
    image: "/Prabhanshu.jpeg",
    quote:
      "IT Jobs Factory’s mentorship and career support helped me crack interviews and start strong in the tech industry.",
    package: "6.0 LPA",
  },
  {
    name: "Vipin Gupta",
    company: "Quality Kiosk",
    image: "/vipin.JPG",
    quote:
      "Hands-on training and personalized guidance at IT Jobs Factory made all the difference in landing my job.",
    package: "6.0 LPA",
  },
  {
    name: "Rishabh Upadhyay",
    company: "Clover Infotech",
    image: "/rishabh.jpeg",
    quote:
      "From resume building to real project exposure, IT Jobs Factory prepared me thoroughly for the tech workforce.",
    package: "6.0 LPA",
  },
  {
    name: "Akshay Jatav",
    company: "Computhing",
    image: "/akshay.jpeg",
    quote:
      "The experience at IT Jobs Factory was transformative — it turned my passion for tech into a professional career.",
    package: "5.6 LPA",
  },
];

export default function SuccessCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-cyan-50 text-cyan-900 px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Success{" "}
          <span className="text-sky-500 underline underline-offset-4">
            Stories
          </span>
        </h2>
        <p className="text-sm text-cyan-700 max-w-xl mx-auto mt-2">
          Meet our graduates who secured new jobs and experienced salary hikes.
        </p>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 no-scrollbar"
        >
          {successStories.map((story, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[300px] bg-white border border-cyan-100 rounded-xl shadow-md flex flex-col"
            >
              <div className="h-52 w-full bg-gradient-to-b from-cyan-600 to-sky-400 rounded-t-xl overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col gap-2 flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base">{story.name}</p>
                    <p className="text-sm text-cyan-600">{story.company}</p>
                  </div>
                  <IconBrandLinkedin size={20} className="text-cyan-600" />
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {story.quote}
                </p>

                <p className="text-sm text-cyan-800 font-medium mt-1">
                  Package:{" "}
                  <span className="font-semibold">{story.package}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => scroll("left")}
            className="bg-cyan-100 hover:bg-cyan-200 p-2 rounded-full"
          >
            <IconArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-cyan-100 hover:bg-cyan-200 p-2 rounded-full"
          >
            <IconArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
