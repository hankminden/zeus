"use client";
import { CompleteCharger } from "@/lib/db/schema/chargers";
import { trpc } from "@/lib/trpc/client";
import ChargerModal from "./ChargerModal";

export default function ChargerList({ chargers }: { chargers: CompleteCharger[] }) {
  const { data: c } = trpc.chargers.getChargers.useQuery(undefined, {
    initialData: { chargers },
    refetchOnMount: false,
  });

  if (c.chargers.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.chargers.map((charger) => (
        <Charger charger={charger} key={charger.id} />
      ))}
    </ul>
  );
}

const Charger = ({ charger }: { charger: CompleteCharger }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{charger.lat}</div>
      </div>
      <ChargerModal charger={charger} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No chargers</h3>
      <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new charger.</p>
      <div className="mt-6">
        <ChargerModal emptyState={true} />
      </div>
    </div>
  );
};
