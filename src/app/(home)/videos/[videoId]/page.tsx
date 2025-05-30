import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface VideoIdPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoIdPage = async ({ params }: VideoIdPageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ id: videoId });
  // TODO: change to prefetchInfiniteQuery
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoIdPage;
