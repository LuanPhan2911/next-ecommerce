import {
  ActivityStatus,
  CropStatus,
  EquipmentStatus,
  StaffRole,
} from "@prisma/client";
export const isSuperAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin;
};
export const isOnlyAdmin = (role: StaffRole) => {
  return role === StaffRole.superadmin || role == StaffRole.admin;
};
export const isAdmin = (role: StaffRole) => {
  return role == StaffRole.admin;
};
export const isFarmer = (role: StaffRole) => {
  return role === StaffRole.farmer;
};

export const canUpdateActivityStatus = (status: ActivityStatus) => {
  return status === "NEW" || status === "IN_PROGRESS" || status === "PENDING";
};

export const canUpdateEquipmentDetail = (status: EquipmentStatus) => {
  return status !== "WORKING";
};
export const canUpdateCropStatus = (status: CropStatus) => {
  return status !== "FINISH";
};

export const canCreateHarvestAndSaleCropStatus = (status: CropStatus) => {
  return status === "HARVEST";
};
