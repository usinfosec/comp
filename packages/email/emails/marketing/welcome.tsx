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
import { Footer } from "../../components/footer";
import { Logo } from "../../components/logo";

interface Props {
    name: string;
}

export const WelcomeEmail = ({
    name,
}: Props) => {
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

                        <Footer />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};