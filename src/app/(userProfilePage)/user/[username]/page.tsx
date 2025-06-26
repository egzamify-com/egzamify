"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Achievements from "~/components/user-profile-page/achievements";
import UserCharts from "~/components/user-profile-page/charts";
import ProfileHeader from "~/components/user-profile-page/header";
import UserProfileSkeleton from "~/components/user-profile-page/skeleton";
import { api } from "~/trpc/react";

export default function Page() {
  return (
    <>
      <ErrorBoundary
        onError={(error) => {
          console.log(`[USER PAGE] Error: ${error}`);
        }}
        fallback={
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            Something went wrong.
          </div>
        }
      >
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
function UserProfile() {
  const { username } = useParams();
  if (!username) {
    return <div>User not found</div>;
  }
  const {
    "1": { data },
  } = api.users.getUserDataFromUsername.useSuspenseQuery({
    username: username.toString(),
  });
  if (!data) {
    return <div>now found</div>;
  }
  console.log(data);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProfileHeader
        info={{ username: data.username!, name: data.name, userId: data.id }}
      />
      <Achievements userId={data.id} />
      <UserCharts />
    </div>
  );
}
