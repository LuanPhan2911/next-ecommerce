"use client";

import { create } from "@/actions/plant-fertilizer";
import { CategoriesSelect } from "@/app/[locale]/(backoffice)/admin/_components/categories-select";
import { FertilizersSelect } from "@/app/[locale]/(backoffice)/admin/_components/fertilizers-select";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { PlantFertilizerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const PlantFertilizerCreateButton = () => {
  const tSchema = useTranslations("plantFertilizers.schema");
  const t = useTranslations("plantFertilizers");
  const formSchema = PlantFertilizerSchema(tSchema);
  const { plantId } = useParams<{
    plantId: string;
  }>()!;

  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plantId,
      stage: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            setOpen(false);
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error("Internal error");
        });
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={!canCreate}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-y-2 border-r pr-2">
                <FormField
                  control={form.control}
                  name="fertilizerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("fertilizerId.label")}</FormLabel>
                      <FormControl>
                        <FertilizersSelect
                          placeholder={tSchema("fertilizerId.placeholder")}
                          error={tSchema("fertilizerId.error")}
                          notFound={tSchema("fertilizerId.notFound")}
                          disabled={isPending || !canCreate}
                          onChange={field.onChange}
                          appearance={{
                            button: "lg:w-full h-12",
                            content: "lg:w-[380px]",
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("stage.label")}</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-3">
                            <Input
                              placeholder={tSchema("stage.placeholder")}
                              value={field.value ?? undefined}
                              onChange={field.onChange}
                              disabled={isPending || !canCreate}
                            />
                          </div>
                          <CategoriesSelect
                            error={tSchema("stage.select.error")}
                            notFound={tSchema("stage.select.notFound")}
                            placeholder={tSchema("stage.select.placeholder")}
                            type="PLANT_STAGE"
                            disabled={isPending || !canCreate}
                            onChange={field.onChange}
                            valueKey="name"
                            hidden
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="dosage.value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{tSchema("dosage.label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={tSchema("dosage.placeholder")}
                              value={field.value ?? undefined}
                              onChange={field.onChange}
                              disabled={isPending || !canCreate}
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="dosage.unitId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("dosage.unitId.label")}</FormLabel>
                        <FormControl>
                          <UnitsSelect
                            onChange={field.onChange}
                            placeholder={tSchema("dosage.unitId.placeholder")}
                            unitType={UnitType.VOLUME}
                            disabled={isPending || !canCreate}
                            className="w-full"
                            error={tSchema("dosage.unitId.error")}
                            notFound={tSchema("dosage.unitId.notFound")}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("note.label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={tSchema("note.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending || !canCreate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DynamicDialogFooter disabled={isPending || !canCreate} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
