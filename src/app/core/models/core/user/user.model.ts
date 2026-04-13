import { UserCompany } from './user-company.model';
import { UserBranch } from './user-branch.model';

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
  roles?: any[]; 
  branches?: UserBranch[];
}
