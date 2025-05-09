import { task, retry, logger, wait } from "@trigger.dev/sdk/v3";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const newOrgSequence = task({
    id: "new-org-sequence",
    run: async (payload: {
        email: string;
    }) => {
        logger.info(`Start new sequence for user ${payload.email}`);

        await wait.for({
            minutes: 15,
        });

        const firstEmailResult = await retry.onThrow(
            async ({ attempt }) => {
                logger.info(`Sending first email to ${payload.email} - attempt ${attempt}`);

                const { data, error } = await resend.emails.send({
                    from: "Lewis Carhart <lewis@mail.trycomp.ai>",
                    replyTo: "Lewis Carhart <lewis@trycomp.ai>",
                    to: payload.email,
                    subject: "Comp AI",
                    text: `Hey,

                    Thanks for signing up to Comp AI! I just wanted to reach out to let you know you can reach out to me anytime by replying to this email, or by booking a call with me here: https://cal.com/team/compai/meet-us

                    p.s. if you want us to do SOC 2 for you, reply to this email and I can send you some details :)

                    Best,
                    Lewis
                    Founder, Comp AI`
                });

                if (error) {
                    console.log(error);
                }

                return data;
            },
            { maxAttempts: 3 },
        );

        return {
            success: true,
        };
    },
});