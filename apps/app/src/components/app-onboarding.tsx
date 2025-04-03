"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@comp/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@comp/ui/accordion";
import Image from "next/image";
import { Button } from "@comp/ui/button";
import { PlusIcon } from "lucide-react";
import { useI18n } from "@/locales/client";
import { useQueryState } from "nuqs";

interface FAQ {
  questionKey: string;
  answerKey: string;
}

type Props = {
  title: string;
  description: string;
  cta?: string;
  imageSrc: string;
  imageAlt: string;
  faqs?: FAQ[];
  sheetName: string;
};

export function AppOnboarding({
  title,
  description,
  cta,
  imageSrc,
  imageAlt,
  faqs,
  sheetName,
}: Props) {
  const t = useI18n();
  const [open, setOpen] = useQueryState(sheetName);
  const isOpen = Boolean(open);

  return (
    <Card className="w-full bg-accent/10">
      <div className="flex flex-col lg:min-h-[600px]">
        <div className=" p-6 flex-1 lg:my-16">
          <div className="flex flex-col max-h-[500px]">
            <CardHeader className="px-0 flex-none">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex-1 overflow-hidden flex flex-col h-full min-h-full">
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <p className="font-medium text-md flex-none mb-4">
                      {t("app_onboarding.risk_management.learn_more")}
                    </p>
                    {faqs && faqs.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq) => (
                          <AccordionItem
                            key={faq.questionKey}
                            value={faq.questionKey}
                          >
                            <AccordionTrigger>
                              {faq.questionKey}
                            </AccordionTrigger>
                            <AccordionContent>{faq.answerKey}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                  <div className="mx-auto hidden lg:block">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      height={350}
                      width={350}
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
        {cta && (
          <CardFooter className="flex justify-end flex-none">
            {cta && (
              <Button
                variant="action"
                className="flex items-center"
                onClick={() => setOpen("true")}
              >
                <PlusIcon className="w-4 h-4" />
                {cta}
              </Button>
            )}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
