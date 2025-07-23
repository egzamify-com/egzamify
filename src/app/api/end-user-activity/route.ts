import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
export async function POST() {
  console.log("GOT BEACON");
  await fetchMutation(
    api.users.mutate.toggleUserActivityStatus,
    {
      newStatus: false,
    },
    { token: await convexAuthNextjsToken() },
  );
  return new Response("OK", { status: 200 });
}
