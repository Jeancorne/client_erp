export interface MenuModule {
  id: string;
  moduleCode: string;
  name: string;
  icon?: string | null;
  sequence: number;
  isActive: boolean;
  items: MenuItem[];
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  coreMenuId: string;
  coreMenuItemIdParent: string | null;
  moduleCode?: string;
  name: string;
  routePath?: string | null;
  sequence: number;
  isActive: boolean;
  subItems?: MenuItem[];
  actions?: MenuItemAction[];
}

export interface MenuItemAction {
  id: string;
  actionId: string;
  name: string;
  code: string;
}

export interface Action {
  id: string;
  name: string;
  code: string;
  createdAt?: string;
}
