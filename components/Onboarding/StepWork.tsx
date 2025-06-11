// components/Onboarding/StepWork.tsx
import { useForm } from "react-hook-form";

export default function StepWork({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Work Exp", data);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-800">
        Work Experience 💼
      </h2>

      <div>
        <label className="block text-cyan-900 mb-1">Current Job Title</label>
        <input
          {...register("jobTitle")}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-cyan-900 mb-1">Company</label>
          <input
            {...register("company")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-cyan-900 mb-1">
            Years of Experience
          </label>
          <input
            {...register("experience")}
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prev}
          className="text-cyan-700 hover:underline"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
        >
          Next →
        </button>
      </div>
    </form>
  );
}
