"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { JobsTableAction } from "./jobs-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/job";
import { toast } from "sonner";
import { JobTable } from "@/types";
import { JobPublishedSwitch } from "./job-published-switch";
import { JobExpired } from "./job-expired";

interface JobsTableProps {
  data: JobTable[];
}
export const JobsTable = ({ data }: JobsTableProps) => {
  const tSchema = useTranslations("jobs.schema");
  const t = useTranslations("jobs");

  const { onOpen, onClose } = useAlertDialog();

  const columns: ColumnDef<JobTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.name")}
          />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: t("table.thead.quantity"),
    },
    {
      accessorKey: "experience",
      header: t("table.thead.experience"),
      cell: ({ row }) => {
        const data = row.original.experience;
        return tSchema(`experience.options.${data}`);
      },
    },
    {
      accessorKey: "gender",
      header: t("table.thead.gender"),
      cell: ({ row }) => {
        const data = row.original.gender;
        return tSchema(`gender.options.${data}`);
      },
    },
    {
      accessorKey: "expiredAt",
      header: t("table.thead.expiredAt"),
      cell: ({ row }) => {
        const data = row.original.expiredAt;
        return <JobExpired expiredAt={data} />;
      },
    },
    {
      accessorKey: "published",
      header: t("table.thead.published"),
      cell: ({ row }) => {
        const { id, published } = row.original;
        return <JobPublishedSwitch id={id} published={published} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <JobsTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: t("form.destroySelected.label"),
      action: (rows: JobTable[]) => {
        onOpen({
          title: t("form.destroySelected.title"),
          description: t("form.destroySelected.description"),
          onConfirm: () => {
            const ids = rows.map((row) => row.id);
            destroyMany(ids)
              .then(({ message, ok }) => {
                if (ok) {
                  toast.success(message);
                } else {
                  toast.error(message);
                }
              })
              .catch((error: Error) => {
                toast.error(t("status.failure.destroy"));
              })
              .finally(() => {
                onClose();
              });
          },
        });
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("heading")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          filterColumn={{
            isShown: true,
            value: "name",
            placeholder: t("search.placeholder"),
          }}
          bulkActions={bulkActions}
        />
      </CardContent>
    </Card>
  );
};