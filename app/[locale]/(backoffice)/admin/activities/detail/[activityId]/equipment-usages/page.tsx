import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getEquipmentUsagesByActivityId } from "@/services/equipment-usages";
import { ActivityEquipmentUsageCreateButton } from "./_components/activity-equipment-usage-create-button";
import { ActivityEquipmentUsagesTable } from "./_components/activity-equipment-usages-table";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { getActivityById } from "@/services/activities";
import { canUpdateActivityStatus } from "@/lib/permission";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  return {
    title: t("title"),
  };
}

interface EquipmentUsagesPageProps {
  params: {
    activityId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
  };
}
const ActivityEquipmentUsagesPage = async ({
  params,
  searchParams,
}: EquipmentUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  const { query, orderBy } = searchParams;
  const currentStaff = await getCurrentStaff();
  const data = await getEquipmentUsagesByActivityId({
    activityId: params.activityId,
    orderBy,
    query,
  });
  if (!currentStaff) {
    notFound();
  }
  const activity = await getActivityById({
    activityId: params.activityId,
    staffId: currentStaff.id,
  });
  if (!activity) {
    notFound();
  }
  const canUpdate = canUpdateActivityStatus(activity.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <ActivityEquipmentUsageCreateButton
            currentOperator={currentStaff}
            disabled={!canUpdate}
          />
        </div>
        <ActivityEquipmentUsagesTable data={data} />
      </CardContent>
    </Card>
  );
};
export default ActivityEquipmentUsagesPage;