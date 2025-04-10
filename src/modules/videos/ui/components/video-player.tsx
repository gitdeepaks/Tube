"use client";
import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK_URL } from "../../contants";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  // Ensure we have a valid URL
  const validThumbnailUrl =
    thumbnailUrl && thumbnailUrl.startsWith("http")
      ? thumbnailUrl
      : THUMBNAIL_FALLBACK_URL;

  return (
    <div className="aspect-video overflow-hidden relative">
      <MuxPlayer
        playbackId={playbackId}
        poster={validThumbnailUrl}
        playerInitTime={0}
        thumbnailTime={0}
        onPlay={onPlay}
        autoPlay={autoPlay}
        className="w-full h-full object-contain"
        accentColor="#ff2056"
      />
    </div>
  );
};
