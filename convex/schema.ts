import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const timestamps = {
  createdAt: v.number(),
  updatedAt: v.number(),
}

export default defineSchema({
  services: defineTable({
    name: v.string(),
    description: v.string(),
    ...timestamps,
  }),
  pricing: defineTable({
    name: v.string(),
    price: v.number(),
    currency: v.string(),
    ...timestamps,
  }),
  emailTemplates: defineTable({
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    accent: v.optional(v.string()),
    ...timestamps,
  }),
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("replied"), v.literal("closed")),
    ...timestamps,
  }),
  settings: defineTable({
    siteName: v.string(),
    siteEmail: v.string(),
    sitePhone: v.string(),
    aboutText: v.string(),
    adminPassword: v.string(),
    lastPasswordChange: v.optional(v.number()),
    ...timestamps,
  }),
  admins: defineTable({
    username: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("admin"), v.literal("super_admin")),
    permissions: v.array(v.string()),
    isActive: v.boolean(),
    lastLogin: v.optional(v.number()),
    ...timestamps,
  }).index("by_username", ["username"]),
  bulkEmailContacts: defineTable({
    businessName: v.string(),
    email: v.string(),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("sent"), v.literal("failed"), v.literal("bounced")),
    batchId: v.string(),
    sentAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    ...timestamps,
  }).index("by_batch", ["batchId"]).index("by_batch_status", ["batchId", "status"]),
  bulkEmailTemplates: defineTable({
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    description: v.optional(v.string()),
    ...timestamps,
  }),
})
