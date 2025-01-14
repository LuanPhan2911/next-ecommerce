import { getActivityByIdWithCountUsage } from "@/services/activities";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";
import { ActivityDangerCard } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/danger/_components/activity-danger-card";
import { getCurrentStaffRole } from "@/services/staffs";

interface ActivityDangerPageProps {
  params: {
    cropId: string;
    activityId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail.danger");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const data = await getActivityByIdWithCountUsage(params.activityId);
  if (!data) {
    notFound();
  }

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canEdit =
    isOnlyAdmin &&
    canUpdateCropStatus(data.crop.status) &&
    canUpdateActivityStatus(data.status);

  const canDelete =
    data._count.equipmentUseds === 0 &&
    data._count.materialUseds === 0 &&
    canEdit;
  return (
    <ActivityDangerCard
      id={data.id}
      canDelete={canDelete}
      canEdit={canEdit}
      redirectUrl={`/crops/detail/${params.cropId}/activities`}
    />
  );
};
export default ActivityDangerPage;
