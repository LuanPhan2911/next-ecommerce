import { db } from "@/lib/db";
import { PlantTable } from "@/types";

import { FertilizerType, Season } from "@prisma/client";

type PlantParams = {
  name: string;
  imageUrl?: string;
  categoryId: string;
  growthDuration: number;
  season?: Season;
  idealTemperature?: {
    unitId: string;
    value: number;
  };
  idealHumidity?: {
    unitId: string;
    value: number;
  };
  waterRequirement?: {
    unitId: string;
    value: number;
  };
  fertilizerType: FertilizerType;
};
export const createPlant = async (params: PlantParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      categoryId,
      fertilizerType,
      growthDuration,
      name,
      season,
      imageUrl,
    } = params;
    const idealTemperature = params.idealTemperature
      ? await ctx.floatUnit.create({
          data: {
            ...params.idealTemperature,
          },
        })
      : null;
    const idealHumidity = params.idealHumidity
      ? await ctx.intUnit.create({
          data: {
            ...params.idealHumidity,
          },
        })
      : null;
    const waterRequirement = params.waterRequirement
      ? await ctx.floatUnit.create({
          data: {
            ...params.waterRequirement,
          },
        })
      : null;

    const plant = await ctx.plant.create({
      data: {
        name,
        imageUrl,
        season,
        categoryId,
        fertilizerType,
        growthDuration,
        idealTemperatureId: idealTemperature?.id,
        idealHumidityId: idealHumidity?.id,
        waterRequirementId: waterRequirement?.id,
      },
    });
    return plant;
  });
};
export const updatePlant = async (id: string, params: PlantParams) => {
  return await db.$transaction(async (ctx) => {
    const {
      idealHumidity: idealHumidityParam,
      idealTemperature: idealTemperatureParam,
      waterRequirement: waterRequirementParam,
      ...otherParams
    } = params;
    const plant = await ctx.plant.update({
      where: {
        id,
      },
      data: {
        ...otherParams,
      },
    });
    if (idealTemperatureParam) {
      if (plant.idealTemperatureId) {
        await ctx.floatUnit.update({
          where: {
            id: plant.idealTemperatureId,
          },
          data: {
            ...idealTemperatureParam,
          },
        });
      } else {
        await ctx.floatUnit.create({
          data: { ...idealTemperatureParam },
        });
      }
    }
    if (idealHumidityParam) {
      if (plant.idealHumidityId) {
        await ctx.intUnit.update({
          where: {
            id: plant.idealHumidityId,
          },
          data: {
            ...idealHumidityParam,
          },
        });
      } else {
        await ctx.intUnit.create({
          data: {
            ...idealHumidityParam,
          },
        });
      }
    }
    if (waterRequirementParam) {
      if (plant.waterRequirementId) {
        await ctx.floatUnit.update({
          where: {
            id: plant.waterRequirementId,
          },
          data: {
            ...waterRequirementParam,
          },
        });
      } else {
        await ctx.floatUnit.create({
          data: {
            ...waterRequirementParam,
          },
        });
      }
    }
    return plant;
  });
};
export const deletePlant = async (id: string) => {
  return await db.$transaction(async (ctx) => {
    const plant = await ctx.plant.delete({ where: { id } });
    if (plant.idealTemperatureId) {
      await ctx.floatUnit.delete({
        where: { id: plant.idealTemperatureId },
      });
    }
    if (plant.idealHumidityId) {
      await ctx.intUnit.delete({
        where: { id: plant.idealHumidityId },
      });
    }
    if (plant.waterRequirementId) {
      await ctx.floatUnit.delete({
        where: { id: plant.waterRequirementId },
      });
    }
    return plant;
  });
};
export const getPlants = async () => {
  try {
    const plants = await db.plant.findMany({
      include: {
        idealTemperature: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        idealHumidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        waterRequirement: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    });
    return plants;
  } catch (error) {
    return [];
  }
};
export const getPlantById = async (id: string) => {
  try {
    const plant = await db.plant.findUnique({
      where: {
        id,
      },
      include: {
        idealTemperature: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        idealHumidity: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        waterRequirement: {
          include: {
            unit: {
              select: {
                name: true,
              },
            },
          },
        },
        category: true,
      },
    });

    return plant;
  } catch (error) {
    return null;
  }
};