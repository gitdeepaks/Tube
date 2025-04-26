import { DEFAULT_LIMIT } from "@/constants";
import { SubscriptionsViewPage } from "@/modules/subscriptions/ui/views/subscriptions-view-page";
import { HydrateClient, trpc } from "@/trpc/server";

const SubscriptionsPage = async () => {
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
