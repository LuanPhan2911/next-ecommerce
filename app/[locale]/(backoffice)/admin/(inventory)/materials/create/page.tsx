import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MaterialCreateForm } from "../_components/material-create-button";
export async function generateMetadata() {
  const t = await getTranslations("materials.page.create");
  return {
    title: t("title"),
  };
}

const MaterialCreatePage = async () => {
  const t = await getTranslations("materials.form.create");

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialCreatePage;
