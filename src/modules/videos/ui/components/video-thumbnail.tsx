import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK_URL } from "../../contants";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  // Ensure we have valid URLs
  const validImageUrl =
    imageUrl && imageUrl.startsWith("http") ? imageUrl : THUMBNAIL_FALLBACK_URL;

  const validPreviewUrl =
    previewUrl && previewUrl.startsWith("http")
      ? previewUrl
      : THUMBNAIL_FALLBACK_URL;

  return (
    <div className="relative group">
      {/* Thumbnail Wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={validImageUrl}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={validPreviewUrl}
          alt={title}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      {/* Duration box */}

      {/* TODO: Add Video Duration  box*/}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-1 py-0.5 rounded font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
