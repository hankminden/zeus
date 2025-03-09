import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { chargersRouter } from "./chargers";

export const appRouter = router({
  computers: computersRouter,
  chargers: chargersRouter,
});

export type AppRouter = typeof appRouter;
