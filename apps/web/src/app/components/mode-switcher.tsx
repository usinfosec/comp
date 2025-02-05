"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@bubba/ui/button";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Mount handler
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="group/toggle h-4 w-4 px-0"
        aria-label="Loading theme switcher"
      >
        <span className="sr-only">Loading theme switcher</span>
      </Button>
    );
  }

  const themeText = resolvedTheme === "dark"
    ? "Switch to light theme"
    : "Switch to dark theme";

  return (
    <Button
      variant="ghost"
      className="group/toggle h-4 w-4 px-0 focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toggleTheme}
      aria-label={themeText}
    >
      <SunIcon className="hidden [html.dark_&]:block" aria-hidden="true" />
      <MoonIcon className="hidden [html.light_&]:block" aria-hidden="true" />
    </Button>
  );
}
