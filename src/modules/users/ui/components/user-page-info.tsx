import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { UserGetOneOutput } from "../../types";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <div className="h-[60px] w-[60px] rounded-full bg-muted-foreground/20 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded-full mb-2" />
            <div className="h-4 w-16 bg-muted-foreground/20 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
      {/* Desktop mode */}
      <div className="hidden md:flex items-start gap-4">
        <div className="h-[100px] w-[100px] rounded-full bg-muted-foreground/20 animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-24 bg-muted-foreground/20 animate-pulse rounded-full mb-2" />
          <div className="h-4 w-16 bg-muted-foreground/20 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="py-6">
      {/* Mobile mode */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => {
              if (userId === user.clerkId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <Button
            variant="secondary"
            asChild
            className="w-full mt-3 rounded-full"
          >
            <Link prefetch href="/studio">
              Go to Studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || !isLoaded}
            onClick={onClick}
            isSubscribed={user.viewerSubscribed}
            className="w-full mt-3"
          />
        )}
      </div>
      {/* Desktop mode */}
      <div className="hidden md:flex items-start gap-4">
        <UserAvatar
          size="2xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(
            user.clerkId === userId &&
              "cursor-pointer hover:opacity-75 transition-opacity duration-300"
          )}
          onClick={() => {
            if (userId === user.clerkId) {
              clerk.openUserProfile();
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-semibold">{user.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <span>{user.subscriberCount} subscribers</span>
            <span>&bull;</span>
            <span>{user.videoCount} videos</span>
          </div>
          {userId === user.clerkId ? (
            <Button variant="secondary" asChild className="mt-3 rounded-full">
              <Link prefetch href="/studio">
                Go to Studio
              </Link>
            </Button>
          ) : (
            <SubscriptionButton
              disabled={isPending || !isLoaded}
              onClick={onClick}
              isSubscribed={user.viewerSubscribed}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};
