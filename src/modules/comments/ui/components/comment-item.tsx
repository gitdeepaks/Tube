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
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CommentsGetMany } from "../../types";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: CommentsGetMany["items"][number];
  variant?: "reply" | "comment";
}

export const CommentItem = ({
  comment,
  variant = "comment",
}: CommentItemProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();
  const utils = trpc.useUtils();
  const [isReplyinOpen, setIsReplyinOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const replies = trpc.comments.getMany.useQuery(
    {
      videoId: comment.videoId,
      limit: 10,
      parentId: comment.id,
    },
    {
      enabled: isRepliesOpen && variant === "comment",
    }
  );

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
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-3">
        <Link
          prefetch
          href={`/users/${comment.userId}`}
          className="flex-shrink-0"
        >
          <UserAvatar
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
            size={variant === "comment" ? "lg" : "sm"}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            prefetch
            href={`/users/${comment.userId}`}
            className="inline-flex items-center gap-2"
          >
            <span className="font-medium text-sm hover:opacity-90">
              {comment.user.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(comment.createdAt, {
                addSuffix: true,
              })}
            </span>
          </Link>
          <p className="text-sm text-foreground mt-1">{comment.value}</p>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center gap-1">
              <Button
                className="h-8 w-8 rounded-full hover:bg-secondary/80"
                disabled={handleLikeComment.isPending}
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleLikeComment.mutate({ commentId: comment.id })
                }
              >
                <ThumbsUpIcon
                  className={cn(
                    "size-4",
                    comment.viewerReaction === "like" && "fill-foreground"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground min-w-8">
                {comment.likeCount || 0}
              </span>
              <Button
                className="h-8 w-8 rounded-full hover:bg-secondary/80"
                disabled={handleDislikeComment.isPending}
                variant="ghost"
                size="icon"
                onClick={() =>
                  handleDislikeComment.mutate({ commentId: comment.id })
                }
              >
                <ThumbsDownIcon
                  className={cn(
                    "size-4",
                    comment.viewerReaction === "dislike" && "fill-foreground"
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground min-w-8">
                {comment.dislikeCount || 0}
              </span>
            </div>
            {variant === "comment" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full text-sm font-medium hover:bg-secondary/80"
                onClick={() => {
                  setIsReplyinOpen(!isReplyinOpen);
                }}
              >
                <MessageSquareIcon className="size-4 mr-2" />
                Reply
              </Button>
            )}
          </div>
        </div>
        {comment.user.clerkId !== userId && variant === "reply" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-secondary/80"
              >
                <MoreVerticalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {variant === "reply" && (
                <DropdownMenuItem onClick={() => setIsReplyinOpen(true)}>
                  <MessageSquareIcon className="size-4 mr-2" />
                  Reply
                </DropdownMenuItem>
              )}
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
        )}
      </div>
      {isReplyinOpen && variant === "comment" && (
        <div className="pl-12">
          <CommentForm
            variant="reply"
            videoId={comment.videoId}
            onCancel={() => setIsReplyinOpen(false)}
            parentId={comment.id}
            onSuccess={() => {
              setIsReplyinOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && (
        <div className="pl-14">
          <Button
            variant="tertiary"
            size="sm"
            className="h-8 rounded-full text-sm font-medium hover:bg-secondary/80"
            onClick={() => setIsRepliesOpen((prev) => !prev)}
          >
            {isRepliesOpen ? (
              <ChevronUpIcon className="size-4 mr-2" />
            ) : (
              <ChevronDownIcon className="size-4 mr-2" />
            )}
            {comment.replyCount}{" "}
            {comment.replyCount === 1 ? "reply" : "replies"}
          </Button>
          {isRepliesOpen &&
            replies.data?.items.map((reply) => (
              <div key={reply.id} className="mt-3">
                <CommentItem comment={reply} variant="reply" />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
