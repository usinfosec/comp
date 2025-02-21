"use client";

import { waitlistSchema } from "@/app/actions/schema";
import { joinWaitlist } from "@/app/actions/waitlist";
import { Button } from "@bubba/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function WaitlistForm() {
  const [isSent, setSent] = useState(false);
  const router = useRouter();

  const waitlistAction = useAction(joinWaitlist, {
    onSuccess: async () => {
      setSent(true);
      toast.success("Thanks, you're on the list!");
      await router.push("/success");
    },
    onError: () => {
      toast.error(
        "Your email is already on the waitlist, or something went wrong.",
      );
    },
  });

  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof waitlistSchema>) => {
    waitlistAction.execute({
      email: data.email,
    });
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center space-y-4 p-4 rounded-lg">
        <p className="text-md mt-2 text-center">
          You're on the list! We'll be in touch soon!
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your work email"
                  className="text-base"
                  autoComplete="email"
                  autoCorrect="off"
                  aria-label="Email address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="action"
          disabled={waitlistAction.isExecuting}
        >
          {waitlistAction.isExecuting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Joining...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Join our waitlist to help make 100,000 companies compliant by 2032.
      </p>
    </Form>
  );
}
