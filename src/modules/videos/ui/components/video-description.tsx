"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
  compactViews?: string;
  expandViews?: string;
  compactDate?: string;
  expandDate?: string;
  description: string | null;
}

export const VideoDescription = ({
  description,
  compactViews,
  expandViews,
  compactDate,
  expandDate,
}: VideoDescriptionProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded((curren) => !curren)}
      className="bg-secondary/50 cursor-pointer rounded-xl p-3 hover:bg-secondary/70 transition"
    >
      <div className="flex gap-2 text-sm mb-2">
        <span className="font-medium">
          {expanded ? expandViews : compactViews} views
        </span>{" "}
        <span className="font-medium">
          {expanded ? expandDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !expanded && "line-clamp-2"
          )}
        >
          {description || "No description"}
        </p>
        <div className="flex items-center gap-1 mt-4 font-medium text-sm">
          {expanded ? (
            <>
              Show less
              <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
