"use client";

import { Button } from "@/components/ui/button";
import { PlaylistCreateModal } from "@/modules/playlists/ui/components/playlist-create-modal";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { PlaylistSection } from "../sections/playlist-section";

export const PlaylistsView = () => {
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistCreateModal
        open={createPlaylistModalOpen}
        onOpenChange={setCreatePlaylistModalOpen}
      />
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-xs text-gray-500">
            Collections of videos that you have created
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setCreatePlaylistModalOpen(true)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};
