"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { useParams } from "next/navigation";
import SpinnerLoading from "~/components/SpinnerLoading";
import Achievements from "~/components/user-profile-page/achievements";
import UserCharts from "~/components/user-profile-page/charts";
import ProfileHeader from "~/components/user-profile-page/header";

export default function Page() {
  const { username } = useParams();

  const { data, error, isPending } = useQuery(
    api.users.query.getUserFromUsername,
    {
      username: username as string,
    },
  );
  if (!username) {
    return <div>User not found</div>;
  }
  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center pt-100">
        <SpinnerLoading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found.</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <ProfileHeader info={{ user: data }} />
      <Achievements userId={data._id} />
      <UserCharts />
    </div>
  );
}
