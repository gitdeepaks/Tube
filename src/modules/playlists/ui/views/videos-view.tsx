import { PlaylistHeaderSection } from "../sections/plalylist-header-section";
import { VideoSection } from "../sections/video-section";

interface VideosViewProps {
  playlistId: string;
}

export const VideosView = ({ playlistId }: VideosViewProps) => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideoSection playlistId={playlistId} />
    </div>
  );
};
