import { task, retry, wait, logger } from "@trigger.dev/sdk/v3";
import {
    Body,
    Button,
    Container,
    Font,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import { Footer } from "@comp/email/components/footer";
import { Logo } from "@comp/email/components/logo";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const newOrgSequence = task({
    id: "new-org-sequence",
    run: async (payload: {
        email: string;
        name: string;
    }) => {
        logger.info(`Start new sequence for user ${payload.email}`);

        await wait.for({ seconds: 5 });

        const firstEmailResult = await retry.onThrow(
            async ({ attempt }) => {
                const { data, error } = await resend.emails.send({
                    from: "Lewis Carhart <lewis@mail.trycomp.ai>",
                    to: payload.email,
                    subject: "Welcome to Comp AI",
                    react: WelcomeEmail({ name: payload.name }),
                });

                if (error) {
                    throw new Error(error.message);
                }

                return data;
            },
            { maxAttempts: 3 },
        );

        await wait.for({ days: 3 });

        return {
            success: true,
        };
    },
});

const WelcomeEmail = ({
    name,
}: {
    name: string;
}) => {
    return (
        <Html>
            <Tailwind>
                <head>
                    <Font
                        fontFamily="Geist"
                        fallbackFontFamily="Helvetica"
                        webFont={{
                            url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
                            format: "woff2",
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />

                    <Font
                        fontFamily="Geist"
                        fallbackFontFamily="Helvetica"
                        webFont={{
                            url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
                            format: "woff2",
                        }}
                        fontWeight={500}
                        fontStyle="normal"
                    />
                </head>

                <Preview>Get started with Comp AI</Preview>

                <Body className="bg-[#fff] my-auto mx-auto font-sans">
                    <Container
                        className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
                        style={{ borderStyle: "solid", borderWidth: 1 }}
                    >
                        <Logo />
                        <Heading className="mx-0 my-[30px] p-0 text-[24px] font-normal text-[#121212] text-center">
                            Welcome to Comp AI!
                        </Heading>

                        <Section>
                            <Text className="text-[14px] leading-[24px] text-[#121212]">
                                Hey {name},
                                <br />
                                <br />
                                We're excited to have you on board with Comp AI. I just wanted to reach out and say welcome!
                                <br />
                                <br />
                                If I can help with anything, you can reach me by replying to this email, or book a call with me here: <a href="https://cal.com/team/compai/meet-us">https://cal.com/team/compai/meet-us</a>
                                <br />
                                <br />
                                p.s. if you're interested, we're currently offering a fast-track path for SOC 2 Type I and II - if you're interested, let me know and I'll send you an invite to Slack :)
                            </Text>
                        </Section>

                        <Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};