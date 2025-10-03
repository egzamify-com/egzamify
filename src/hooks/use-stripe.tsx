import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";

export default function useStripe() {
  const stripe = () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return stripe;
}
