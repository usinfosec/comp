'use client';

import CalendarEmbed from '@/components/calendar-embed';
import { Button } from '@comp/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@comp/ui/dialog';
import { Phone } from 'lucide-react';

export function BookingDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Phone className="h-4 w-4" />
          Book a Call with Our Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Schedule a Call with Our Compliance Experts</DialogTitle>
          <DialogDescription>
            Have questions about our plans? Want to learn how we can help you achieve compliance in
            14 days? Book a 15-30 minute call with our team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6 h-[calc(100%-120px)]">
          <CalendarEmbed />
        </div>
      </DialogContent>
    </Dialog>
  );
}
