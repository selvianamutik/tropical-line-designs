export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.tropicallinedesign.com").replace(/\/$/, "");

export const ORGANIZATION_LOGO_PATH = "/logo/logo-1.png";
export const SOCIAL_IMAGE_PATH = "/logo/logo-2(black).png";

export const SOCIAL_IMAGE = {
  url: SOCIAL_IMAGE_PATH,
  width: 1508,
  height: 1007,
  alt: "Tropical Line Designs",
};

export const ABOUT_ROUTE_METADATA = [
  {
    path: "/about/services",
    title: "Services - Tropical Line Designs",
    description:
      "Landscape design and build services for tropical resorts, hotels, villas, commercial landscapes, and residential projects in Bali and Indonesia.",
  },
  {
    path: "/about/people",
    title: "People - Tropical Line Designs",
    description:
      "Meet the Tropical Line Designs team behind tropical landscape architecture, resort design, villa gardens, and construction projects in Indonesia.",
  },
  {
    path: "/about/collaborators",
    title: "Collaborators - Tropical Line Designs",
    description:
      "Explore the collaborators and partner brands connected to Tropical Line Designs landscape architecture and construction work.",
  },
  {
    path: "/about/awards",
    title: "Awards - Tropical Line Designs",
    description:
      "Awards and recognition for Tropical Line Designs landscape architecture, resort landscape design, and tropical construction projects.",
  },
] as const;

export function getAboutRouteMetadata(path: (typeof ABOUT_ROUTE_METADATA)[number]["path"]) {
  const metadata = ABOUT_ROUTE_METADATA.find((route) => route.path === path);

  if (!metadata) {
    throw new Error(`Missing SEO metadata for ${path}`);
  }

  return metadata;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
