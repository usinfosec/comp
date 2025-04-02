"use client";

import { Button } from "@bubba/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bubba/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/locales/client";
import { authClient } from "@bubba/auth";
import { toast } from "sonner";

const inviteMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["owner", "admin", "member", "auditor"]),
});

type FormValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberForm() {
  const t = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const response = await authClient.organization.inviteMember({
      email: data.email,
      role: data.role as "owner" | "admin" | "member"
    });

    if (response.error) {
      toast.error(response.error.message);
    } else {
      toast.success(t("settings.team.invitations.invitation_sent"));
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.team.invite.title")}</CardTitle>
            <CardDescription>
              {t("settings.team.invite.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("settings.team.invite.form.email.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t(
                        "settings.team.invite.form.email.placeholder",
                      )}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("settings.team.invite.form.role.label")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "settings.team.invite.form.role.placeholder",
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="owner">
                        {t("settings.team.members.role.owner")}
                      </SelectItem>
                      <SelectItem value="admin">
                        {t("settings.team.members.role.admin")}
                      </SelectItem>
                      <SelectItem value="member">
                        {t("settings.team.members.role.member")}
                      </SelectItem>
                      <SelectItem value="auditor">
                        {t("settings.team.members.role.auditor")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              variant="action"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("settings.team.invite.button.sending")}
                </>
              ) : (
                t("settings.team.invite.button.send")
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
