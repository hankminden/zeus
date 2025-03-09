"use client";

import { Charger, NewChargerParams, insertChargerParams } from "@/lib/db/schema/chargers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ChargerForm = ({ charger, closeModal }: { charger?: Charger; closeModal?: () => void }) => {
  const editing = !!charger?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertChargerParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertChargerParams),
    defaultValues: charger ?? {
      lat: 0.0,
      long: 0.0,
      status: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete", data?: { error?: string }) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.chargers.getChargers.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Charger ${action}d!`);
  };

  const onError = async (action: "create" | "update" | "delete", data?: { error?: string }) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }
  };

  const { mutate: createCharger, isLoading: isCreating } = trpc.chargers.createCharger.useMutation({
    onSuccess: (res) => onSuccess("create"),
    onError: (err) => onError("create", { error: err.message }),
  });

  const { mutate: updateCharger, isLoading: isUpdating } = trpc.chargers.updateCharger.useMutation({
    onSuccess: (res) => onSuccess("update"),
    onError: (err) => onError("update", { error: err.message }),
  });

  const { mutate: deleteCharger, isLoading: isDeleting } = trpc.chargers.deleteCharger.useMutation({
    onSuccess: (res) => onSuccess("delete"),
    onError: (err) => onError("delete", { error: err.message }),
  });

  const handleSubmit = (values: NewChargerParams) => {
    if (editing) {
      updateCharger({ ...values, id: charger.id });
    } else {
      createCharger(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="lat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lat</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="long"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mr-1" disabled={isCreating || isUpdating}>
          {editing ? `Sav${isUpdating ? "ing..." : "e"}` : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button type="button" variant={"destructive"} onClick={() => deleteCharger({ id: charger.id })}>
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default ChargerForm;
