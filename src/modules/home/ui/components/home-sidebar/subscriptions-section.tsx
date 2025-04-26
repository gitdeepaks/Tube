"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LoadingSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <SidebarMenuItem key={item} className="flex items-center gap-4">
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
export const SubscriptionsSection = () => {
  const pathname = usePathname();
  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your subscriptions</SidebarGroupLabel>
      <SidebarContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading &&
            data?.pages
              .flatMap((page) => page.items)
              .map((subscription) => (
                <SidebarMenuItem
                  key={`${subscription.creatorId}-${subscription.viewerId}`}
                >
                  <SidebarMenuButton
                    tooltip={subscription.user.name}
                    asChild
                    isActive={pathname === `/users/${subscription.user.id}`}
                  >
                    <Link
                      prefetch
                      href={`/users/${subscription.user.id}`}
                      className="flex items-center gap-4"
                    >
                      <UserAvatar
                        imageUrl={subscription.user.imageUrl}
                        name={subscription.user.name}
                        size="xs"
                      />
                      <span className="text-sm">{subscription.user.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/subscriptions"}
              >
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-4"
                >
                  <ListIcon className="size-4" />
                  <span className="text-sm">Subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </SidebarGroup>
  );
};
