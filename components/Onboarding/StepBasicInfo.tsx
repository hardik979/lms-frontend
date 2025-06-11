// components/Onboarding/StepBasicInfo.tsx
import { useForm } from "react-hook-form";

export default function StepBasicInfo({ next }: { next: () => void }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Basic Info", data);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-800">
        Let’s start with some basic info 📄
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-cyan-900">Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-900">Mobile</label>
          <input
            {...register("mobile", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-cyan-900">Email</label>
          <input
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-900">City/District</label>
          <input
            {...register("city")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-cyan-900">Address</label>
        <input
          {...register("address")}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-cyan-900">State</label>
          <input
            {...register("state")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-cyan-900">Postal Code</label>
          <input
            {...register("pin")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-cyan-900">
            English Proficiency
          </label>
          <select
            {...register("english")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Fluent</option>
          </select>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}
