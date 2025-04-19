import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import { VideoMenu } from "./video-menu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="w-24 h-4 mb-2" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-4 mt-2" />
      </div>
    </div>
  );
};

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, {
      addSuffix: true,
    });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <div className="flex items-start">
        <Link href={`/users/${data.user.id}`} className="flex-shrink-0">
          <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
        </Link>
        <div className="min-w-0 flex-1 ml-3">
          <Link href={`/videos/${data.id}`}>
            <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
              {data.title}
            </h3>
          </Link>
          <Link href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} />
          </Link>
          <Link href={`/videos/${data.id}`}>
            <p className="text-sm text-gray-500 line-clamp-1">
              {compactViews} views • {compactDate}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
