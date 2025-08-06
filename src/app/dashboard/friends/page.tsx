"use client";

import Link from "next/link";
import DisplayFriendList from "~/components/friends/display-friend-list";
import PageHeaderWrapper from "~/components/page-header-wrapper";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Your Friends"
      description="Manage your connections and stay in touch"
    >
      <DisplayFriendList
        filter="accepted_friends"
        headerTitle="Friends"
        headerDescription="Manage your connections and stay in touch"
        notFoundComponent={
          <div className="flex flex-col items-start gap-2">
            <p className="mt-2">You dont have any friends yet.</p>
            <Link href={`/dashboard/friends/add`}>
              <Button>Find new friends</Button>
            </Link>
          </div>
        }
        errorComponent={
          <div className="flex flex-col items-start gap-2">
            <p className="mt-2">Something went wrong.</p>
          </div>
        }
      />
    </PageHeaderWrapper>
  );
}
