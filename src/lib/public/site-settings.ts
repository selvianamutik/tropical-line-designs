import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicSiteSettings = {
  studioName: string;
  contactEmail: string;
  phoneNumber: string;
  officeAddress: string;
  instagramUrl: string | null;
  linkedinUrl: string | null;
};

type SiteSettingsRow = {
  studio_name: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  instagram_handle: string | null;
  linkedin_url: string | null;
};

const fallbackSiteSettings: PublicSiteSettings = {
  studioName: "Tropical Line Design",
  contactEmail: "bali.tropicalline@gmail.com",
  phoneNumber: "+62 361 245990",
  officeAddress: "Jl. Badak Agung VI No.8,\nSumerta Kelod, Kec. Denpasar Tim.\nKota Denpasar, Bali 80234",
  instagramUrl: "https://www.instagram.com/tropicallinedesign/",
  linkedinUrl: null,
};

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("studio_name,contact_email,phone_number,office_address,instagram_handle,linkedin_url")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
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
  };
});
