"use client";

import Link from "next/link";

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <span className="font-bold lg:inline-block">Comp AI</span>
      </Link>
    </div>
  );
}
