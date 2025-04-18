import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { CommentsSection } from "../sections/comments-section";
import { SuggestionsSection } from "../sections/suggestions-section";
import { VideoSection } from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

const SuggestionsSectionSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="w-[160px] h-[90px] rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10 ">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          <div className="xl:hidden block mt-4">
            <Suspense fallback={<SuggestionsSectionSkeleton />}>
              <SuggestionsSection videoId={videoId} isManual />
            </Suspense>
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <Suspense fallback={<SuggestionsSectionSkeleton />}>
            <SuggestionsSection videoId={videoId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
