import Link from "next/link";

const ClassroomPage = () => {
  return (
    <div>
      <section
        className="bg-cyan-950 rounded-xl font-monsterrat shadow-md p-6 md:p-10 my-10 mx-4 md:mx-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">
              Next Cohort Classroom
            </h2>
            <p className="text-neutral-300 text-sm md:text-base">
              Use this space to join live classes, check class schedule and
              watch recordings of past classes.
            </p>
          </div>
          <Link href="/Onboarding">
            {" "}
            <button className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg font-semibold">
              Continue your application
            </button>
          </Link>
        </div>

        <div className="mt-6">
          <button className="bg-cyan-50 border border-cyan-200 text-cyan-600 px-4 py-1.5 rounded-md font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zM4 8v8h12V8H4z" />
            </svg>
            Next 7 days
          </button>
        </div>

        <div className="mt-10 flex justify-center text-center text-cyan-50 text-lg font-medium">
          Join the course to view class schedule
        </div>
      </section>
    </div>
  );
};

export default ClassroomPage;
