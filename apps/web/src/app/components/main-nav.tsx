"use client";

import Link from "next/link";
import LogoHeader from "./logo-header";

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="flex items-center gap-2">
        <LogoHeader className="w-24 h-24" />
      </Link>
    </div>
  );
}
