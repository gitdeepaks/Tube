import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistGetManyOutputs } from "@/modules/playlists/types";

interface PlaylistInfoProps {
  playlist: PlaylistGetManyOutputs["items"][number];
}

export const PlaylistInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-md bg-gray-200" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};

export const PlaylistInfo = ({ playlist }: PlaylistInfoProps) => {
  return (
    <div className="flex gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm text-gray-500 line-clamp-1 lg:line-clamp-2 break-words">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-500">Playlist</p>
        <p className="text-sm text-gray-700 font-semibold hover:text-primary-500">
          View full playlist
        </p>
      </div>
    </div>
  );
};
