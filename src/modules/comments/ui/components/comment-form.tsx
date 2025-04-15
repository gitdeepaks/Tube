import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define a schema that matches what the backend expects
const commentFormSchema = z.object({
  videoId: z.string().uuid(),
  value: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "comment" | "reply";
}

export const CommentForm = ({
  videoId,
  onSuccess,
  parentId,
  variant = "comment",
  onCancel,
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      videoId,
      value: "",
      parentId,
    },
  });

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      toast.success("Comment created");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to create comment");

      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const onSubmit = (data: CommentFormValues) => {
    create.mutate({
      videoId: data.videoId,
      value: data.value,
      ...(parentId ? { parentId } : {}),
    });
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 group">
        <UserAvatar
          size={variant === "reply" ? "md" : "lg"}
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />
        <div className="flex-1">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "comment"
                        ? "Add a comment..."
                        : "Add a reply..."
                    }
                    className={cn(
                      "resize-none bg-transparent overflow-hidden min-h-0",
                      variant === "reply" ? "h-14" : "h-20"
                    )}
                    rows={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="justify-end gap-2 mt-2 flex">
            {variant === "reply" && (
              <Button
                disabled={create.isPending}
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="hover:bg-secondary/80 rounded-full h-8"
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={create.isPending}
              type="submit"
              size="sm"
              className="rounded-full h-8"
            >
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
