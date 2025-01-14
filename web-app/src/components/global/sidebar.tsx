"use client";

import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { Logo } from "../ui/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import FileUpload from "./file-upload";
interface AppSidebarProps {
  session: Session | null;
}

const AppSidebar = ({ session }: AppSidebarProps) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };
   return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <nav className="flex-grow p-4">
          <FileUpload />
        </nav>
        {session?.user ? (
          <div className="p-4 border-t flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback className="bg-amber-100">
                    {getInitials(session.user.name || "IN")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col">
              <p className="font-semibold text-dark-200">{session.user.name}</p>
              <p className="text-xs text-light-500">{session.user.email}</p>
            </div>
          </div>
        ) : (
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
