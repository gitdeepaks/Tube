import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export const VideoReactions = () => {
  const viewerReactions: "like" | "dislike" = "like";

  return (
    <div className="flex items-center flex-none">
      <Button
        className={cn(
          "rounded-l-full rounded-r-none gap-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          viewerReactions === "like" && "bg-gray-100 dark:bg-gray-800"
        )}
        variant="ghost"
        size="sm"
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            viewerReactions === "like" && "fill-black dark:fill-white"
          )}
        />
        <span className="text-sm font-medium">{1}</span>
      </Button>
      <Separator orientation="vertical" className="h-7 " />
      <Button
        className={cn(
          "rounded-l-none rounded-r-full gap-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          viewerReactions !== "like" && "bg-gray-100 dark:bg-gray-800"
        )}
        variant="ghost"
        size="sm"
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            viewerReactions !== "like" && "fill-black dark:fill-white"
          )}
        />
        <span className="text-sm font-medium">{1}</span>
      </Button>
    </div>
  );
};

// 43:18
