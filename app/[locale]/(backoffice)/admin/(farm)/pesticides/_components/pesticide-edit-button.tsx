"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { PesticideSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { PesticideType, UnitType, ToxicityLevel } from "@prisma/client";
import { Edit } from "lucide-react";
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
import { SelectOptions } from "@/components/form/select-options";
import { PesticideTable } from "@/types";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/pesticide";
import { Textarea } from "@/components/ui/textarea";

interface PesticideEditButtonProps {
  data: PesticideTable;
  label: string;
}

export const PesticideEditButton = ({
  data,
  label,
}: PesticideEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("pesticide.edit", {
          pesticide: data,
        });
      }}
      size={"sm"}
      variant={"edit"}
    >
      <Edit className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
export const PesticideEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "pesticide.edit";

  const tSchema = useTranslations("pesticides.schema");
  const t = useTranslations("pesticides");
  const formSchema = PesticideSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.pesticide) {
      form.reset(data.pesticide);
      setId(data.pesticide.id);
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
          toast.error(t("status.failure.edit"));
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
      className="max-w-4xl overflow-y-auto max-h-screen"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
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
                      label={tSchema("type.placeholder")}
                      onChange={field.onChange}
                      options={Object.keys(PesticideType).map((item) => {
                        return {
                          label: tSchema(`type.options.${item}`),
                          value: item,
                        };
                      })}
                      disabled={isPending}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toxicityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("toxicityLevel.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      label={tSchema("toxicityLevel.placeholder")}
                      onChange={field.onChange}
                      options={Object.keys(ToxicityLevel).map((item) => {
                        return {
                          label: tSchema(`toxicityLevel.options.${item}`),
                          value: item,
                        };
                      })}
                      defaultValue={field.value}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="recommendedDosage.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("recommendedDosage.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("recommendedDosage.placeholder")}
                        value={field.value || undefined}
                        onChange={field.onChange}
                        disabled={isPending}
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
              name="recommendedDosage.unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tSchema("recommendedDosage.unitId.label")}
                  </FormLabel>
                  <FormControl>
                    <UnitsSelectWithQueryClient
                      onChange={field.onChange}
                      placeholder={tSchema(
                        "recommendedDosage.unitId.placeholder"
                      )}
                      unitType={UnitType.VOLUME}
                      disabled={isPending}
                      className="w-full"
                      errorLabel={tSchema("recommendedDosage.unitId.error")}
                      notFound={tSchema("recommendedDosage.unitId.notFound")}
                      defaultValue={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="withdrawalPeriod.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("withdrawalPeriod.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("withdrawalPeriod.placeholder")}
                        value={field.value || undefined}
                        onChange={field.onChange}
                        disabled={isPending}
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
              name="withdrawalPeriod.unitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tSchema("withdrawalPeriod.unitId.label")}
                  </FormLabel>
                  <FormControl>
                    <UnitsSelectWithQueryClient
                      onChange={field.onChange}
                      placeholder={tSchema(
                        "withdrawalPeriod.unitId.placeholder"
                      )}
                      unitType={UnitType.DATE}
                      disabled={isPending}
                      className="w-full"
                      errorLabel={tSchema("withdrawalPeriod.unitId.error")}
                      notFound={tSchema("withdrawalPeriod.unitId.notFound")}
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
            name="applicationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("applicationMethod.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("applicationMethod.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("ingredient.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Textarea
                      value={field.value || undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                      placeholder={tSchema("ingredient.placeholder")}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("manufacturer.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("manufacturer.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DynamicDialogFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicDialog>
  );
};