"use client";

import Image from "next/image";

export function Logo({ 
  className,
  width = 64, 
  height = 64,
  alt = "Comp Logo",
  ...props
}: { 
  className?: string; 
  width?: number; 
  height?: number;
  alt?: string;
} & Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'width' | 'height'>) {
  return (
    <>
      <Image 
        src="/comp-logo-black.png"
        alt={alt}
        width={width} 
        height={height}
        className={`${className} dark:hidden`}
        {...props}
      />
      <Image 
        src="/comp-logo-white.png"
        alt={alt}
        width={width} 
        height={height}
        className={`${className} hidden dark:block`}
        {...props}
      />
    </>
  );
}
