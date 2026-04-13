import { MenuWithActions } from './menu-with-actions.model';

export interface ModuleWithMenus {
  id: string;
  name: string;
  icon: string;
  sequence: number;
  menus: MenuWithActions[];
}
