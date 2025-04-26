import { PlaylistGetManyOutputs } from "@/modules/playlists/types";
import { THUMBNAIL_FALLBACK_URL } from "@/modules/videos/contants";
import Link from "next/link";
import { PlaylistInfo, PlaylistInfoSkeleton } from "./playlist-info";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "./playlist-thumbnail";

interface PlaylistGridCardProps {
  playlist: PlaylistGetManyOutputs["items"][number];
  imageUrl: string;
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

export const PlaylistGridCard = ({
  playlist,
  imageUrl,
}: PlaylistGridCardProps) => {
  return (
    <Link prefetch href={`/playlists/${playlist.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <h3 className="text-lg font-semibold">
          <PlaylistThumbnail
            imageUrl={imageUrl || THUMBNAIL_FALLBACK_URL}
            title={playlist.name}
            videoCount={playlist.videoCount}
          />
          <PlaylistInfo playlist={playlist} />
        </h3>
      </div>
    </Link>
  );
};
