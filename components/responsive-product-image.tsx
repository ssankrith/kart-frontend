"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ImageDTO } from "@/lib/types";

/** Prefer larger assets when smaller variants are missing */
function resolveUrls(image: ImageDTO) {
  const desktop =
    image.desktop || image.tablet || image.mobile || image.thumbnail;
  const tablet =
    image.tablet || image.mobile || image.thumbnail || image.desktop;
  const mobile =
    image.mobile || image.thumbnail || image.tablet || image.desktop;
  return { desktop, tablet, mobile };
}

type Props = {
  image: ImageDTO;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/** Art-directed images: desktop (≥1024px), tablet (≥640px), else mobile. Native `<picture>`, no resize JS. */
export function ResponsiveProductImage({
  image,
  alt,
  sizes,
  className,
  imgClassName,
  priority,
}: Props) {
  const { desktop, tablet, mobile } = resolveUrls(image);
  const same =
    desktop === tablet && tablet === mobile;

  if (same) {
    return (
      <Image
        src={mobile}
        alt={alt}
        fill
        className={cn("object-cover", imgClassName)}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <picture className={cn("absolute inset-0 block h-full w-full", className)}>
      <source media="(min-width: 1024px)" srcSet={desktop} />
      <source media="(min-width: 640px)" srcSet={tablet} />
      <Image
        src={mobile}
        alt={alt}
        fill
        className={cn("object-cover", imgClassName)}
        sizes={sizes}
        priority={priority}
      />
    </picture>
  );
}
