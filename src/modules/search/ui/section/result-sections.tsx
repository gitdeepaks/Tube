"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
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
