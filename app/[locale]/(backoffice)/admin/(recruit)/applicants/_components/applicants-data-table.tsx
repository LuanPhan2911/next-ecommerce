"use client";
import { DataTable } from "@/components/datatable";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { ApplicantsTableAction } from "./applicants-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/applicant";
import { toast } from "sonner";
import { ApplicantStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ApplicantTable } from "@/types";
import { useDialog } from "@/stores/use-dialog";
import { JobsSelect } from "../../../_components/jobs-select";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface ApplicantsTableProps {
  applicants: ApplicantTable[];
}
export const ApplicantsTable = ({ applicants }: ApplicantsTableProps) => {
  const t = useTranslations("applicants");
  const tSchema = useTranslations("applicants.schema.jobId");
  const { updateSearchParam, initialParam } = useUpdateSearchParam("jobId");
  const { onOpen, onClose, setPending } = useAlertDialog();
  const { onOpen: onOpenModal } = useDialog();
  const { isSuperAdmin } = useCurrentStaffRole();
  const handleConfirm = (rows: ApplicantTable[]) => {
    setPending(true);
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
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  const handleCreateStaff = (data: ApplicantTable) => {
    if (!isSuperAdmin || data.status === "CONFIRM") {
      return;
    }
    onOpenModal("applicant.createStaff", {
      applicant: data,
    });
  };
  const columns: ColumnDef<ApplicantTable>[] = [
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
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: t("table.thead.status"),
      cell: ({ row }) => {
        const data = row.original;
        if (data.status === ApplicantStatus.NEW) {
          return <Badge variant={"info"}>{data.status}</Badge>;
        }
        return <Badge variant={"success"}>{data.status}</Badge>;
      },
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
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.email")}
          />
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.address")}
          />
        );
      },
    },
    {
      accessorKey: "phone",
      header: t("table.thead.phone"),
    },
    {
      accessorKey: "note",
      header: t("table.thead.note"),
      cell: ({ row }) => {
        const data = row.original;
        return data.note || t("table.trow.note");
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <ApplicantsTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: t("form.destroyMany.label"),
      action: (rows: ApplicantTable[]) => {
        onOpen({
          title: t("form.destroyMany.title"),
          description: t("form.destroyMany.description"),
          onConfirm: () => handleConfirm(rows),
        });
      },
      disabled: !isSuperAdmin,
    },
  ];
  const facetedFilters = [
    {
      column: "status",
      label: t("search.faceted.status.placeholder"),
      options: Object.values(ApplicantStatus).map((item) => {
        return {
          label: t(`schema.status.options.${item}`),
          value: item,
        };
      }),
    },
  ];

  return (
    <>
      <JobsSelect
        error={tSchema("error")}
        notFound={tSchema("notFound")}
        onChange={updateSearchParam}
        placeholder={tSchema("placeholder")}
        defaultValue={initialParam}
      />
      <DataTable
        columns={columns}
        data={applicants}
        searchable={{
          value: "email",
          placeholder: t("search.placeholder"),
        }}
        bulkActions={bulkActions}
        facetedFilters={facetedFilters}
        onViewDetail={handleCreateStaff}
      />
    </>
  );
};
