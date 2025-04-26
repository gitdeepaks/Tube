import { DEFAULT_LIMIT } from "@/constants";
import { SubscriptionsViewPage } from "@/modules/subscriptions/ui/views/subscriptions-view-page";
import { HydrateClient, trpc } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SubscriptionsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptionsViewPage />
    </HydrateClient>
  );
};

export default SubscriptionsPage;
