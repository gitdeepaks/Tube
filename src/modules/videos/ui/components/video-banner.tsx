import { AlertTriangle } from "lucide-react";
import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status === "ready") return null;
  return (
    <div className="bg-yellow-300 py-3 px-4 rounded-b-xl flex items-center gap-2">
      <AlertTriangle className="size-4 text-black shrink-0" />
      <p className="text-black text-xs md:text-sm font-medium line-clamp-1">
        Your video is processing. Please check back in a few minutes.
      </p>
    </div>
  );
};
