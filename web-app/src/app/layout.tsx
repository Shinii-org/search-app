import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./styles/globals.scss";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nimble",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <SessionProvider session={session}>
              {children}
              <Sonner position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
