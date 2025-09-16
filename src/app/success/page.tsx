import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SyncData from "./sync-data";

export default async function SuccesPage() {
  console.log("[STRIPE] Success server component code started");
  const user = await fetchQuery(
    api.users.query.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  );
  if (!user) {
    console.log("[AUTH] User not found on succes page (?)");
    return redirect("/");
  }

  const customerId = await fetchQuery(
    api.payments.query.getStripeCustomerId,
    { userId: user._id },
    { token: await convexAuthNextjsToken() },
  );

  if (!customerId) {
    console.log("[STRIPE] Customer id not found on success page (?)");
    return redirect("/");
  }

  return (
    <>
      <Suspense
        fallback={
          <div>
            <h1 className="text-xl">We received your payment!</h1>
            <h2>Let us finalize your transaction</h2>
          </div>
        }
      >
        <SyncData customerId={customerId} />
      </Suspense>
    </>
  );
}
