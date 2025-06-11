// components/Onboarding/StepEducation.tsx
import { useForm } from "react-hook-form";

export default function StepEducation({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Education", data);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-800">Education Info 🎓</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-cyan-900 mb-1">
            Highest Qualification
          </label>
          <input
            {...register("qualification")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-cyan-900 mb-1">College Name</label>
          <input
            {...register("college")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-cyan-900 mb-1">Graduation Year</label>
          <input
            {...register("gradYear")}
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-cyan-900 mb-1">Stream</label>
          <input
            {...register("stream")}
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
