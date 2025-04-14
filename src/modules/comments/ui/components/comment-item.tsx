import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
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
        {/* TODO: Add reactions */}
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
