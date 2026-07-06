import { mutationGeneric as mutation, queryGeneric as query } from "convex/server"
import { v } from "convex/values"

const adminKey = v.string()
const table = v.union(
  v.literal("services"),
  v.literal("pricing"),
  v.literal("emailTemplates"),
  v.literal("contacts"),
  v.literal("settings"),
  v.literal("admins"),
  v.literal("bulkEmailContacts"),
  v.literal("bulkEmailTemplates")
)

function authorize(key: string) {
  const expected = process.env.ADMIN_API_KEY || "default-admin-key"
  if (key !== expected) throw new Error("Unauthorized")
}

export const list = query({
  args: {
    adminKey,
    table,
    batchId: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    let rows
    if (args.table === "bulkEmailContacts" && args.batchId && args.status) {
      rows = await ctx.db
        .query("bulkEmailContacts")
        .withIndex("by_batch_status", (q: any) =>
          q.eq("batchId", args.batchId!).eq("status", args.status)
        )
        .collect()
    } else if (args.table === "bulkEmailContacts" && args.batchId) {
      rows = await ctx.db
        .query("bulkEmailContacts")
        .withIndex("by_batch", (q) => q.eq("batchId", args.batchId!))
        .collect()
    } else {
      rows = await ctx.db.query(args.table).collect()
    }
    rows.sort((a, b) => b.createdAt - a.createdAt)
    return typeof args.limit === "number" ? rows.slice(0, args.limit) : rows
  },
})

export const get = query({
  args: { adminKey, id: v.string() },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    return await ctx.db.get(args.id as never)
  },
})

export const create = mutation({
  args: { adminKey, table, data: v.any() },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const now = Date.now()
    const id = await ctx.db.insert(args.table, { ...args.data, createdAt: now, updatedAt: now } as never)
    return await ctx.db.get(id)
  },
})

export const createMany = mutation({
  args: { adminKey, table, items: v.array(v.any()) },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const now = Date.now()
    const ids = []
    for (const item of args.items) {
      ids.push(await ctx.db.insert(args.table, { ...item, createdAt: now, updatedAt: now } as never))
    }
    return ids
  },
})

export const update = mutation({
  args: { adminKey, id: v.string(), data: v.any() },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const id = args.id as never
    if (!(await ctx.db.get(id))) return null
    await ctx.db.patch(id, { ...args.data, updatedAt: Date.now() })
    return await ctx.db.get(id)
  },
})

export const remove = mutation({
  args: { adminKey, id: v.string() },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const id = args.id as never
    if (!(await ctx.db.get(id))) return false
    await ctx.db.delete(id)
    return true
  },
})

export const removeBatch = mutation({
  args: { adminKey, batchId: v.string() },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const rows = await ctx.db
      .query("bulkEmailContacts")
      .withIndex("by_batch", (q) => q.eq("batchId", args.batchId))
      .collect()
    for (const row of rows) await ctx.db.delete(row._id)
    return rows.length
  },
})

export const batches = query({
  args: { adminKey },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const contacts = await ctx.db.query("bulkEmailContacts").collect()
    const grouped = new Map<string, {
      _id: string
      count: number
      pending: number
      sent: number
      failed: number
      createdAt: number
    }>()
    for (const contact of contacts) {
      const batch = grouped.get(contact.batchId) || {
        _id: contact.batchId,
        count: 0,
        pending: 0,
        sent: 0,
        failed: 0,
        createdAt: contact.createdAt,
      }
      batch.count++
      if (contact.status === "pending") batch.pending++
      if (contact.status === "sent") batch.sent++
      if (contact.status === "failed") batch.failed++
      batch.createdAt = Math.min(batch.createdAt, contact.createdAt)
      grouped.set(contact.batchId, batch)
    }
    return [...grouped.values()].sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const initialize = mutation({
  args: {
    adminKey,
    services: v.array(v.any()),
    pricing: v.array(v.any()),
    templates: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    authorize(args.adminKey)
    const tables = ["services", "pricing", "emailTemplates", "settings", "admins"] as const
    for (const name of tables) {
      for (const row of await ctx.db.query(name).collect()) await ctx.db.delete(row._id)
    }
    const now = Date.now()
    for (const row of args.services) await ctx.db.insert("services", { ...row, createdAt: now, updatedAt: now })
    for (const row of args.pricing) await ctx.db.insert("pricing", { ...row, createdAt: now, updatedAt: now })
    for (const row of args.templates) await ctx.db.insert("emailTemplates", { ...row, createdAt: now, updatedAt: now })
    await ctx.db.insert("settings", {
      siteName: "Techtics",
      siteEmail: "mohan0512vittal@gmail.com",
      sitePhone: "+1 (704) 490-0265",
      aboutText: "Digital solutions company",
      adminPassword: "admin123",
      createdAt: now,
      updatedAt: now,
    })
    await ctx.db.insert("admins", {
      username: "admin",
      email: "admin@techtics.com",
      password: "admin123",
      role: "super_admin",
      permissions: ["view", "edit", "delete", "manage_users"],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    return true
  },
})
