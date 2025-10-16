import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider"
import { type Metadata } from "next"
import { Geist } from "next/font/google"
import Navbar from "~/components/main-navbar"
import { ThemeProvider } from "~/components/theme/theme-provider"
import { Toaster } from "~/components/ui/sonner"
import { ConvexClientProvider } from "~/providers/ConvexClientProvider"
import MyQueryProvider from "~/providers/query-client"
import UserActivity from "~/providers/user-activity-provier"
import "~/styles/globals.css"

export const metadata: Metadata = {
  title: "Egzamify",
  description: "Przyjemne egzaminy zawodowe",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MyQueryProvider>
      <ConvexAuthNextjsServerProvider>
        <html
          lang="en"
          className={`${geist.variable} bg-background`}
          suppressHydrationWarning
        >
          <body className="bg-background">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
              enableSystem={false}
            >
              <ConvexClientProvider>
                <ConvexQueryCacheProvider>
                  <UserActivity>
                    <div className="flex min-h-screen flex-col">
                      <Navbar />
                      <main className="flex flex-1 flex-col">
                        {children}
                        <Toaster />
                      </main>
                    </div>
                  </UserActivity>
                </ConvexQueryCacheProvider>
              </ConvexClientProvider>
            </ThemeProvider>
          </body>
        </html>
      </ConvexAuthNextjsServerProvider>
    </MyQueryProvider>
  )
}
