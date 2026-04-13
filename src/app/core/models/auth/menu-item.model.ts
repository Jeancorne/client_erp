export interface MenuItem {
  id: string;
  name: string;
  icon?: string | null;
  sequence: number;
  routePath?: string;
  actions?: string[];
  items?: MenuItem[];
}
