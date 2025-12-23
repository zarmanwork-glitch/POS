export interface SidebarItem {
  label: string;
  href?: string;
  icon?: string;
  children?: SidebarItem[];
  active?: boolean;
}
