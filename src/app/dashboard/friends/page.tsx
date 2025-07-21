"use client";

import { usePaginatedQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { Download } from "lucide-react";
import { Button } from "~/components/ui/button";
const filter = "accepted_friends";
export default function Page() {
  const { loadMore, results, status } = usePaginatedQuery(
    api.friends.query.getFriendsWithSearch,
    { filter },
    { initialNumItems: 1 },
  );
  console.log("result", results);
  console.log("status", status);
  return (
    <>
      <div>jfkd</div>
      <p>current filter: {filter}</p>
      {results.map((friend) => (
        <div key={friend._id}>
          {/* id: {friend._id} */}
          email: {friend.email}
        </div>
      ))}

      {status === "CanLoadMore" && (
        <Button onClick={() => loadMore(40)}>
          <Download />
          Load More
        </Button>
      )}
      {/* <DisplayFriendList
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
      />*/}
    </>
  );
}
