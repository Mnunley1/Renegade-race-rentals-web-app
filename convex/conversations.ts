import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("renterId"), args.userId),
          q.eq(q.field("ownerId"), args.userId)
        )
      )
      .collect();

    // Fetch related data for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        // Get the other user in the conversation
        const otherUserId =
          conversation.renterId === args.userId
            ? conversation.ownerId
            : conversation.renterId;

        const otherUser = await ctx.db
          .query("users")
          .withIndex("by_external_id", (q) => q.eq("externalId", otherUserId))
          .first();

        // Get vehicle details if available
        let vehicle = null;
        if (conversation.vehicleId) {
          vehicle = await ctx.db.get(conversation.vehicleId);
        }

        return {
          ...conversation,
          otherUser,
          vehicle,
        };
      })
    );

    // Sort by last message time (most recent first)
    return conversationsWithDetails.sort(
      (a, b) => b.lastMessageAt - a.lastMessageAt
    );
  },
});

export const create = mutation({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
    renterId: v.string(),
    ownerId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.eq(q.field("renterId"), args.renterId),
          q.eq(q.field("ownerId"), args.ownerId),
          args.vehicleId
            ? q.eq(q.field("vehicleId"), args.vehicleId)
            : q.eq(q.field("vehicleId"), undefined)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      vehicleId: args.vehicleId,
      renterId: args.renterId,
      ownerId: args.ownerId,
      lastMessageAt: Date.now(),
      lastMessageText: "",
      lastMessageSenderId: "",
      unreadCountRenter: 0,
      unreadCountOwner: 0,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const isRenter = conversation.renterId === args.userId;

    await ctx.db.patch(args.conversationId, {
      unreadCountRenter: isRenter ? 0 : conversation.unreadCountRenter,
      unreadCountOwner: isRenter ? conversation.unreadCountOwner : 0,
      updatedAt: Date.now(),
    });

    return args.conversationId;
  },
});
