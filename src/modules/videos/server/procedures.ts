// import { db } from "@/database";
// import { videos } from "@/database/schema";
import { db } from "@/database";
import { categories, videos } from "@/database/schema";
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

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        categoryId: defaultCategory.id, // Use the actual category ID
      })
      .returning();

    return {
      video: video,
    };
  }),
});
