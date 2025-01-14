"use server";

import { CropEndDateInvalidError, CropUpdateStatusFinishError } from "@/errors";
import { errorResponse, successResponse } from "@/lib/utils";
import { CropLearnedLessonsSchema, CropSchema } from "@/schemas";
import {
  createCrop,
  deleteCrop,
  updateCrop,
  updateCropLearnedLessons,
  updateCropStatusFinish,
} from "@/services/crops";
import { ActionResponse } from "@/types";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const create = async (
  values: z.infer<ReturnType<typeof CropSchema>>
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("crops.schema");
  const tStatus = await getTranslations("crops.status");
  const paramsSchema = CropSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const crop = await createCrop(validatedFields.data);

    revalidatePath(`/admin/crops`);
    return successResponse(tStatus("success.create"));
  } catch (error) {
    return errorResponse(tStatus("failure.create"));
  }
};
export const edit = async (
  values: z.infer<ReturnType<typeof CropSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("crops.schema");
  const tStatus = await getTranslations("crops.status");
  const paramsSchema = CropSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const crop = await updateCrop(id, validatedFields.data);

    revalidatePath(`/admin/crops`);
    revalidatePath(`/admin/crops/detail/${id}`);

    return successResponse(tStatus("success.edit"));
  } catch (error) {
    return errorResponse(tStatus("failure.edit"));
  }
};
export const editLearnedLessons = async (
  values: z.infer<ReturnType<typeof CropLearnedLessonsSchema>>,
  id: string
): Promise<ActionResponse> => {
  const tSchema = await getTranslations("crops.schema");
  const tStatus = await getTranslations("crops.status");
  const paramsSchema = CropLearnedLessonsSchema(tSchema);
  const validatedFields = paramsSchema.safeParse(values);

  if (!validatedFields.success) {
    return errorResponse(tSchema("errors.parse"));
  }
  try {
    const crop = await updateCropLearnedLessons(id, validatedFields.data);

    revalidatePath(`/admin/crops/detail/${id}`);

    return successResponse(tStatus("success.editLearnedLessons"));
  } catch (error) {
    return errorResponse(tStatus("failure.editLearnedLessons"));
  }
};
export const destroy = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("crops.status");
  try {
    const crop = await deleteCrop(id);

    revalidatePath(`/admin/crops`);
    return successResponse(tStatus("success.destroy"));
  } catch (error) {
    return errorResponse(tStatus("failure.destroy"));
  }
};

export const finishCrop = async (id: string): Promise<ActionResponse> => {
  const tStatus = await getTranslations("crops.status");
  const tSchema = await getTranslations("crops.schema");
  try {
    await updateCropStatusFinish(id);
    revalidatePath("/admin/crops");
    return successResponse(tStatus("success.finish"));
  } catch (error) {
    if (error instanceof CropUpdateStatusFinishError) {
      return errorResponse(tSchema("errors.cropUpdateStatusFinish"));
    }
    if (error instanceof CropEndDateInvalidError) {
      return errorResponse(tSchema("errors.endDateInValid"));
    }
    return errorResponse(tStatus("failure.finish"));
  }
};
