import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ActivityEditForm } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-button";
import { canUpdateActivity } from "@/lib/role";
import { canUpdateActivityStatus } from "@/lib/permission";

export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail");
  return {
    title: t("title"),
  };
}

interface CropActivityDetailPageProps {
  params: {
    activityId: string;
    cropId: string;
  };
}
const CropActivityDetailPage = async ({
  params,
}: CropActivityDetailPageProps) => {
  const data = await getActivityById(params.activityId);
  const t = await getTranslations("crops.page.detail.activities.detail");

  if (!data) {
    notFound();
  }

  const canEdit =
    (await canUpdateActivity(params.cropId)) &&
    canUpdateActivityStatus(data.status);

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityEditForm data={data} disabled={!canEdit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivityDetailPage;