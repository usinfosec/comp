"use client";

import { createOrganizationAction } from "@/actions/organization/create-organization-action";
import { organizationSchema } from "@/actions/schema";
import { Button } from "@bubba/ui/button";
import { Checkbox } from "@bubba/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface BaseFieldConfig {
  name: string;
  label: string;
  placeholder: string;
}

interface TextFieldConfig extends BaseFieldConfig {
  type?: "text";
}

interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  options?: string[];
}

interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: string[];
}

type FieldConfig = TextFieldConfig | CheckboxFieldConfig | SelectFieldConfig;

const steps: Array<{
  title: string;
  description: string;
  fields: FieldConfig[];
}> = [
  {
    title: "Create an organization",
    description: "Tell us a bit about your organization.",
    fields: [
      {
        name: "name",
        label: "Organization Name",
        placeholder: "Your organization name",
      },
      {
        name: "website",
        label: "Website",
        placeholder: "Your organization website",
      },
    ],
  },
];

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      const currentFields = steps[currentStep].fields.map(
        (field) => field.name,
      ) as Array<keyof z.infer<typeof organizationSchema>>;

      const result = await form.trigger(currentFields);

      if (result) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const createOrganization = useAction(createOrganizationAction, {
    onSuccess: () => {
      toast.success("Thanks, you're all set!");
    },
    onError: () => {
      toast.error("Something went wrong, please try again.");
    },
  });

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      website: "",
    },
  });

  const onSubmit = (data: z.infer<typeof organizationSchema>) => {
    createOrganization.execute(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden p-6 md:p-0">
      <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col">
        <h1 className="pb-2 text-2xl font-medium">Comp AI Setup</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {steps[currentStep].description}
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {steps[currentStep].fields.map((fieldConfig) => (
              <FormField
                control={form.control}
                name={
                  fieldConfig.name as keyof z.infer<typeof organizationSchema>
                }
                key={fieldConfig.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      {(fieldConfig as CheckboxFieldConfig).type ===
                      "checkbox" ? (
                        <div className="flex flex-col space-y-2">
                          {(fieldConfig as CheckboxFieldConfig).options ? (
                            (fieldConfig as CheckboxFieldConfig).options?.map(
                              (option) => (
                                <div
                                  key={option}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = Array.isArray(
                                        field.value,
                                      )
                                        ? field.value
                                        : [];
                                      const newValue = checked
                                        ? [...currentValue, option]
                                        : currentValue.filter(
                                            (v: string) => v !== option,
                                          );
                                      field.onChange(newValue);
                                    }}
                                  />
                                  <span className="text-sm">{option}</span>
                                </div>
                              ),
                            )
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value === "true"}
                                onCheckedChange={field.onChange}
                              />
                              <span className="text-sm">
                                {fieldConfig.label}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (fieldConfig as SelectFieldConfig).type ===
                        "select" ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={fieldConfig.placeholder}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(fieldConfig as SelectFieldConfig).options.map(
                              (option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          autoFocus
                          className="mt-3"
                          autoCorrect="off"
                          placeholder={fieldConfig.placeholder}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex justify-between gap-4">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-8"
                  onClick={handlePrevious}
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              <Button
                type="button"
                className="w-full mt-8"
                disabled={
                  form.formState.isValidating ||
                  createOrganization.status === "executing"
                }
                onClick={
                  currentStep === steps.length - 1
                    ? () => createOrganization.execute(form.getValues())
                    : handleNext
                }
              >
                <div className="flex items-center justify-center">
                  {createOrganization.status === "executing" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : currentStep === steps.length - 1 ? (
                    "Complete"
                  ) : (
                    "Next"
                  )}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
