"use client";

import Image from "next/image";
import { useState } from "react";

type TeamMemberPortraitProps = {
  src: string;
  alt: string;
};

function createFallbackPortrait(name: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
      <rect width="900" height="1200" fill="#e9dfd1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#383532" font-family="Arial, sans-serif" font-size="42">
        ${name}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function TeamMemberPortrait({ src, alt }: TeamMemberPortraitProps) {
  const fallbackSrc = createFallbackPortrait(alt);
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover rounded-sm grayscale transition-all duration-300 hover:grayscale-0"
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      unoptimized={imageSrc.startsWith("data:") || imageSrc.includes("/storage/v1/object/public/")}
      onError={() => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
      }}
    />
  );
}
