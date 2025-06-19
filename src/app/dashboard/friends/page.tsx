"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { api } from "~/trpc/react";
import Friend from "./friend";

export default function Page() {
  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading friends...</div>}>
          <FriendsList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function FriendsList() {
  const {
    "1": { data },
  } = api.friends.getCurrentUsersFriends.useSuspenseQuery();
  console.log(data);
  return (
    <div>
      {data.map((friend) => {
        return <Friend key={`friend-${friend.user.id}`} friend={friend} />;
      })}
    </div>
  );
}
