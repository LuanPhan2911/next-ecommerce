"use client";

import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { CropSelectWithField } from "@/types";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

interface CropSelectProps {
  orgId?: string;
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
  labelKey?: keyof CropSelectWithField;
  valueKey?: keyof CropSelectWithField;
}
export const CropsSelect = (props: CropSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["crops_select", props.orgId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/crops/select",
          query: {
            orgId: props.orgId,
          },
        },

        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as CropSelectWithField[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      data={data}
      valueKey={props.valueKey || "id"}
      labelKey={props.labelKey || "name"}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={item.field.name}
        />
      )}
    />
  );
};
