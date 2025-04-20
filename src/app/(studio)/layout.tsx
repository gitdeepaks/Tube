import { StudioLayout } from "@/modules/studio/ui/layout/studio-layout";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
