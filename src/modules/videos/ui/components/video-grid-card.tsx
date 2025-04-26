import { VideoGetManyOutput } from "@/modules/videos/types";
import Link from "next/link";
import { Suspense } from "react";
import { VideoInfo, VideoInfoSkeleton } from "./video-info";
import { VideoThumbnail, VideoThumbnailSkeleton } from "./video-thumbnail";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
};

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link prefetch href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration ?? 0}
        />
      </Link>

      <Suspense fallback={<VideoInfoSkeleton />}>
        <VideoInfo data={data} onRemove={onRemove} />
      </Suspense>
    </div>
  );
};
