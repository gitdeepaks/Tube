import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const userInfoVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4",
      lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
      sm: "[&_p]:text-xs [&_svg]:size-3.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserInfoProps extends VariantProps<typeof userInfoVariants> {
  name: string;
  className?: string;
  imageUrl?: string;
}

export const UserInfo = ({
  name,
  className,
  size,
  imageUrl,
}: UserInfoProps) => {
  return (
    <div className={cn(userInfoVariants({ size, className }))}>
      {imageUrl && <UserAvatar imageUrl={imageUrl} name={name} size={size} />}
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-gray-500 hover:text-gray-800 line-clamp-1">
            {name}
          </p>
        </TooltipTrigger>
        <TooltipContent align="center" className="bg-gray-600">
          <p className="text-white">{name}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
