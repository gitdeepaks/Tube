import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CommentsGetMany } from "../../types";

interface CommentItemProps {
  comment: CommentsGetMany[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
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
      </div>
    </div>
  );
};
