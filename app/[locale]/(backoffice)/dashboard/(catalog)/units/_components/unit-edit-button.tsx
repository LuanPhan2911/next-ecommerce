"use client";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { UnitSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unit } from "@prisma/client";
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
import { edit } from "@/actions/unit";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface UnitEditButtonProps {
  data: Unit;
  label: string;
}

export const UnitEditButton = ({ data, label }: UnitEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("unit.edit", {
          unit: data,
        })
      }
    >
      <Edit className="w-6 h-6 mr-2" />
      {label}
    </Button>
  );
};
export const UnitEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "unit.edit";

  const tSchema = useTranslations("units.schema");
  const tUnit = useTranslations("units");
  const tEdit = useTranslations("units.form.edit");
  const tForm = useTranslations("form");
  const formSchema = UnitSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.unit) {
      form.setValue("name", data.unit.name);
      form.setValue("description", data.unit.description);
      setId(data.unit.id);
    }
  }, [data, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      edit(values, id)
        .then(({ message }) => {
          form.reset();
          onClose();
          toast.success(message);
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={tEdit("title")}
      description={tEdit("description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tSchema("description.placeholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {tForm("button.close")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {tForm("button.submit")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DynamicDialog>
  );
};