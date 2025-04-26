"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import {
  SubscriptionItem,
  SubscriptionItemSkeleton,
} from "../subscription-item";

export const SubscriptionsSections = () => {
  return (
    <Suspense fallback={<SubscriptionsSectionsSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <SubscriptionsSectionsSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscriptionsSectionsSuspense = () => {
  const utils = trpc.useUtils();

  const [subscriptions, { fetchNextPage, hasNextPage, isFetchingNextPage }] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Unsubscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: data.creatorId });
    },
    onError: () => {
      toast.error("Failed to unsubscribe");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {subscriptions.pages.flatMap((page) =>
          page.items.map((item) => (
            <Link prefetch href={`/users/${item.user.id}`} key={item.creatorId}>
              <SubscriptionItem
                name={item.user.name}
                imageUrl={item.user.imageUrl}
                subscriberCount={item.user.subscriberCount}
                onUnsubscribe={() =>
                  unsubscribe.mutate({ userId: item.creatorId })
                }
                disabled={unsubscribe.isPending}
              />
            </Link>
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

const SubscriptionsSectionsSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <SubscriptionItemSkeleton key={index} />
        ))}
      </div>
    </>
  );
};
