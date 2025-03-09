import ChargerList from "@/components/chargers/ChargerList";
import NewChargerModal from "@/components/chargers/ChargerModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export const dynamic = "force-dynamic";

export default async function Chargers() {
  await checkAuth();
  const { chargers } = await api.chargers.getChargers.query();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Chargers</h1>
        <NewChargerModal />
      </div>
      <ChargerList chargers={chargers} />
    </main>
  );
}
