import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";

export function Footer() {
  return (
    <Section className="w-full">
      <Hr />

      <Text className="text-[21px] font-regular">
        <Link href="https://trycomp.ai?utm_source=email&utm_medium=footer">
          Compliance made easy.
        </Link>
      </Text>

      <Row>
        <Text className="text-[#B8B8B8] text-xs">
          Bubba AI, Inc. - 2261 Market Street, San Francisco, CA 94114
        </Text>
      </Row>
    </Section>
  );
}
