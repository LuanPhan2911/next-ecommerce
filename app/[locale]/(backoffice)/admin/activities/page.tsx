import { getActivities } from "@/services/activities";
import { ActivitiesTable } from "./_components/activities-table";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCreateButton } from "./_components/activity-create-button";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import {
  ActivitiesPriorityPieChart,
  ActivitiesStatusPieChart,
} from "./_components/activities-chart";
interface ActivitiesPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    query?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("activities.page");
  return {
    title: t("title"),
  };
}

const ActivitiesPage = async ({ searchParams }: ActivitiesPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("activities.page");
  const { orderBy, filterNumber, filterString, query } = searchParams;
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const { data, totalPage } = await getActivities({
    filterNumber,
    filterString,
    orderBy,
    page,
    query,
    staffId: currentStaff.id,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCreateButton />
          </div>
          <ActivitiesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-4">
            <ActivitiesStatusPieChart />
            <ActivitiesPriorityPieChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesPage;