import { ActivityUpdateStatusError, EquipmentUsageExistError } from "@/errors";
import { canUpdateActivityStatus } from "@/lib/permission";
import { db } from "@/lib/db";
import { LIMIT } from "@/configs/paginationConfig";
import { getObjectSortOrder } from "@/lib/utils";
import {
  EquipmentUsageTable,
  EquipmentUsageTableWithCost,
  PaginatedResponse,
} from "@/types";
import { revalidatePath } from "next/cache";
import { equipmentDetailSelect } from "./equipment-details";
import { activitySelect } from "./activities";
import { unitSelect } from "./units";

type RevalidateEquipmentUsageParam = {
  equipmentDetailId: string;
  equipmentId: string;
  activityId: string | null;
};
export const revalidatePathEquipmentUsage = ({
  equipmentId,
  equipmentDetailId,
  activityId,
}: RevalidateEquipmentUsageParam) => {
  revalidatePath(`/admin/equipments/detail/${equipmentId}`);
  revalidatePath(`/admin/equipments/detail/${equipmentId}/details`);
  revalidatePath(
    `/admin/equipments/detail/${equipmentId}/details/${equipmentDetailId}/usages`
  );
  if (activityId) {
    revalidatePath(`/admin/activities/detail/${activityId}/equipment-usages`);
  }
};

type EquipmentUsageParams = {
  activityId?: string | null;
  equipmentDetailId: string;
  usageStartTime: Date;
  duration: number;
  operatorId?: string | null;
  note?: string | null;
  fuelConsumption?: number | null;
  unitId?: string | null;
  fuelPrice?: number | null;
  rentalPrice?: number | null;
};

export const createEquipmentUsage = async (params: EquipmentUsageParams) => {
  const [updatedEquipmentDetail, equipmentUsage] = await db.$transaction([
    db.equipmentDetail.update({
      where: {
        id: params.equipmentDetailId,
      },
      data: {
        status: "WORKING",
      },
    }),
    db.equipmentUsage.create({
      data: { ...params },
      include: {
        equipmentDetail: {
          select: {
            equipmentId: true,
          },
        },
      },
    }),
  ]);
  return { updatedEquipmentDetail, equipmentUsage };
};
type EquipmentUsageUpdateParams = {
  duration: number;
  note?: string | null;
  usageStartTime: Date;
  fuelConsumption?: number | null;
  unitId?: string | null;
  fuelPrice?: number | null;
  rentalPrice?: number | null;
  operatorId?: string | null;
};
export const updateEquipmentUsage = async (
  id: string,
  params: EquipmentUsageUpdateParams
) => {
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: {
      id,
    },
    data: {
      ...params,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};

export const assignEquipmentUsage = async (
  id: string,
  { activityId }: { activityId: string }
) => {
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: {
      id,
    },
    data: {
      activityId,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};
export const revokeEquipmentUsage = async (id: string) => {
  const updatedEquipmentUsage = await db.equipmentUsage.update({
    where: { id },
    data: {
      activityId: null,
    },
    include: {
      equipmentDetail: {
        select: {
          equipmentId: true,
        },
      },
    },
  });
  return updatedEquipmentUsage;
};
export const deleteEquipmentUsage = async (id: string) => {
  const equipmentUsage = await db.equipmentUsage.findUnique({
    where: { id },
    select: {
      activity: {
        select: {
          status: true,
        },
      },
      equipmentDetailId: true,
    },
  });
  if (!equipmentUsage) {
    throw new EquipmentUsageExistError();
  }
  if (equipmentUsage.activity) {
    if (!canUpdateActivityStatus(equipmentUsage.activity.status)) {
      throw new ActivityUpdateStatusError();
    }
  }

  //1: update equipment detail status to available
  //2: delete equipment usage
  const [deletedEquipmentUsage, updatedEquipmentDetail] = await db.$transaction(
    [
      db.equipmentUsage.delete({
        where: {
          id,
        },
        include: {
          equipmentDetail: {
            select: {
              equipmentId: true,
            },
          },
        },
      }),
      db.equipmentDetail.update({
        where: {
          id: equipmentUsage.equipmentDetailId,
        },
        data: {
          status: "AVAILABLE",
          location: null,
        },
      }),
    ]
  );
  return { updatedEquipmentDetail, deletedEquipmentUsage };
};
type EquipmentUsageQuery = {
  equipmentDetailId: string;
  page?: number;
  query?: string;
  orderBy?: string;
};
export const getEquipmentUsages = async ({
  equipmentDetailId,
  orderBy,
  page = 1,
  query,
}: EquipmentUsageQuery): Promise<PaginatedResponse<EquipmentUsageTable>> => {
  try {
    const [data, count] = await db.$transaction([
      db.equipmentUsage.findMany({
        take: LIMIT,
        skip: (page - 1) * LIMIT,
        where: {
          activityId: null,
          equipmentDetailId,
          equipmentDetail: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },

        include: {
          unit: {
            select: {
              ...unitSelect,
            },
          },
          equipmentDetail: {
            select: {
              ...equipmentDetailSelect,
            },
          },
          activity: {
            select: {
              ...activitySelect,
            },
          },
          operator: true,
        },
        orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
      }),
      db.equipmentUsage.count({
        where: {
          equipmentDetailId,
          equipmentDetail: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(count / LIMIT);
    return {
      data,
      totalPage,
    };
  } catch (error) {
    return {
      data: [],
      totalPage: 0,
    };
  }
};

type EquipmentUsageActivityQuery = {
  query?: string;
  orderBy?: string;
  activityId: string;
};
export const getEquipmentUsagesByActivity = async ({
  activityId,
  orderBy,
  query,
}: EquipmentUsageActivityQuery): Promise<EquipmentUsageTableWithCost[]> => {
  try {
    const data = await db.equipmentUsage.findMany({
      where: {
        OR: [
          {
            activityId: null,
          },
          {
            activityId,
          },
        ],

        equipmentDetail: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },

      include: {
        unit: {
          select: {
            ...unitSelect,
          },
        },
        equipmentDetail: {
          select: {
            ...equipmentDetailSelect,
          },
        },
        activity: {
          select: {
            ...activitySelect,
          },
        },
        operator: true,
      },
      orderBy: [...(orderBy ? getObjectSortOrder(orderBy) : [])],
    });

    const dataWithCost = data.map((item) => {
      let actualCost = 0;
      if (item.activityId === null) {
        return {
          ...item,
          actualCost: 0,
        };
      }
      if (item.rentalPrice !== null) {
        actualCost += item.rentalPrice;
      }
      if (item.fuelConsumption != null && item.fuelPrice !== null) {
        actualCost += item.fuelConsumption * item.fuelPrice;
      }

      return {
        ...item,
        actualCost,
      };
    });
    return dataWithCost;
  } catch (error) {
    return [];
  }
};
