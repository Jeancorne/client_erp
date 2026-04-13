export interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  companyIds: string[];
  defaultCompanyId: string | null;
  isMainAdmin: boolean;
}
