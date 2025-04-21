"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const SubscriptionsVideosSection = () => {
  return (
    <Suspense fallback={<SubscriptionsVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <SubscriptionsVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscriptionsVideosSectionSuspense = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.videos.getManySubscribed.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
        {data?.pages.flatMap((page) =>
          page.items.map((item) => <VideoGridCard key={item.id} data={item} />)
        )}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

const SubscriptionsVideosSectionSkeleton = () => {
  return (
    <div>
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
