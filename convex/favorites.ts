import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Fetch vehicle details for each favorite
    const favoritesWithVehicles = await Promise.all(
      favorites.map(async (favorite) => {
        const vehicle = await ctx.db.get(favorite.vehicleId);
        if (!vehicle) return null;

        // Fetch track information
        const track = await ctx.db.get(vehicle.trackId);

        return {
          ...favorite,
          vehicle: {
            ...vehicle,
            track,
          },
        };
      })
    );

    // Filter out null results (vehicles that no longer exist)
    return favoritesWithVehicles.filter((favorite) => favorite !== null);
  },
});

export const add = mutation({
  args: {
    userId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("vehicleId"), args.vehicleId))
      .first();

    if (existing) {
      throw new Error("Vehicle already in favorites");
    }

    // Verify vehicle exists
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    const favoriteId = await ctx.db.insert("favorites", {
      userId: args.userId,
      vehicleId: args.vehicleId,
      createdAt: Date.now(),
    });

    return favoriteId;
  },
});

export const remove = mutation({
  args: {
    userId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("vehicleId"), args.vehicleId))
      .first();

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    await ctx.db.delete(favorite._id);
    return favorite._id;
  },
});

export const isFavorited = query({
  args: {
    userId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("vehicleId"), args.vehicleId))
      .first();

    return !!favorite;
  },
});
