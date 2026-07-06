/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConvexHttpClient } from "convex/browser"
import { makeFunctionReference } from "convex/server"

function client() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured. Run `npx convex dev`.")
  }
  return new ConvexHttpClient(url)
}

export const convex = {
  query: <Args extends Record<string, unknown>, Result>(name: string, args: Args) =>
    client().query(makeFunctionReference(name) as any, args) as Promise<Result>,
  mutation: <Args extends Record<string, unknown>, Result>(name: string, args: Args) =>
    client().mutation(makeFunctionReference(name) as any, args) as Promise<Result>,
}

export function adminKey() {
  return process.env.NEXT_PUBLIC_ADMIN_API_KEY || "default-admin-key"
}

export type ConvexDoc = Record<string, unknown> & { _id: string }

export const db = {
  list: (table: string, options: { batchId?: string; status?: string; limit?: number } = {}) =>
    convex.query<Record<string, unknown>, ConvexDoc[]>("data:list", {
      adminKey: adminKey(),
      table,
      ...options,
    }),
  get: (id: string) =>
    convex.query<Record<string, unknown>, ConvexDoc | null>("data:get", { adminKey: adminKey(), id }),
  create: (table: string, data: Record<string, unknown>) =>
    convex.mutation<Record<string, unknown>, ConvexDoc>("data:create", {
      adminKey: adminKey(),
      table,
      data,
    }),
  createMany: (table: string, items: object[]) =>
    convex.mutation<Record<string, unknown>, string[]>("data:createMany", {
      adminKey: adminKey(),
      table,
      items: items as Array<Record<string, unknown>>,
    }),
  update: (id: string, data: Record<string, unknown>) =>
    convex.mutation<Record<string, unknown>, ConvexDoc | null>("data:update", {
      adminKey: adminKey(),
      id,
      data,
    }),
  remove: (id: string) =>
    convex.mutation<Record<string, unknown>, boolean>("data:remove", { adminKey: adminKey(), id }),
  removeBatch: (batchId: string) =>
    convex.mutation<Record<string, unknown>, number>("data:removeBatch", {
      adminKey: adminKey(),
      batchId,
    }),
  batches: () =>
    convex.query<Record<string, unknown>, ConvexDoc[]>("data:batches", { adminKey: adminKey() }),
}
