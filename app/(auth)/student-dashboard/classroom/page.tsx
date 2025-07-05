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
          <Link href="/Onboarding"> </Link>
        </div>

        <div className="mt-6"></div>

        <div className="mt-10 flex justify-center text-center text-cyan-50 text-lg font-medium">
          Starting Soon !
        </div>
      </section>
    </div>
  );
};

export default ClassroomPage;
