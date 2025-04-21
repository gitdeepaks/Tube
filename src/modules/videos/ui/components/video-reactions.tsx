import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";
import { VideoGetOneOutput } from "../../types";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      toast.error("something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn({ redirectUrl: window.location.href });
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      toast.error("something went wrong");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn({ redirectUrl: window.location.href });
      }
    },
  });
  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className={cn(
          "rounded-l-full rounded-r-none gap-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          viewerReaction === "like" && "bg-gray-100 dark:bg-gray-800"
        )}
        variant="ghost"
        size="sm"
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            viewerReaction === "like" && "fill-black dark:fill-white"
          )}
        />
        <span className="text-sm font-medium">{likes}</span>
      </Button>
      <Separator orientation="vertical" className="h-7 " />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className={cn(
          "rounded-l-none rounded-r-full gap-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer",
          viewerReaction === "dislike" && "bg-gray-100 dark:bg-gray-800"
        )}
        variant="ghost"
        size="sm"
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            viewerReaction === "dislike" && "fill-black dark:fill-white"
          )}
        />
        <span className="text-sm font-medium">{dislikes}</span>
      </Button>
    </div>
  );
};

// 43:18
