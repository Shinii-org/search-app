import { ReactNode } from "react";
import AppSidebar from "@/components/global/sidebar";
import { auth } from "@/auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = async ({ children }: MainLayoutProps) => {
  const session = await auth();
  if(!session || !session.user) redirect('sign-in')

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar session={session} />
        <div className="flex flex-col w-full">
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
