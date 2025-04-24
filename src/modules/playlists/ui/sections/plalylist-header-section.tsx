"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
    id: playlistId,
  });
  const utils = trpc.useUtils();
  const router = useRouter();

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist deleted");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Failed to delete playlist");
    },
  });

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-xs text-gray-500">Videos from this playlist</p>
      </div>
      <Button
        variant="outline"
        onClick={() => remove.mutate({ id: playlistId })}
        disabled={remove.isPending}
      >
        {remove.isPending ? (
          <Loader2Icon className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2Icon className="w-4 h-4" />
        )}
        Delete playlist
      </Button>
    </div>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="w-64 h-6" />
      <Skeleton className="w-48 h-4" />
    </div>
  );
};
