import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@bubba/ui/card";
import { Input } from "@bubba/ui/input";
import { getI18n } from "@/locales/server";
import { AlertDialog, AlertDialogTrigger } from "@bubba/ui/alert-dialog";

export async function SettingsFallback() {
  const t = await getI18n();

  return (
    <div className="space-y-12">
      <Card>
        <CardHeader className="blur-sm">
          <CardTitle>{t("settings.general.org_name")}</CardTitle>
          <CardDescription>
            {t("settings.general.org_name_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="blur-sm">
          <Input type="text" placeholder="Loading..." />
        </CardContent>
        <CardFooter className="flex justify-between blur-sm">
          <div>{t("settings.general.org_name_tip")}</div>
          <Button>{t("common.actions.save")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="blur-sm">
          <CardTitle>{t("settings.general.org_website")}</CardTitle>
          <CardDescription>
            {t("settings.general.org_website_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="blur-sm">
          <Input type="url" placeholder="Loading..." />
        </CardContent>
        <CardFooter className="flex justify-between blur-sm">
          <div>{t("settings.general.org_website_tip")}</div>
          <Button>{t("common.actions.save")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="blur-sm">
          <CardTitle>{t("settings.general.org_delete")}</CardTitle>
          <CardDescription>
            {t("settings.general.org_delete_description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="blur-sm">
          <Input type="text" placeholder="Type organization name to confirm..." />
        </CardContent>
        <CardFooter className="flex justify-between blur-sm">
          <div />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t("common.actions.delete")}</Button>
            </AlertDialogTrigger>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}