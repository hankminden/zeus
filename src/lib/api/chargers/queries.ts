import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ChargerId, chargerIdSchema, chargers } from "@/lib/db/schema/chargers";

export const getChargers = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(chargers).where(eq(chargers.userId, session?.user.id!));
  const c = rows;
  return { chargers: c };
};

export const getChargerById = async (id: ChargerId) => {
  const { session } = await getUserAuth();
  const { id: chargerId } = chargerIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(chargers)
    .where(and(eq(chargers.id, chargerId), eq(chargers.userId, session?.user.id!)));
  if (row === undefined) return {};
  const c = row;
  return { charger: c };
};
