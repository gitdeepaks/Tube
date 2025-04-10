"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoUpdateSchema } from "@/database/schema";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheck,
  CopyIcon,
  GlobeIcon,
  LockIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error</div>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const ustils = trpc.useUtils();
  const router = useRouter();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      ustils.studio.getMany.invalidate();
      ustils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated successfully");
    },
    onError: () => {
      toast.error("Failed to update video");
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      ustils.studio.getMany.invalidate();
      toast.success("Video deleted successfully");
      router.push("/studio");
    },
    onError: () => {
      toast.error("Failed to delete video");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data);
  };

  // TODO:change if deploying outside of vercel
  const fullUrl = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/videos/${videoId}}`;

  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Video Details</h1>
            <h1 className="text-xs text-gray-500">Manage your video details</h1>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              type="submit"
              disabled={update.isPending}
              className="cursor-pointer"
            >
              {update.isPending ? "Saving..." : "Save"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => remove.mutate({ id: videoId })}
                >
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    {/* TODO: Add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Add a title to your video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                    {/* TODO: Add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value ?? ""}
                      rows={10}
                      className="resize-none pr-10"
                      placeholder="Add a description to your video"
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("description", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: Add Thumbnail field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-gray-100 rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="px-4 py-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">Video link</p>
                    <div className="flex items-center gap-x-2">
                      <Link href={`/videos/${video.id}`}>
                        <p className="text-blue-600 line-clamp-1 text-sm">
                          {fullUrl}
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                        disabled={copied}
                      >
                        {copied ? (
                          <CopyCheck className="size-4 text-green-600" />
                        ) : (
                          <CopyIcon className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">
                      Video status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxStatus ?? "prepairing")}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">
                      Subtitle Status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxStatus || "no_subtitles")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLIC">
                        <GlobeIcon className="size-4 mr-2" />
                        Public
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        <LockIcon className="size-4 mr-2" />
                        Private
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

// 30:28
