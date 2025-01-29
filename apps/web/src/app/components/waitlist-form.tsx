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
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function WaitlistForm() {
  const [isSent, setSent] = useState(false);

  const waitlistAction = useAction(joinWaitlist, {
    onSuccess: () => {
      setSent(true);
      toast.success("Thanks, you're on the list!");
      form.reset();
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
        <p className="text-lg font-medium text-center">
          Thanks, you're on the list!
        </p>
        <Link
          href="https://discord.gg/3JgpACjae6"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
        >
          Join Community
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col sm:flex-row gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  type="email"
                  placeholder="Enter your work email"
                  className="h-12 px-4 text-base bg-background border-border/50 focus:border-primary"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="h-12 px-6 text-base font-medium"
          disabled={waitlistAction.isExecuting || !form.formState.isValid}
        >
          {waitlistAction.isExecuting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
