"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@bubba/ui/drawer";
import { useMediaQuery } from "@bubba/ui/hooks";
import { ScrollArea } from "@bubba/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@bubba/ui/sheet";
import { X } from "lucide-react";
import { InherentRiskForm } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/forms/risks/inherent-risk-form";
import type { VendorInherentRisk } from "@prisma/client";
import { useState } from "react";

export function InherentRiskSheet({
  vendorId,
  initialRisk,
  onSuccess,
}: {
  vendorId: string;
  initialRisk?: VendorInherentRisk;
  onSuccess?: () => void;
}) {
  const t = useI18n();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => setIsOpen(false);
  
  const handleFormSuccess = () => {
    setIsOpen(false);
    if (onSuccess) onSuccess();
  };

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent stack>
          <SheetHeader className="mb-8">
            <div className="flex justify-between items-center flex-row">
              <SheetTitle>{t("vendors.risks.update_inherent_risk")}</SheetTitle>
              <Button
                size="icon"
                variant="ghost"
                className="p-0 m-0 size-auto hover:bg-transparent"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>
              {t("vendors.risks.update_inherent_risk_description")}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
            <InherentRiskForm
              vendorId={vendorId}
              initialRisk={initialRisk}
              onSuccess={handleFormSuccess}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTitle hidden>{t("vendors.risks.update_inherent_risk")}</DrawerTitle>
      <DrawerContent className="p-6">
        <InherentRiskForm
          vendorId={vendorId}
          initialRisk={initialRisk}
          onSuccess={handleFormSuccess}
        />
      </DrawerContent>
    </Drawer>
  );
}
