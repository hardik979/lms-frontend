"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingPage() {
  return (
    <div className="h-screen bg-cyan-950 flex flex-col justify-center items-center px-4">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/e88ec521-f92c-4a91-9932-81f5e8e2e481/jbCNOIHfLK.lottie"
          loop
          autoplay
        />
      </div>

      <p className=" text-cyan-100 text-lg md:text-xl font-semibold animate-pulse">
        Just a moment...
      </p>
    </div>
  );
}
