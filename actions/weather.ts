"use server";

import { errorResponse, successResponse } from "@/lib/utils";
import { WeatherSchema } from "@/schemas";
import { currentStaff, getStaffByExternalId } from "@/services/staffs";
import { createFloatUnit } from "@/services/units";
import {
  confirmWeather,
  createWeather,
  deleteWeather,
  updateWeather,
} from "@/services/weathers";
import { ActionResponse } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof WeatherSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("weathers.schema");
  const tStatus = await getTranslations("weathers.status");
  const paramsSchema = WeatherSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const weather = await createWeather(validatedFields.data);

    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof WeatherSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("weathers.schema");
  const tStatus = await getTranslations("weathers.status");
  const paramsSchema = WeatherSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const weather = await updateWeather(id, validatedFields.data);

    revalidatePath(`/admin/fields/detail/${weather.fieldId}/weathers`);
    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const editConfirmed = async (id: string) => {
  const tStatus = await getTranslations("weathers.status");
  const tSchema = await getTranslations("weathers.schema");

  try {
    const staff = await currentStaff();
    if (!staff) {
      return errorResponse(tSchema("errors.existStaff"));
    }
    const weather = await confirmWeather(id, {
      confirmed: true,
      confirmedAt: new Date(),
      confirmedById: staff.id,
    });

    return successResponse(tStatus("success.editConfirmed"));
  } catch (error) {
    return errorResponse(tStatus("failure.editConfirmed"));
  }
};
export const destroy = async (id: string) => {
  const tStatus = await getTranslations("weathers.status");
  try {
    await deleteWeather(id);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};