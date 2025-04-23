import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK_URL } from "@/modules/videos/contants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
  title: string;
  imageUrl?: string;
  videoCount: number;
  className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className="relative pt-3">
      <div className="relative">
        <Skeleton className="w-full h-full rounded-xl aspect-video" />
      </div>
    </div>
  );
};

export const PlaylistThumbnail = ({
  imageUrl,
  title,
  videoCount,
  className,
}: PlaylistThumbnailProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(videoCount);
  }, [videoCount]);

  return (
    <div className={cn("relative pt-3", className)}>
      {/* Stack effect layers */}
      <div className="relative">{/* Background layers */}</div>
      <div className="absolute -top-3 left-1.5 -translate-x-1.5 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video" />
      <div className="absolute -top-1.5 left-1.5 -translate-x-1.5 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />
      {/* Main Image */}
      <div className="relative overflow-hidden w-full rounded-xl aspect-video">
        <Image
          src={imageUrl ?? THUMBNAIL_FALLBACK_URL}
          alt={title}
          className="w-full h-full object-cover"
          fill
        />
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/70 group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center justify-center ">
        <div className="flex items-center gap-x-2">
          <PlayIcon className="size-4 text-white fill-current" />
          <span className="text-white text-sm font-medium">Play</span>
        </div>
      </div>
      {/* Video Count */}
      <div className="absolute bottom-2 right-2 flex items-center gap-x-1">
        <ListVideoIcon className="size-4 text-white fill-current" />
        <span className="text-white text-sm font-medium">{compactViews}</span>
        <span className="text-white text-sm font-medium">videos</span>
      </div>
    </div>
  );
};
