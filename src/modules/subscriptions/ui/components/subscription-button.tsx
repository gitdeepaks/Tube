import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface SubscriptionButtonProps {
  onClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn("rounded-full", className)}
      variant={isSubscribed ? "secondary" : "default"}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
