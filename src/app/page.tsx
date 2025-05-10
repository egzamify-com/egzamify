import { HydrateClient } from "~/trpc/server";
import LandingPage from "./LandingPage";

export default async function Home() {
  return (
    <HydrateClient>
      <LandingPage />
    </HydrateClient>
  );
}
