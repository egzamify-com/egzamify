"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { protectedAction } from "~/server/api/trpc";

export const exampleAction = protectedAction
  .meta({ span: "exampleAction" })
  .input(z.object({ source_path: z.string() }))
  .mutation(async ({ input }) => {
    // here perform some db async operation
    console.log("exampleAction mutation");
    // and refresh the page user is, this refreshes data (from server), doesnt reload the page
    revalidatePath(`${input.source_path}`, "page");
    console.log(`revalidated path - ${input.source_path}`);
    return { message: "exampleAction mutation" };
  });
