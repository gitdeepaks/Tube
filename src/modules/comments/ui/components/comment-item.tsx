import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CommentsGetMany } from "../../types";

interface CommentItemProps {
  comment: CommentsGetMany["items"][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();
  const utils = trpc.useUtils();
  const removeComment = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to delete comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const handleDeleteComment = () => {
    removeComment.mutate({ id: comment.id });
  };

  const handleLikeComment = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to like comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const handleDislikeComment = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Failed to dislike comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="flex gap-4">
      <Link href={`/users/${comment.userId}`} className="flex-shrink-0">
        <UserAvatar
          imageUrl={comment.user.imageUrl}
          name={comment.user.name}
          size="lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/users/${comment.userId}`} className="font-medium text-sm">
          <span className="text-foreground">{comment.user.name}</span>
          <span className="text-muted-foreground text-xs ml-1">
            {formatDistanceToNow(comment.createdAt, {
              addSuffix: true,
            })}
          </span>
        </Link>
        <p className="text-sm text-foreground">{comment.value}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center">
            <Button
              className="size-7"
              disabled={handleLikeComment.isPending}
              variant="ghost"
              size="icon"
              onClick={() =>
                handleLikeComment.mutate({ commentId: comment.id })
              }
            >
              <ThumbsUpIcon
                className={cn(
                  comment.viewerReaction === "like" && "fill-black"
                )}
              />
            </Button>
            <span className="text-xs text-muted-foreground">
              {comment.likeCount || 0}
            </span>
            <Button
              className="size-7"
              disabled={handleDislikeComment.isPending}
              variant="ghost"
              size="icon"
              onClick={() =>
                handleDislikeComment.mutate({ commentId: comment.id })
              }
            >
              <ThumbsDownIcon
                className={cn(
                  comment.viewerReaction === "dislike" && "fill-black"
                )}
              />
            </Button>
            <span className="text-xs text-muted-foreground">
              {comment.dislikeCount || 0}
            </span>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {}}>
            <MessageSquareIcon className="size-4 mr-2" />
            Reply
          </DropdownMenuItem>
          {comment.user.clerkId === userId && (
            <DropdownMenuItem
              onClick={handleDeleteComment}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
