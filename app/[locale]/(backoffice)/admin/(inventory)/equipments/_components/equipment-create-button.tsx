"use client";

import { create } from "@/actions/equipment";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { LinkButton } from "@/components/buttons/link-button";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePicker } from "@/components/form/date-picker";
import { SelectOptions } from "@/components/form/select-options";
import { UploadImage } from "@/components/form/upload-image";

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
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { EquipmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentType, UnitType } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const EquipmentCreateButton = () => {
  const t = useTranslations("equipments.form");
  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  return (
    <LinkButton
      href="equipments/create"
      label={t("create.label")}
      disabled={!canCreate}
      icon={Plus}
      variant={"success"}
    />
  );
};

export const EquipmentCreateForm = () => {
  const tSchema = useTranslations("equipments.schema");
  const formSchema = EquipmentSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const router = useRouterWithRole();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "AgriculturalMachine",
    },
  });
  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("equipments");
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error("Internal error");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl"
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("imageUrl.label")}</FormLabel>
              <FormControl>
                <UploadImage
                  onChange={field.onChange}
                  disabled={isPending || !canCreate}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("name.placeholder")}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || !canCreate}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("type.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    placeholder={tSchema("type.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(EquipmentType).map((item) => {
                      return {
                        label: tSchema(`type.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                    disabled={isPending || !canCreate}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("purchaseDate.label")}</FormLabel>
                <FormControl>
                  <DatePicker
                    onChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={isPending || !canCreate}
                    placeholder={tSchema("purchaseDate.placeholder")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("brand.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("brand.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canCreate}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="purchasePrice.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("purchasePrice.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("purchasePrice.placeholder")}
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
              name="purchasePrice.unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("purchasePrice.unitId.label")}</FormLabel>
                  <FormControl>
                    <UnitsSelect
                      onChange={field.onChange}
                      placeholder={tSchema("purchasePrice.unitId.placeholder")}
                      unitType={UnitType.MONEY}
                      disabled={isPending || !canCreate}
                      className="w-full"
                      error={tSchema("purchasePrice.unitId.error")}
                      notFound={tSchema("purchasePrice.unitId.notFound")}
                      defaultValue={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tSchema("description.placeholder")}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || !canCreate}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || !canCreate}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
