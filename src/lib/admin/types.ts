export type ProjectStatus =
  | "Planning"
  | "Design"
  | "Construction"
  | "Completed"
  | "On Hold";

export type MemberStatus = "Active" | "On Leave" | "Inactive";
export type GalleryLayout = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export interface PortfolioRecord {
  id: string;
  title: string;
  slug: string;
  location: string;
  status: ProjectStatus;
  commenced_at: string | null;
  client: string | null;
  category: string | null;
  architect: string | null;
  landscape_consultant: string | null;
  project_size: string | null;
  description: string | null;
  gallery_layout: GalleryLayout;
  image_url: string | null;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  created_at: string;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  email: string;
  status: MemberStatus;
  image_url: string | null;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  created_at: string;
}

export interface CollaboratorRecord {
  id: string;
  company: string;
  expertise_type: string;
  contact_email: string;
  joint_projects: number;
  image_url: string | null;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  created_at: string;
}

export interface AwardRecord {
  id: string;
  title: string;
  organization: string;
  award_year: number;
  related_project: string | null;
  image_url: string | null;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  created_at: string;
}

export interface SiteSettingsRecord {
  id: string;
  studio_name: string;
  contact_email: string;
  phone_number: string;
  office_address: string;
  instagram_handle: string | null;
  linkedin_url: string | null;
  updated_at: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalAwards: number;
  totalTeamMembers: number;
  totalCollaborators: number;
  recentProjects: PortfolioRecord[];
}
