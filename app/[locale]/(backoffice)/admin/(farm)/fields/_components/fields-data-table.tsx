"use client";
import { DataTable } from "@/components/datatable";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";

import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { FieldTable } from "@/types";
import { FieldsTableAction } from "./fields-table-action";
import { UnitWithValue } from "../../../_components/unit-with-value";
import { useRouter } from "@/navigation";
import { SoilType } from "@prisma/client";

interface FieldsDataTableProps {
  data: FieldTable[];
}

export const FieldsDataTable = ({ data }: FieldsDataTableProps) => {
  const t = useTranslations("fields");
  const router = useRouter();
  const columns: ColumnDef<FieldTable>[] = [
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
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.location")}
          />
        );
      },
    },
    {
      accessorKey: "soilType",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.soilType")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.soilType) {
          return t("table.trow.soilType");
        }
        return t(`schema.soilType.options.${data.soilType}`);
      },
    },
    {
      accessorKey: "height",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.height")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <UnitWithValue value={data.height} unit={data.unit?.name} />;
      },
    },
    {
      accessorKey: "width",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.width")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <UnitWithValue value={data.width} unit={data.unit?.name} />;
      },
    },
    {
      accessorKey: "area",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.area")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const unit = data.unit?.name ? `${data.unit.name}2` : "";
        return <UnitWithValue value={data.area} unit={unit} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <FieldsTableAction data={data} />;
      },
    },
  ];
  const facetedFilters = [
    {
      column: "soilType",
      label: t("search.faceted.soilType.placeholder"),
      options: Object.values(SoilType).map((item) => {
        return {
          label: t(`schema.soilType.options.${item}`),
          value: item,
        };
      }),
    },
  ];
  const onViewDetail = (item: FieldTable) => {
    router.push(`/admin/fields/detail/${item.id}`);
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={{
        value: "name",
        placeholder: t("search.placeholder"),
      }}
      onViewDetail={onViewDetail}
      facetedFilters={facetedFilters}
    />
  );
};
