"use client";

import { Button } from "~/components/ui/button";
import { exampleAction } from "./(action)/_current-user-actions";
import { usePathname } from "next/navigation";

export default function LandingPage() {
  const currentPath = usePathname();
  return (
    <main>
      Landing page
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("submit test form");
          await exampleAction({ source_path: currentPath });
        }}
      >
        <Button type="submit">server action</Button>
      </form>
    </main>
  );
}
