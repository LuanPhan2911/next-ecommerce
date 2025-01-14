"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ErrorButton } from "../buttons/error-button";
import { LargeCard } from "../cards/large-card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface BarChartContentProps<T extends Record<string, any>> {
  data: T[] | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<T[], Error>>;

  chartConfig: ChartConfig;
  xAxisKey: keyof T;
  chartData: (data: T[]) => any[] | undefined;
  t: (key: string, object?: Record<string, any>) => string;
  tickFormatter?: ((value: any, index: number) => string) | undefined;
  labelFormatter?:
    | ((label: any, payload: Payload<ValueType, NameType>[]) => ReactNode)
    | undefined;
  description?: string | null;
  layout?: "horizontal" | "vertical";
}
export const BarChartContent = <T extends Record<string, any>>({
  data,
  isError,
  isPending,
  chartConfig,
  xAxisKey,
  tickFormatter,
  labelFormatter,
  chartData,
  refetch,
  t,
  description,
}: BarChartContentProps<T>) => {
  if (isPending) {
    return <Skeleton className="w-full min-h-[200px]"></Skeleton>;
  }
  if (isError) {
    return (
      <LargeCard
        title={<ErrorButton title={t("error.title")} refresh={refetch} />}
        description={t("error.description")}
      />
    );
  }
  if (!data?.length) {
    return (
      <LargeCard
        title={t("notFound.title")}
        description={t("notFound.description")}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-semibold">{t("title")}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <HorizonBarChart
          axisKey={xAxisKey as string}
          chartConfig={chartConfig}
          data={chartData(data)}
          labelFormatter={labelFormatter}
          tickFormatter={tickFormatter}
        />
      </CardContent>
    </Card>
  );
};

interface BarChartProps {
  chartConfig: ChartConfig;
  data: any[] | undefined;
  tickFormatter?: ((value: any, index: number) => string) | undefined;
  labelFormatter?:
    | ((label: any, payload: Payload<ValueType, NameType>[]) => ReactNode)
    | undefined;
  axisKey: string;
}
const HorizonBarChart = ({
  chartConfig,
  axisKey,
  data,
  labelFormatter,
  tickFormatter,
}: BarChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data} layout="horizontal">
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={axisKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={tickFormatter}
        />
        <YAxis />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
          labelFormatter={labelFormatter}
          cursor={false}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key) => {
          return (
            <Bar
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={4}
              key={key}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
};
