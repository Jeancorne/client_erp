import { Permission } from './permission.model';

export interface ActionPermission {
  menuItemActionId: string;
  actionId: string;
  name: string;
  code: string;
  permissions: { [roleId: string]: Permission };
}
