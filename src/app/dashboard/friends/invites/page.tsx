"use client"

import { useQuery } from "convex-helpers/react"
import { api } from "convex/_generated/api"
import { Clock, UserPlus } from "lucide-react"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function Page() {
  const { data } = useQuery(api.friends.query.getInvitesDataForSidebar)
  if (!data) return null
  const { incomingRequestsCount, outcomingRequestsCount } = data
  return (
    <PageHeaderWrapper
      title="Zaproszenia"
      description="Zarządzaj swoimi zaproszeniami oraz od innych użytkowników"
    >
      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="incoming" className="relative">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Przychodzące</span>
              {incomingRequestsCount !== undefined && (
                <>
                  {incomingRequestsCount > 0 ? (
                    <Badge className="ml-1">
                      {incomingRequestsCount > 10
                        ? "10+"
                        : incomingRequestsCount}
                    </Badge>
                  ) : null}
                </>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Oczekujące</span>

              {outcomingRequestsCount !== undefined && (
                <>
                  {outcomingRequestsCount > 0 ? (
                    <Badge className="ml-1">
                      {outcomingRequestsCount > 10
                        ? "10+"
                        : outcomingRequestsCount}
                    </Badge>
                  ) : null}
                </>
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="incoming"
          className="flex w-full flex-row items-start justify-start"
        >
          <DisplayFriendList
            filter="incoming_requests"
            notFoundComponent={
              <div className="flex flex-col items-start gap-2">
                <p className="mt-2 text-gray-500">No users found.</p>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-3">
          <DisplayFriendList
            filter="outcoming_requests"
            notFoundComponent={
              <div className="flex flex-col items-start gap-2">
                <p className="mt-2 text-gray-500">No users found.</p>
              </div>
            }
          />
        </TabsContent>
      </Tabs>
    </PageHeaderWrapper>
  )
}
