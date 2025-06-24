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
          <div className="flex gap-2 items-start flex-col">
            <p className="text-gray-500 mt-2">No users found.</p>
          </div>
        }
        errorComponent={
          <div className="flex gap-2 items-start flex-col">
            <p className="text-gray-500 mt-2">Something went wrong.</p>
          </div>
        }
      />
    </>
  );
}
