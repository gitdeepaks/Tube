import { LikedVideoSection } from "../sections/liked-video-section";

export const LikedView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div className="">
        <h1 className="text-2xl font-bold">Liked</h1>
        <p className="text-xs text-gray-500">Videos you have liked</p>
      </div>
      <LikedVideoSection />
    </div>
  );
};
