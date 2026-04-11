export interface UserCompany {
  id: string;
  companyId: string;
  companyName: string;
  isDefault: boolean;
}

export interface UserRole {
  roleId: string;
  roleName: string;
  isAssigned: boolean;
  userRoleId?: string;
}

export interface UserBranch {
  id: string;
  branchId: string;
  branchName: string;
  companyName: string;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  coreIdentificationTypeId: string | null;
  identificationNumber: string | null;
  phone: string | null;
  isMainAdmin: boolean;
  isActive: boolean;
  createdAt?: string;
  companies?: UserCompany[];
  roles?: any[]; // Para la respuesta del GET por ID
  branches?: UserBranch[];
}

export interface UserRoleMatrix {
  companyId: string;
  companyName: string;
  isDefault: boolean;
  roles: UserRole[];
}
