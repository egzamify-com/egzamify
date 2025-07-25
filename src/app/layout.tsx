import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "~/components/Navbar";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import UserActivity from "./providers/user-activity-provier";

export const metadata: Metadata = {
  title: "Learn with AI",
  description: "Learn with AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
            enableSystem={false}
          >
            <TRPCReactProvider>
              <ConvexClientProvider>
                <UserActivity>
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex flex-1 flex-col">
                      {children}
                      <Toaster />
                    </main>
                  </div>
                </UserActivity>
              </ConvexClientProvider>
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
