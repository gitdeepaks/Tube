// import { db } from "@/database";
// import { videos } from "@/database/schema";
import { db } from "@/database";
import { categories, videos } from "@/database/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
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
