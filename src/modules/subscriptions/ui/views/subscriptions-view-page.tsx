import { SubscriptionsSections } from "../components/sections/subscriptions-sections";

export const SubscriptionsViewPage = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">All subscriptions</h1>
        <p className="text-xs text-gray-500">
          View and manage all your subscriptions
        </p>
      </div>
      <SubscriptionsSections />
    </div>
  );
};
