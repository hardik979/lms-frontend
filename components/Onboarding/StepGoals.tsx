// components/Onboarding/StepGoals.tsx
import { useForm } from "react-hook-form";

export default function StepGoals({
  next,
  prev,
}: {
  next: () => void;
  prev: () => void;
}) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Goals", data);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-800">Career Goals 🎯</h2>

      <div>
        <label className="block text-cyan-900 mb-1">
          What are you aiming for?
        </label>
        <textarea
          {...register("goal")}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
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
