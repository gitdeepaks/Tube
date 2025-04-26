import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export const StudioSidebarHeader = () => {
  const { user } = useUser();

  const { state } = useSidebar();

  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-10 h-4" />
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="your profile">
          <Link prefetch href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl}
              name={user?.fullName ?? "User"}
              size="2xl"
              className="hover:opacity-75 transition-opacity duration-200"
            />
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href="/users/current">
        <UserAvatar
          imageUrl={user?.imageUrl}
          name={user?.fullName ?? "User"}
          size="2xl"
          className="hover:opacity-75 transition-opacity duration-200"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">{user?.fullName}</p>
        <p className="text-xs text-muted-foreground">Your Profile</p>
      </div>
    </SidebarHeader>
  );
};
