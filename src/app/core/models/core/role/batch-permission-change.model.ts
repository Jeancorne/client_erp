export interface BatchPermissionChange {
  roleId: string;
  menuItemActionId: string;
  allowed: boolean;
  rolePermissionId?: string | null;
}
