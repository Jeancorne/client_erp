import { ActionPermission } from './action-permission.model';

export interface MenuWithActions {
  id: string;
  name: string;
  routePath: string;
  sequence: number;
  actions: ActionPermission[];
}
