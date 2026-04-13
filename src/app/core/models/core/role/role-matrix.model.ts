import { Role } from './role.model';
import { ModuleWithMenus } from './module-with-menus.model';

export interface RoleMatrixData {
  roles: Role[];
  modules: ModuleWithMenus[];
}
