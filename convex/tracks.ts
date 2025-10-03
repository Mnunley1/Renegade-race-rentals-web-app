import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tracks")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const trackId = await ctx.db.insert("tracks", {
      name: args.name,
      location: args.location,
      description: args.description,
      imageUrl: args.imageUrl,
      isActive: true,
    });

    return trackId;
  },
});

export const update = mutation({
  args: {
    id: v.id("tracks"),
    name: v.string(),
    location: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      location: args.location,
      description: args.description,
      imageUrl: args.imageUrl,
    });

    return args.id;
  },
});

export const deactivate = mutation({
  args: { id: v.id("tracks") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: false,
    });

    return args.id;
  },
});
