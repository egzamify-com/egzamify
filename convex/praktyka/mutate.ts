import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const generateUrl = mutation({
  args: {
    attachmentId: v.id("_storage"),
  },
  handler: async (ctx, { attachmentId }) => {
    console.log("LINK - ", await ctx.storage.getUrl(attachmentId));
  },
});
