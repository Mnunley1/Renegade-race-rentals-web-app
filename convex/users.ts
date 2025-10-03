import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const current = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});

export const create = mutation({
  args: {
    externalId: v.string(),
    name: v.string(),
    email: v.string(),
    userType: v.union(v.literal("guest"), v.literal("host"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      externalId: args.externalId,
      name: args.name,
      email: args.email,
      userType: args.userType,
      totalRentals: 0,
      memberSince: Date.now(),
    });

    return userId;
  },
});

export const update = mutation({
  args: {
    externalId: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    userType: v.optional(
      v.union(v.literal("guest"), v.literal("host"), v.literal("both"))
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.externalId))
      .first();

    if (!user) throw new Error("User not found");

    const updateData: any = {};
    if (args.name) updateData.name = args.name;
    if (args.phone) updateData.phone = args.phone;
    if (args.profileImage) updateData.profileImage = args.profileImage;
    if (args.userType) updateData.userType = args.userType;

    await ctx.db.patch(user._id, updateData);
    return user._id;
  },
});
