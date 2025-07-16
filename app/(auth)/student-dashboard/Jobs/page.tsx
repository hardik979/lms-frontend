import { Lock } from "lucide-react";

const JobsPage = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4 text-white">
      <Lock className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        This feature is currently <span className="text-red-400">locked</span>
      </h1>
      <p className="text-slate-300 max-w-md">
        Please ask your teacher to enable job board access for you.
      </p>
    </div>
  );
};

export default JobsPage;
