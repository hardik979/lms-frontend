"use client";
import dynamic from "next/dynamic";

// Dynamically import <mux-player> to avoid SSR issues
const MuxPlayer = dynamic(
  () => import("@mux/mux-player-react").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function VideoPlayer({ playbackId }: { playbackId: string }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay={false}
      primaryColor="#0e7490"
      style={{ width: "100%", aspectRatio: "16/9", borderRadius: "8px" }}
    />
  );
}
