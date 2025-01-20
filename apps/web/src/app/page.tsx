import { WaitlistForm } from "@/app/components/waitlist-form";
import Link from "next/link";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderSubheading,
} from "./components/page-header";

export default function Home() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          Get SOC 2, ISO 27001 and GDPR compliant.
        </PageHeaderHeading>
        <PageHeaderDescription>
          We want to help 100,000 companies SOC 2, ISO 27001 and GDPR compliant
          by 2032. To achieve this, we're building the first ever open source
          compliance automation platform.
        </PageHeaderDescription>
      </PageHeader>
      <div className="border-grid border-b">
        <div className="container-wrapper">
          <div className="container flex py-4 flex-col gap-4 max-w-[600px]">
            <PageHeaderSubheading>
              Join the waitlist to get early access
            </PageHeaderSubheading>
            <WaitlistForm />
          </div>
        </div>
      </div>
    </>
  );
}
