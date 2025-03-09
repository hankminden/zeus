import { sql } from "drizzle-orm";
import { real, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getChargers } from "@/lib/api/chargers/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const chargers = pgTable("chargers", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  lat: real("lat").notNull(),
  long: real("long").notNull(),
  status: varchar("status", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for chargers - used to validate API requests
const baseSchema = createSelectSchema(chargers).omit(timestamps);

export const insertChargerSchema = createInsertSchema(chargers).omit(timestamps);
export const insertChargerParams = baseSchema
  .extend({
    lat: z.coerce.number(),
    long: z.coerce.number(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateChargerSchema = baseSchema;
export const updateChargerParams = baseSchema
  .extend({
    lat: z.coerce.number(),
    long: z.coerce.number(),
  })
  .omit({
    userId: true,
  });
export const chargerIdSchema = baseSchema.pick({ id: true });

// Types for chargers - used to type API request params and within Components
export type Charger = typeof chargers.$inferSelect;
export type NewCharger = z.infer<typeof insertChargerSchema>;
export type NewChargerParams = z.infer<typeof insertChargerParams>;
export type UpdateChargerParams = z.infer<typeof updateChargerParams>;
export type ChargerId = z.infer<typeof chargerIdSchema>["id"];

// this type infers the return from getChargers() - meaning it will include any joins
export type CompleteCharger = Awaited<ReturnType<typeof getChargers>>["chargers"][number];
