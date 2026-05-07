import type {
  AwardRecord,
  CollaboratorRecord,
  DashboardMetrics,
  PortfolioRecord,
  SiteSettingsRecord,
  TeamMemberRecord,
} from "@/lib/admin/types";
import { supabaseAdmin } from "@/lib/db";

export async function listPortfolios() {
  const { data, error } = await supabaseAdmin
    .from("portfolios")
    .select("*")
    .order("commenced_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as PortfolioRecord[];
}

export async function listTeamMembers() {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as TeamMemberRecord[];
}

export async function listCollaborators() {
  const { data, error } = await supabaseAdmin
    .from("collaborators")
    .select("*")
    .order("joint_projects", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CollaboratorRecord[];
}

export async function listAwards() {
  const { data, error } = await supabaseAdmin
    .from("awards")
    .select("*")
    .order("award_year", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AwardRecord[];
}

export async function getSiteSettings() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as SiteSettingsRecord | null;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [projects, awards, teamMembers, collaborators] = await Promise.all([
    listPortfolios(),
    listAwards(),
    listTeamMembers(),
    listCollaborators(),
  ]);

  return {
    totalProjects: projects.length,
    totalAwards: awards.length,
    totalTeamMembers: teamMembers.length,
    totalCollaborators: collaborators.length,
    recentProjects: projects.slice(0, 3),
  };
}
