"use client";

import DisplayFriendList from "~/components/friends/display-friend-list";
import PageHeaderWrapper from "~/components/page-header-wrapper";

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Find People"
      description="You can add new friends here."
    >
      <DisplayFriendList
        filter="not_friends"
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
    </PageHeaderWrapper>
  );
}
