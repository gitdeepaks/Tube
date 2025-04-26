import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { HomeNavbar } from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <Suspense fallback={<div className="h-16 bg-white" />}>
          <HomeNavbar />
        </Suspense>
        <div className="flex min-h-screen pt-[4rem]">
          <Suspense fallback={<div className="w-[240px] bg-white" />}>
            <HomeSidebar />
          </Suspense>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
