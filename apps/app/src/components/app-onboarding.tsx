"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@bubba/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@bubba/ui/accordion";
import Image from "next/image";
import { Button } from "@bubba/ui/button";
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
  cta: string;
  imageSrc: string;
  imageAlt: string;
  faqs?: FAQ[];
  sheetName: string;
};

export function AppOnboarding({ title, description, cta, imageSrc, imageAlt, faqs, sheetName }: Props) {
  const t = useI18n();
  const [open, setOpen] = useQueryState(sheetName);
  const isOpen = Boolean(open);

  return (
    <Card className="w-full bg-accent/10">
      <div className="flex flex-col min-h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 flex-1">
          <div className="flex flex-col max-h-[500px]">
            <CardHeader className="px-0 flex-none">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex-1 overflow-hidden flex flex-col h-full min-h-full">
              <p className="font-medium text-md flex-none mb-4">{t("app_onboarding.risk_management.learn_more")}</p>
              {faqs && faqs.length > 0 && (
                <div className="flex-1 pr-4 -mr-4">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.questionKey} value={faq.questionKey}>
                        <AccordionTrigger>{faq.questionKey}</AccordionTrigger>
                        <AccordionContent>{faq.answerKey}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </CardContent>
          </div>
          <div className="hidden md:block items-center justify-center sticky top-6 h-fit">
            <div className="relative aspect-square w-3/4 mx-auto">
              <div className="absolute inset-0 bg-background/10 rounded-full blur-3xl" />
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain relative z-10"
                priority
                quality={100}
              />
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-end flex-none">
          <Button variant="action" className="flex items-center" onClick={() => setOpen("true")}
          >
            <PlusIcon className="w-4 h-4" />
            {cta}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
