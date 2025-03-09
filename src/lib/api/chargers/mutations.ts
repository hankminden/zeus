import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  ChargerId,
  NewChargerParams,
  UpdateChargerParams,
  updateChargerSchema,
  insertChargerSchema,
  chargers,
  chargerIdSchema,
} from "@/lib/db/schema/chargers";
import { getUserAuth } from "@/lib/auth/utils";

export const createCharger = async (charger: NewChargerParams) => {
  const { session } = await getUserAuth();
  const newCharger = insertChargerSchema.parse({ ...charger, userId: session?.user.id! });
  try {
    const [c] = await db.insert(chargers).values(newCharger).returning();
    return { charger: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCharger = async (id: ChargerId, charger: UpdateChargerParams) => {
  const { session } = await getUserAuth();
  const { id: chargerId } = chargerIdSchema.parse({ id });
  const newCharger = updateChargerSchema.parse({ ...charger, userId: session?.user.id! });
  try {
    const [c] = await db
      .update(chargers)
      .set({ ...newCharger, updatedAt: new Date() })
      .where(and(eq(chargers.id, chargerId!), eq(chargers.userId, session?.user.id!)))
      .returning();
    return { charger: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCharger = async (id: ChargerId) => {
  const { session } = await getUserAuth();
  const { id: chargerId } = chargerIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(chargers)
      .where(and(eq(chargers.id, chargerId!), eq(chargers.userId, session?.user.id!)))
      .returning();
    return { charger: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
