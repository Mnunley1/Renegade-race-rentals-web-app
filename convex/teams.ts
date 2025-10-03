import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    location: v.optional(v.string()),
    experience: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let teams = await ctx.db.query("teams").collect();

    teams = teams.filter((t) => t.isActive);

    if (args.location) {
      teams = teams.filter((t) =>
        t.location.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    if (args.experience) {
      teams = teams.filter((t) => t.experience === args.experience);
    }

    return teams;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    location: v.string(),
    experience: v.string(),
    specialties: v.array(v.string()),
    availableSeats: v.number(),
    requirements: v.string(),
    contactInfo: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const teamId = await ctx.db.insert("teams", {
      ownerId: args.userId,
      name: args.name,
      description: args.description,
      location: args.location,
      experience: args.experience,
      specialties: args.specialties,
      availableSeats: args.availableSeats,
      requirements: args.requirements,
      contactInfo: args.contactInfo,
      isActive: true,
      createdAt: Date.now(),
    });

    return teamId;
  },
});
