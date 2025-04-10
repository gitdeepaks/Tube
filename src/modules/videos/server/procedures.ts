// import { db } from "@/database";
// import { videos } from "@/database/schema";
import { db } from "@/database";
import { categories, videos, videoUpdateSchema } from "@/database/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const [removeVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!removeVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return removeVideo;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required",
        });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();
      if (!updatedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }
      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;
    // First, get a valid category ID
    const defaultCategory = await db
      .select()
      .from(categories)
      .limit(1)
      .then((results) => results[0]);

    if (!defaultCategory) {
      throw new Error(
        "No categories found in the database. Please seed categories first."
      );
    }

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*", //TODO: IN production, set to the actual origin
    });

    console.log({ upload });
    console.log({ uploadUrl: upload.url });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        categoryId: defaultCategory.id, // Use the actual category ID
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: video,
      url: upload.url,
    };
  }),
});
