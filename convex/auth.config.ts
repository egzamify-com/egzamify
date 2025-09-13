import { env } from "~/env";

export default {
  providers: [
    {
      domain: env.NEXT_PUBLIC_CONVEX_CLOUD_URL,
      applicationID: "convex",
    },
  ],
};
