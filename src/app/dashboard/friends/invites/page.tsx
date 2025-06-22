"use client";

import DisplayFriendList from "~/components/friends/display-friend-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Page() {
  return (
    <>
      <Tabs defaultValue="pending" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="pending">pending</TabsTrigger>
          <TabsTrigger value="incoming">incoming</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DisplayFriendList filter="pending_requests" />
        </TabsContent>
        <TabsContent value="incoming">
          <DisplayFriendList filter="incoming_requests" />
        </TabsContent>
      </Tabs>
    </>
  );
}
