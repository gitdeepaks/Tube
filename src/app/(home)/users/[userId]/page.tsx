import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { notFound } from "next/navigation";

interface UserIdPageProps {
  params: {
    userId: string;
  };
}

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const UserIdPage = async ({ params }: UserIdPageProps) => {
  const { userId } = params;

  // Check if userId is a valid UUID
  if (!UUID_REGEX.test(userId)) {
    // If not a valid UUID, return 404
    notFound();
  }

  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.videos.getMany.prefetchInfinite({
    userId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default UserIdPage;
