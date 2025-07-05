import { useEffect } from "react";
import Hls from "hls.js";

export default function HLSPlayer({
  src,
  videoRef,
  onPause,
  onEnded,
}: {
  src: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPause: () => void;
  onEnded: () => void;
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src; // Safari fallback
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src, videoRef]);

  return (
    <video
      ref={videoRef}
      controls
      onPause={onPause}
      onEnded={onEnded}
      className="w-full h-full max-w-6xl max-h-[80vh] object-contain"
      controlsList="nodownload"
    />
  );
}
