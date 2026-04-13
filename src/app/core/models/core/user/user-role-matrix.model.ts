import { UserRole } from './user-role.model';

export interface UserRoleMatrix {
  companyId: string;
  companyName: string;
  isDefault: boolean;
  roles: UserRole[];
}
