import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "./subscription-button";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subscriberCount: number;
  onUnsubscribe: () => void;
  disabled: boolean;
}

export const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-1 h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
};

export const SubscriptionItem = ({
  name,
  imageUrl,
  subscriberCount,
  onUnsubscribe,
  disabled,
}: SubscriptionItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar imageUrl={imageUrl} name={name} size="lg" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="">
            <h3 className="text-sm font-medium">{name}</h3>
            <p className="text-xs text-gray-500">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>
          <SubscriptionButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};
