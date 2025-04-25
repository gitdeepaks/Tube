import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { UserGetOneOutput } from "../../types";
import { BannerUploadModal } from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export const UserPageBannerSkeleton = () => {
  return (
    <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh] rounded-xl" />
  );
};

export const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth();

  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);
  return (
    <div className="relative group">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />

      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gray-500 rounded-xl bg-gradient-to-l from-white/50 to-gray-400/50",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            onClick={() => setIsBannerUploadModalOpen(true)}
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          >
            <Pencil className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
