"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Deepak",
  });

  return <div className="">Page Client {data.greeting}</div>;
};
