export interface SidenavSection {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  subsections?: SidenavSection[];
  links?: SidenavLink[];
}
export interface SidenavLink {
  title: string;
  path: string;
  description?: string;
  subtitle?: string;
  icon?: string;
}