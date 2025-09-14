import { mutation } from "convex/_generated/server";
import { v } from "convex/values";

export const storeStripeCustomerId = mutation({
  args: { userId: v.id("users"), customerId: v.string() },
  handler: async (ctx, { userId, customerId }) => {
    const key = `stripe:user:${userId}`;
    const value = customerId;
    await ctx.db.insert("kv", { key, value });
  },
});

export const storeCustomerData = mutation({
  args: { customerId: v.string(), customerData: v.string() },
  handler: async (ctx, { customerId, customerData }) => {
    const key = `stripe:customer:${customerId}`;
    const value = customerData;
    await ctx.db.insert("kv", { key, value });
  },
});
