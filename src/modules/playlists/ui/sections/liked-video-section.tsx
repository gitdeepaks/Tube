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

export const LikedVideoSection = () => {
  return (
    <Suspense fallback={<LikedVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <LikedVideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedVideoSectionSuspense = () => {
  const [data, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    trpc.playlists.getLiked.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {data.pages.flatMap((page) =>
          page.items.map((item) => <VideoGridCard key={item.id} data={item} />)
        )}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {data.pages.flatMap((page) =>
          page.items.map((item) => (
            <VideoRowCard key={item.id} data={item} size="compact" />
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

const LikedVideoSectionSkeleton = () => {
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
