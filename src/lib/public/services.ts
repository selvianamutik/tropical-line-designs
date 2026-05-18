import { cache } from "react";
import { supabaseAdmin } from "@/lib/db";

export type PublicServiceRecord = {
  id: string;
  title: string;
  description: string | null;
};

type ServiceRow = PublicServiceRecord & {
  sort_order: number;
  is_active: boolean;
};

const fallbackServices: PublicServiceRecord[] = [
  {
    id: "landscape-design",
    title: "Landscape Design",
    description: "Comprehensive tropical landscape design for hospitality, residential, and commercial environments.",
  },
  {
    id: "landscape-construction",
    title: "Landscape Construction",
    description: "Build execution for gardens, resort grounds, villas, and contextual tropical outdoor spaces.",
  },
  {
    id: "site-consultation",
    title: "Site Consultation",
    description: "Strategic consultation for planting, site planning, and tropical landscape development.",
  },
];

export const listPublicServices = cache(async (): Promise<PublicServiceRecord[]> => {
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("id,title,description,sort_order,is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error?.code === "42P01" || error?.code === "PGRST205") {
    return fallbackServices;
  }

  if (error) {
    throw error;
  }

  return ((data ?? []) as ServiceRow[]).map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
  }));
});
