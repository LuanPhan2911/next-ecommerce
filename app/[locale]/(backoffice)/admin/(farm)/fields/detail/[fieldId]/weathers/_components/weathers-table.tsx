"use client";

import { NavPagination } from "@/components/nav-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import {
  WeatherCreateButton,
  WeatherCreateManyButton,
} from "./weather-create-button";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { WeatherTable } from "@/types";
import {
  WeatherConfirmButton,
  WeatherDeleteManyUnConfirmedButton,
  WeatherPinnedButton,
  WeathersConfirmedAllButton,
  WeathersExportButton,
  WeathersTableAction,
} from "./weathers-table-action";

import { WeatherStatusValue } from "./weather-status-value";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { WeatherTableFaceted } from "./weathers-table-faceted";
import { SelectItemContent } from "@/components/form/select-item";

import { useDialog } from "@/stores/use-dialog";

import { cn } from "@/lib/utils";
interface WeathersTableProps {
  data: WeatherTable[];
  totalPage: number;
}
export const WeathersTable = ({ data, totalPage }: WeathersTableProps) => {
  const t = useTranslations("weathers.table");
  const { dateTime, relativeTime } = useFormatter();
  const { onOpen } = useDialog();
  const handleEdit = (data: WeatherTable) => {
    onOpen("weather.edit", { weather: data });
  };

  return (
    <div className="flex flex-col gap-y-4 p-4 border rounded-lg my-4">
      <div className="flex lg:justify-end gap-1.5 flex-wrap">
        <WeatherCreateButton />
        <WeatherCreateManyButton />
        <WeathersExportButton />
        <WeathersConfirmedAllButton />
        <WeatherDeleteManyUnConfirmedButton />
      </div>
      <DatePickerWithRangeButton />
      <WeatherTableFaceted />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <OrderByButton
                column="createdAt"
                label={t("thead.createdAt")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead>{t("thead.status")} </TableHead>

            <TableHead className="text-right">
              <OrderByButton
                column="temperature.value"
                label={t("thead.temperature")}
              />
            </TableHead>
            <TableHead className="text-right">
              <OrderByButton
                column="humidity.value"
                label={t("thead.humidity")}
              />
            </TableHead>
            <TableHead className="text-right">
              <OrderByButton
                column="atmosphericPressure.value"
                label={t("thead.atmosphericPressure")}
              />
            </TableHead>
            <TableHead className="text-right">
              <OrderByButton
                column="rainfall.value"
                label={t("thead.rainfall")}
              />
            </TableHead>
            <TableHead>{t("thead.confirmed")} </TableHead>
            <TableHead>{t("thead.confirmedAt")} </TableHead>
            <TableHead>{t("thead.confirmedBy")} </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer group"
                onClick={() => handleEdit(item)}
              >
                <TableCell>
                  <WeatherPinnedButton
                    data={item}
                    className={cn(
                      !item.pinned && "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </TableCell>
                <TableCell>{dateTime(item.createdAt, "long")}</TableCell>
                <TableCell>
                  <WeatherStatusValue status={item.status} />
                </TableCell>

                <TableCell className="text-right">
                  {item.temperature?.value ? (
                    <UnitWithValue
                      value={item.temperature.value}
                      unit={item.temperature.unit?.name || "C"}
                    />
                  ) : (
                    t("trow.temperature")
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.humidity?.value ? (
                    <UnitWithValue
                      value={item.humidity?.value}
                      unit={item.humidity?.unit?.name || "%"}
                    />
                  ) : (
                    t("trow.humidity")
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.atmosphericPressure?.value ? (
                    <UnitWithValue
                      value={item.atmosphericPressure?.value}
                      unit={item.atmosphericPressure?.unit?.name || "hPa"}
                    />
                  ) : (
                    t("trow.atmosphericPressure")
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.rainfall?.value ? (
                    <UnitWithValue
                      value={item.rainfall?.value}
                      unit={item.rainfall?.unit?.name || "mm"}
                    />
                  ) : (
                    t("trow.rainfall")
                  )}
                </TableCell>
                <TableCell>
                  <WeatherConfirmButton data={item} />
                </TableCell>
                <TableCell>
                  {item.confirmedAt
                    ? relativeTime(item.confirmedAt)
                    : t("trow.confirmedAt")}
                </TableCell>
                <TableCell>
                  {item.confirmedBy ? (
                    <SelectItemContent
                      imageUrl={item.confirmedBy.imageUrl}
                      title={item.confirmedBy.name}
                    />
                  ) : (
                    t("trow.confirmedBy")
                  )}
                </TableCell>
                <TableCell>
                  <WeathersTableAction data={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}

      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </div>
  );
};
