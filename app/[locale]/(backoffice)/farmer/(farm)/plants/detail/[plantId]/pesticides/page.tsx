import { PlantPesticidesDataTable } from "@/app/[locale]/(backoffice)/admin/(farm)/plants/detail/[plantId]/pesticides/_components/plant-pesticides-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlantPesticides } from "@/services/plant-pesticides";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("plantPesticides.page");
  return {
    title: t("title"),
  };
}
interface PlantPesticidesPageProps {
  params: {
    plantId: string;
  };
}
const PlantPesticidesPage = async ({ params }: PlantPesticidesPageProps) => {
  const t = await getTranslations("plantPesticides.page");
  const plantPesticides = await getPlantPesticides({
    plantId: params.plantId,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantPesticidesDataTable data={plantPesticides} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantPesticidesPage;
