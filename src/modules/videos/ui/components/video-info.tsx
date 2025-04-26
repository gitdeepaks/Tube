import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

// Client-side only component for date formatting
const ClientDateFormatter = ({ date }: { date: Date }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      formatDistanceToNow(date, {
        addSuffix: true,
      })
    );
  }, [date]);

  return <>{formattedDate}</>;
};

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(data.viewCount);
  }, [data.viewCount]);

  const createdAt = new Date(data.createdAt);
  const initialDate = createdAt.toLocaleDateString();

  return (
    <div className="flex gap-3">
      <div className="flex items-start">
        <Link
          prefetch
          href={`/users/${data.user.id}`}
          className="flex-shrink-0"
        >
          <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
        </Link>
        <div className="min-w-0 flex-1 ml-3">
          <Link prefetch href={`/videos/${data.id}`}>
            <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
              {data.title}
            </h3>
          </Link>
          <Link prefetch href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} />
          </Link>
          <Link prefetch href={`/videos/${data.id}`}>
            <p className="text-sm text-gray-500 line-clamp-1">
              {compactViews} views •{" "}
              <span suppressHydrationWarning>{initialDate}</span>
              <span className="hidden md:inline">
                {" "}
                <ClientDateFormatter date={createdAt} />
              </span>
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
