import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const utils = trpc.useUtils();

  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      videoId: videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    }
  );

  const handleOpenChange = (newOpen: boolean) => {
    utils.playlists.getManyForVideo.reset();

    onOpenChange(newOpen);
  };

  const addVideoToPlaylist = trpc.playlists.addVideo.useMutation({
    onSuccess: () => {
      toast.success(`Added to playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
      // TODO: invalidate playlist.getOne
    },
    onError: () => {
      toast.error("Failed to add to playlist");
    },
  });

  const removeVideoFromPlaylist = trpc.playlists.removeVideo.useMutation({
    onSuccess: () => {
      toast.success(`Removed from playlist`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: () => {
      toast.error("Failed to remove from playlist");
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                variant="ghost"
                key={playlist.id}
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={() => {
                  if (playlist.constainsVideo) {
                    removeVideoFromPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addVideoToPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  }
                }}
                disabled={
                  removeVideoFromPlaylist.isPending ||
                  addVideoToPlaylist.isPending
                }
              >
                {playlist.constainsVideo ? (
                  <SquareCheckIcon className="mr-2 text-green-500" />
                ) : (
                  <SquareIcon className="mr-2 text-muted-foreground" />
                )}
                {playlist.name}
              </Button>
            ))}

        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isManual={true}
          />
        )}
      </div>
    </ResponsiveModal>
  );
};

// 19:35
