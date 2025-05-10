import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { api } from "~/trpc/server";
import { tryCatch } from "~/utils/tryCatch";
import { TRPCError } from "@trpc/server";
export async function POST(req: Request) {
  if (!env.CLERK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(env.CLERK_SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const [json, error] = await tryCatch(req.json());

  if (error) {
    return new Response("Error: Could not parse body", {
      status: 400,
    });
  }
  const body = JSON.stringify(json);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }
  console.log("test");
  if (evt.type === "user.created") {
    console.log("userId:", evt.data);

    if (!evt.data.username) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Username is required",
      });
    }

    const [data, error] = await tryCatch(
      api.users.createUserProfile({
        user_id: evt.data.id,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        username: evt.data.username,
      }),
    );
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
    console.log("USER INSERTED", data);

    return new Response("Webhook received, user created succesfully", {
      status: 200,
    });
  }

  return new Response("user creation failed, Weebhook received", {
    status: 400,
  });
}
