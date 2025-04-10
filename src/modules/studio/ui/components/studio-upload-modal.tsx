"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created successfully");
      utils.studio.getMany.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSuccess = () => {
    if (create.data?.video.id) {
      create.reset();
      router.push(`/studio/videos/${create.data.video.id}`);
    }
  };
  return (
    <>
      <ResponsiveModal
        open={!!create.data?.url}
        title="Upload Video"
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data?.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        className="cursor-pointer"
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="size-4 mr-2 animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
