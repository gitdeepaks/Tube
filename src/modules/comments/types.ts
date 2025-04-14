import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CommentsGetMany =
  inferRouterOutputs<AppRouter>["comments"]["getMany"];
