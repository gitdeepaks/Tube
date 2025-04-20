"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
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

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = (props: ResultsSectionProps) => {
  return (
    <Suspense
      key={`${props.query}-${props.categoryId}`}
      fallback={<ResultsSectionSkeleton />}
    >
      <ErrorBoundary fallback={<div>Error</div>}>
        <ResultsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultsSectionSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 gap-y-10 md:flex">
        {Array.from({ length: 10 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>

      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 10 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

export const ResultsSectionSuspense = ({
  query,
  categoryId,
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, queryInfo] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      limit: DEFAULT_LIMIT,
      categoryId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((item) => (
              <VideoGridCard key={item.id} data={item} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((item) => (
              <VideoRowCard key={item.id} data={item} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={queryInfo.hasNextPage}
        isFetchingNextPage={queryInfo.isFetchingNextPage}
        fetchNextPage={queryInfo.fetchNextPage}
      />
    </>
  );
};
