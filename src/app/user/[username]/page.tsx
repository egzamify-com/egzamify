"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/custom_helpers";
import { useParams } from "next/navigation";
import FullScreenError from "~/components/full-screen-error";
import FullScreenLoading from "~/components/full-screen-loading";
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

  if (isPending) {
    return <FullScreenLoading loadingMessage="Loading user profile..." />;
  }

  if (error) {
    return (
      <FullScreenError
        errorMessage={"Failed to load user profile"}
        errorDetail={error.message}
      />
    );
  }

  if (!data) {
    return <FullScreenError errorMessage={"User not found"} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <ProfileHeader info={{ user: data }} />
      <Achievements userId={data._id} />
      <UserCharts />
    </div>
  );
}
