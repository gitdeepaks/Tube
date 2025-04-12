import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

export const VideoReactions = () => {
  const viewerReactions: "like" | "dislike" = "like";

  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant="ghost"
        size="icon"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReactions === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <Button variant="ghost" size="icon">
        <ThumbsDownIcon
          className={cn("size-5", viewerReactions !== "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};

// 43:18
