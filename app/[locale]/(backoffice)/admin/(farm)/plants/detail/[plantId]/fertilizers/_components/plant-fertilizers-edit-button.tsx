"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { PlantFertilizerSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PlantFertilizerTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/plant-fertilizer";
import { Textarea } from "@/components/ui/textarea";
import { FertilizersSelect } from "@/app/[locale]/(backoffice)/admin/_components/fertilizers-select";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { EditButton } from "@/components/buttons/edit-button";
import { CategoriesSelect } from "@/app/[locale]/(backoffice)/admin/_components/categories-select";

interface PlantFertilizerEditButtonProps {
  data: PlantFertilizerTable;
}

export const PlantFertilizerEditButton = ({
  data,
}: PlantFertilizerEditButtonProps) => {
  const { isOnlyAdmin: canEdit } = useCurrentStaffRole();
  return (
    <EditButton
      inltKey="plantFertilizers"
      type="plantFertilizer.edit"
      className="w-full"
      data={{
        plantFertilizer: data,
      }}
      disabled={!canEdit}
    />
  );
};
export const PlantFertilizerEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "plantFertilizer.edit";

  const tSchema = useTranslations("plantFertilizers.schema");
  const t = useTranslations("plantFertilizers");
  const formSchema = PlantFertilizerSchema(tSchema);

  const { isOnlyAdmin: canEdit } = useCurrentStaffRole();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.plantFertilizer) {
      form.reset(data.plantFertilizer);
      setId(data.plantFertilizer.id);
    }
  }, [data, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      edit(values, id)
        .then(({ message, ok }) => {
          if (ok) {
            onClose();
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
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
      className="max-w-5xl overflow-y-auto max-h-screen"
    >
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
                        disabled={isPending || !canEdit}
                        onChange={field.onChange}
                        appearance={{
                          button: "lg:w-full",
                          content: "lg:w-[380px]",
                        }}
                        defaultValue={field.value}
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
                            disabled={isPending || !canEdit}
                          />
                        </div>
                        <CategoriesSelect
                          error={tSchema("stage.select.error")}
                          notFound={tSchema("stage.select.notFound")}
                          placeholder={tSchema("stage.select.placeholder")}
                          type="PLANT_STAGE"
                          disabled={isPending || !canEdit}
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
                            disabled={isPending || !canEdit}
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
                          disabled={isPending || !canEdit}
                          className="w-full"
                          error={tSchema("dosage.unitId.error")}
                          notFound={tSchema("dosage.unitId.notFound")}
                          defaultValue={field.value}
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
                        disabled={isPending || !canEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DynamicDialogFooter disabled={isPending || !canEdit} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
