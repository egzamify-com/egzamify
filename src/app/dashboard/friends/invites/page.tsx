"use client";

import { Clock, UserPlus } from "lucide-react";
import DisplayFriendList from "~/components/friends/display-friend-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Page() {
  return (
    <>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Friend Invites
          </h1>
          <p className="text-muted-foreground">
            Manage your incoming and outgoing friend requests
          </p>
        </div>
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="incoming" className="relative">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Incoming</span>
                {/* <Badge
                  variant="secondary"
                  className="ml-1 bg-blue-100 text-blue-700"
                >
                  1
                </Badge> */}
              </div>
            </TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Pending</span>
                {/* <Badge
                  variant="secondary"
                  className="ml-1 bg-orange-100 text-orange-700"
                >
                  1
                </Badge> */}
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="incoming" className="space-y-3">
            <DisplayFriendList
              filter="incoming_requests"
              headerTitle=""
              headerDescription=""
              notFoundComponent={
                <div className="flex gap-2 items-start flex-col">
                  <p className="text-gray-500 mt-2">No users found.</p>
                </div>
              }
              errorComponent={
                <div className="flex gap-2 items-start flex-col">
                  <p className="text-gray-500 mt-2">Something went wrong.</p>
                </div>
              }
              disableTopPadding={true}
            />
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            <DisplayFriendList
              filter="pending_requests"
              headerTitle=""
              headerDescription=""
              notFoundComponent={
                <div className="flex gap-2 items-start flex-col">
                  <p className="text-gray-500 mt-2">No users found.</p>
                </div>
              }
              errorComponent={
                <div className="flex gap-2 items-start flex-col">
                  <p className="text-gray-500 mt-2">Something went wrong.</p>
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
