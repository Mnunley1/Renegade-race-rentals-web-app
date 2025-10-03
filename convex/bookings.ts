import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    totalAmount: v.number(),
    renterMessage: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    const reservationId = await ctx.db.insert("reservations", {
      vehicleId: args.vehicleId,
      renterId: args.userId,
      ownerId: vehicle.ownerId,
      startDate: args.startDate,
      endDate: args.endDate,
      totalDays: args.totalDays,
      dailyRate: vehicle.dailyRate,
      totalAmount: args.totalAmount,
      status: "pending",
      renterMessage: args.renterMessage,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return reservationId;
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) return [];

    const rentals = await ctx.db
      .query("reservations")
      .withIndex("by_renter", (q) => q.eq("renterId", args.userId))
      .collect();

    const ownedBookings = await ctx.db
      .query("reservations")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.userId))
      .collect();

    // Get vehicle and owner details for each reservation
    const rentalsWithDetails = await Promise.all(
      rentals.map(async (rental) => {
        const vehicle = await ctx.db.get(rental.vehicleId);
        const owner = vehicle
          ? await ctx.db
              .query("users")
              .withIndex("by_external_id", (q) =>
                q.eq("externalId", vehicle.ownerId)
              )
              .first()
          : null;

        return {
          ...rental,
          vehicle: vehicle ? { ...vehicle, owner } : null,
        };
      })
    );

    const ownedBookingsWithDetails = await Promise.all(
      ownedBookings.map(async (booking) => {
        const vehicle = await ctx.db.get(booking.vehicleId);
        const renter = await ctx.db
          .query("users")
          .withIndex("by_external_id", (q) =>
            q.eq("externalId", booking.renterId)
          )
          .first();

        return {
          ...booking,
          vehicle: vehicle ? { ...vehicle, renter } : null,
        };
      })
    );

    return [...rentalsWithDetails, ...ownedBookingsWithDetails];
  },
});

export const updateStatus = mutation({
  args: {
    reservationId: v.id("reservations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    ownerMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reservationId, {
      status: args.status,
      ownerMessage: args.ownerMessage,
      updatedAt: Date.now(),
    });

    return args.reservationId;
  },
});
