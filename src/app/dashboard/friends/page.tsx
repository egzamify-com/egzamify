"use client";

import Link from "next/link";
import DisplayFriendList from "~/components/friends/display-friend-list";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <>
      <DisplayFriendList
        filter="accepted_friends"
        headerTitle="Friends"
        headerDescription="Manage your connections and stay in touch"
        notFoundComponent={
          <div className="flex gap-2 items-start flex-col">
            <p className="mt-2">You dont have any friends yet.</p>
            <Link href={`/dashboard/friends/add`}>
              <Button>Find new friends</Button>
            </Link>
          </div>
        }
        errorComponent={
          <div className="flex gap-2 items-start flex-col">
            <p className=" mt-2">Something went wrong.</p>
          </div>
        }
      />
    </>
  );
}
