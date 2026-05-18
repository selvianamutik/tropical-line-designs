import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicSiteSettings = {
  studioName: string;
  contactEmail: string;
  phoneNumber: string;
  officeAddress: string;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  footerHeading: string;
  footerDescription: string;
};

type SiteSettingsRow = {
  studio_name: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  instagram_handle: string | null;
  linkedin_url: string | null;
  footer_heading?: string | null;
  footer_description?: string | null;
};

const fallbackSiteSettings: PublicSiteSettings = {
  studioName: "Tropical Line Design",
  contactEmail: "bali.tropicalline@gmail.com",
  phoneNumber: "+62 361 245990",
  officeAddress: "Jl. Badak Agung VI No.8,\nSumerta Kelod, Kec. Denpasar Tim.\nKota Denpasar, Bali 80234",
  instagramUrl: "https://www.instagram.com/tropicallinedesign/",
  linkedinUrl: null,
  footerHeading: "Holistic tropical landscape design shaped for Bali and beyond.",
  footerDescription:
    "As a landscape design company based in Bali, a tropical paradise in Indonesia, Tropical Line Design focuses on creating landscape designs with a natural and tropical ambiance combined with elegance to fulfill clients' expectations.",
};

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const selectVariants = [
    "studio_name,contact_email,phone_number,office_address,instagram_handle,linkedin_url,footer_heading,footer_description",
    "studio_name,contact_email,phone_number,office_address,instagram_handle,linkedin_url",
  ] as const;

  let data: SiteSettingsRow | null = null;
  let lastError: unknown = null;

  for (const selectClause of selectVariants) {
    const query = await supabaseAdmin
      .from("site_settings")
      .select(selectClause)
      .limit(1)
      .maybeSingle();

    if (!query.error) {
      data = query.data as SiteSettingsRow | null;
      lastError = null;
      break;
    }

    if (query.error.code !== "42703" && query.error.code !== "PGRST204") {
      throw query.error;
    }

    lastError = query.error;
  }

  if (!data) {
    if (lastError) {
      throw lastError;
    }
    return fallbackSiteSettings;
  }

  const row = data as SiteSettingsRow;

  return {
    studioName: row.studio_name,
    contactEmail: row.contact_email,
    phoneNumber: row.phone_number,
    officeAddress: row.office_address,
    instagramUrl: row.instagram_handle ?? fallbackSiteSettings.instagramUrl,
    linkedinUrl: row.linkedin_url ?? fallbackSiteSettings.linkedinUrl,
    footerHeading: row.footer_heading ?? fallbackSiteSettings.footerHeading,
    footerDescription: row.footer_description ?? fallbackSiteSettings.footerDescription,
  };
});
