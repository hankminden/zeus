import { getChargerById, getChargers } from "@/lib/api/chargers/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import { chargerIdSchema, insertChargerParams, updateChargerParams } from "@/lib/db/schema/chargers";
import { createCharger, deleteCharger, updateCharger } from "@/lib/api/chargers/mutations";

export const chargersRouter = router({
  getChargers: publicProcedure.query(async () => {
    return getChargers();
  }),
  getChargerById: publicProcedure.input(chargerIdSchema).query(async ({ input }) => {
    return getChargerById(input.id);
  }),
  createCharger: publicProcedure.input(insertChargerParams).mutation(async ({ input }) => {
    return createCharger(input);
  }),
  updateCharger: publicProcedure.input(updateChargerParams).mutation(async ({ input }) => {
    return updateCharger(input.id, input);
  }),
  deleteCharger: publicProcedure.input(chargerIdSchema).mutation(async ({ input }) => {
    return deleteCharger(input.id);
  }),
});
