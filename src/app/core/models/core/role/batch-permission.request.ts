import { PermissionItem } from './permission-item.model';

export interface BatchPermissionRequest {
  companyId: string;
  toCreate: PermissionItem[];
  toDelete: string[];
}
