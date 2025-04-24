"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideoSectionProps {
  playlistId: string;
}

export const VideoSection = ({ playlistId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <VideoSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ playlistId }: VideoSectionProps) => {
  const utils = trpc.useUtils();
  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    trpc.playlists.getVideos.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        playlistId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const removeVideoFromPlaylist = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`Removed from playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Failed to remove from playlist");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {data.pages.flatMap((page) =>
          page.items.map((item) => (
            <VideoGridCard
              key={item.id}
              data={item}
              onRemove={() =>
                removeVideoFromPlaylist.mutate({ playlistId, videoId: item.id })
              }
            />
          ))
        )}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {data.pages.flatMap((page) =>
          page.items.map((item) => (
            <VideoRowCard
              key={item.id}
              data={item}
              size="compact"
              onRemove={() =>
                removeVideoFromPlaylist.mutate({ playlistId, videoId: item.id })
              }
            />
          ))
        )}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4 md:flex">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};
