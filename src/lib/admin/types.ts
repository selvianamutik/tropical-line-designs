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
  display_order: number;
  description: string | null;
  gallery_layout: GalleryLayout;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  image_public_url?: string | null;
  created_at: string;
}

export interface PortfolioGalleryItemRecord {
  id: string;
  portfolio_id: string;
  media_asset_id: string;
  sort_order: number;
  caption: string | null;
  created_at: string;
  media_asset_url: string;
  media_asset_path: string;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  email: string;
  status: MemberStatus;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  image_public_url?: string | null;
  created_at: string;
}

export interface CollaboratorRecord {
  id: string;
  company: string;
  expertise_type: string;
  contact_email: string;
  joint_projects: number;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  image_public_url?: string | null;
  created_at: string;
}

export interface AwardRecord {
  id: string;
  title: string;
  organization: string;
  award_year: number;
  related_project: string | null;
  description: string | null;
  image_bucket: string;
  image_path: string | null;
  image_mime_type: string | null;
  image_size_bytes: number | null;
  image_public_url?: string | null;
  created_at: string;
}

export interface ServiceRecord {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
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
  footer_heading: string | null;
  footer_description: string | null;
  updated_at: string;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalAwards: number;
  totalTeamMembers: number;
  totalCollaborators: number;
  recentProjects: PortfolioRecord[];
}
