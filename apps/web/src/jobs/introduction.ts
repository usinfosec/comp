import WelcomeEmail from "@bubba/email/emails/welcome";
import { sendEmail } from "@bubba/email/lib/resend";
import { task, wait } from "@trigger.dev/sdk/v3";

export const introductionEmailTask = task({
  id: "introduction-email",
  maxDuration: 300,
  run: async (payload: { email: string }) => {
    const { email } = payload;
    const emailTemplate = WelcomeEmail();
    const delayMinutes = Math.floor(Math.random() * 21) + 5;

    await wait.for({ minutes: delayMinutes });

    await sendEmail({
      to: email,
      subject: "Saw you signed up for Comp AI",
      react: emailTemplate,
      marketing: true,
    });
  },
});
