import Link from "next/link";
import { Button } from "~/components/ui/button";
import { syncStripeDataToKV } from "~/lib/stripe-utils";

export default async function SyncData({ customerId }: { customerId: string }) {
  try {
    await syncStripeDataToKV(customerId);
    console.log(
      "[STRIPE] Adding real credits to user account after successful payment",
    );
  } catch (e) {
    console.log("[STRIPE] stripe data to kv sync failed - ", e);
  }
  return (
    <div>
      everything done!
      <Link href={"/"}>
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}
