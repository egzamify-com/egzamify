"use client";

import DisplayFriendList from "~/components/friends/display-friend-list";

export default function Page() {
  return (
    <>
      <DisplayFriendList
        filter="not_friends"
        headerTitle="Find People"
        headerDescription="You can add new friends here."
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
      />
    </>
  );
}
