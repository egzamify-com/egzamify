"use client";

import { Clock, UserPlus } from "lucide-react";
import DisplayFriendList from "~/components/friends/display-friend-list";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function Page() {
  const { data: incoming } = api.users.getUsersFromSearch.useQuery({
    filter: "incoming_requests",
    search: "",
    limit: 15,
  });
  const incomingRequestsCount = incoming?.items.length;

  const { data: pending } = api.users.getUsersFromSearch.useQuery({
    filter: "pending_requests",
    search: "",
    limit: 15,
  });
  const pendingRequestsCount = pending?.items.length;

  return (
    <>
      <div className="container mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Friend Invites
          </h1>
          <p className="text-muted-foreground">
            Manage your incoming and outgoing friend requests
          </p>
        </div>
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="incoming" className="relative">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Incoming</span>
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
                <span>Pending</span>

                {pendingRequestsCount !== undefined && (
                  <>
                    {pendingRequestsCount > 0 ? (
                      <Badge className="ml-1">
                        {pendingRequestsCount > 10
                          ? "10+"
                          : pendingRequestsCount}
                      </Badge>
                    ) : null}
                  </>
                )}
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="incoming" className="space-y-3">
            <DisplayFriendList
              filter="incoming_requests"
              headerTitle=""
              headerDescription=""
              notFoundComponent={
                <div className="flex flex-col items-start gap-2">
                  <p className="mt-2 text-gray-500">No users found.</p>
                </div>
              }
              errorComponent={
                <div className="flex flex-col items-start gap-2">
                  <p className="mt-2 text-gray-500">Something went wrong.</p>
                </div>
              }
              disableTopPadding={true}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            <DisplayFriendList
              filter="outcoming_requests"
              headerTitle=""
              headerDescription=""
              notFoundComponent={
                <div className="flex flex-col items-start gap-2">
                  <p className="mt-2 text-gray-500">No users found.</p>
                </div>
              }
              errorComponent={
                <div className="flex flex-col items-start gap-2">
                  <p className="mt-2 text-gray-500">Something went wrong.</p>
                </div>
              }
              disableTopPadding={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
