import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    make: v.optional(v.string()),
    track: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let vehicles = await ctx.db.query("vehicles").collect();

    // Filter active vehicles
    vehicles = vehicles.filter((v) => v.isActive);

    // Apply search filters
    if (args.search) {
      vehicles = vehicles.filter(
        (v) =>
          v.make.toLowerCase().includes(args.search!.toLowerCase()) ||
          v.model.toLowerCase().includes(args.search!.toLowerCase())
      );
    }

    if (args.make) {
      vehicles = vehicles.filter((v) => v.make === args.make);
    }

    if (args.minPrice) {
      vehicles = vehicles.filter((v) => v.dailyRate >= args.minPrice!);
    }

    if (args.maxPrice) {
      vehicles = vehicles.filter((v) => v.dailyRate <= args.maxPrice!);
    }

    return vehicles;
  },
});

export const getById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) return null;

    const owner = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", vehicle.ownerId))
      .first();
    const track = await ctx.db.get(vehicle.trackId);

    return {
      ...vehicle,
      owner,
      track,
    };
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 3;

    // Get active vehicles with their track and owner information
    const vehicles = await ctx.db.query("vehicles").collect();

    const activeVehicles = vehicles.filter((v) => v.isActive);

    // Sort by creation date (newest first) and limit
    const sortedVehicles = activeVehicles
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);

    // Fetch related data for each vehicle
    const vehiclesWithDetails = await Promise.all(
      sortedVehicles.map(async (vehicle) => {
        const owner = await ctx.db
          .query("users")
          .withIndex("by_external_id", (q) =>
            q.eq("externalId", vehicle.ownerId)
          )
          .first();
        const track = await ctx.db.get(vehicle.trackId);

        return {
          ...vehicle,
          owner,
          track,
        };
      })
    );

    return vehiclesWithDetails;
  },
});

export const create = mutation({
  args: {
    trackId: v.id("tracks"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    dailyRate: v.number(),
    description: v.string(),
    horsepower: v.number(),
    transmission: v.string(),
    drivetrain: v.string(),
    mileage: v.number(),
    fuelType: v.string(),
    color: v.string(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const vehicleId = await ctx.db.insert("vehicles", {
      ownerId: args.userId,
      trackId: args.trackId,
      make: args.make,
      model: args.model,
      year: args.year,
      dailyRate: args.dailyRate,
      description: args.description,
      horsepower: args.horsepower,
      transmission: args.transmission,
      drivetrain: args.drivetrain,
      mileage: args.mileage,
      fuelType: args.fuelType,
      color: args.color,
      amenities: args.amenities,
      images: args.images,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return vehicleId;
  },
});
