"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingPage() {
  return (
    <div className="h-screen  bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex  flex-col justify-center items-center px-4">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/6d42cfa9-89ad-4001-a4fb-0822238226f4/UK9Y1BDXTm.lottie"
          loop
          autoplay
          speed={1.8}
        />
      </div>

      <p className=" text-cyan-100 text-lg md:text-xl font-semibold animate-pulse">
        Just a moment...
      </p>
    </div>
  );
}
