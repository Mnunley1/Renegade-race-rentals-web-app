import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    rating: v.optional(v.number()),
    totalRentals: v.number(),
    memberSince: v.optional(v.union(v.string(), v.number())),
    profileImage: v.optional(v.string()),
    userType: v.union(v.literal("guest"), v.literal("host"), v.literal("both")),
  }).index("by_external_id", ["externalId"]),

  tracks: defineTable({
    name: v.string(),
    location: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  vehicles: defineTable({
    ownerId: v.string(),
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
    fuelType: v.optional(v.string()),
    color: v.optional(v.string()),
    engineType: v.optional(v.string()),
    amenities: v.array(v.string()),
    images: v.optional(v.array(v.string())),
    addOns: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          price: v.number(),
          isRequired: v.boolean(),
        })
      )
    ),
    isActive: v.boolean(),
    isApproved: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_track", ["trackId"]),

  reservations: defineTable({
    vehicleId: v.id("vehicles"),
    renterId: v.string(),
    ownerId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
    totalDays: v.number(),
    dailyRate: v.number(),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    renterMessage: v.optional(v.string()),
    ownerMessage: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_renter", ["renterId"])
    .index("by_owner", ["ownerId"]),

  favorites: defineTable({
    userId: v.string(),
    vehicleId: v.id("vehicles"),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    vehicleId: v.optional(v.id("vehicles")),
    renterId: v.string(),
    ownerId: v.string(),
    lastMessageAt: v.number(),
    lastMessageText: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.string()),
    unreadCountRenter: v.number(),
    unreadCountOwner: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
    messageType: v.union(v.literal("text"), v.literal("system")),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  teams: defineTable({
    ownerId: v.string(),
    name: v.string(),
    description: v.string(),
    logoUrl: v.optional(v.string()),
    location: v.string(),
    experience: v.string(),
    specialties: v.array(v.string()),
    availableSeats: v.number(),
    requirements: v.string(),
    contactInfo: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  driverProfiles: defineTable({
    userId: v.string(),
    bio: v.string(),
    experience: v.string(),
    licenses: v.array(v.string()),
    preferredCategories: v.array(v.string()),
    availability: v.string(),
    location: v.string(),
    contactInfo: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  teamApplications: defineTable({
    teamId: v.id("teams"),
    driverId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    message: v.string(),
    driverExperience: v.string(),
    preferredDates: v.string(),
    createdAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_driver", ["driverId"]),
});
