"use client";

import { Button } from "~/components/ui/button";
import { exampleAction } from "./(action)/_current-user-actions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useAuth from "~/hooks/useAuth";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function LandingPage() {
  const currentPath = usePathname();
  const { logout, auth } = useAuth();

  const privateData = api.currentUser.hello.useQuery({ text: "jfksdl" });

  console.log(privateData);

  return (
    <main>
      Landing page
      {auth.data && <div>{auth.data.user.email}</div>}
      <Button
        onClick={async () => {
          await logout(
            () => {
              toast.error("Failed to logout");
            },
            () => {
              toast.success("Succefully loged out");
            },
          );
        }}
      >
        Logout
      </Button>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("submit test form");
          await exampleAction({ source_path: currentPath });
        }}
      >
        <Button type="submit">server action</Button>
        <Button>
          <Link href={"/ai-demo"}>ai demo</Link>
        </Button>
      </form>
    </main>
  );
}
