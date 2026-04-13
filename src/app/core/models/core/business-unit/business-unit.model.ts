export interface BusinessUnit {
  id?: string;
  coreCompanyId: string;
  companyName?: string;
  name: string;
  coreUserIdManager: string | null;
  managerFullName?: string;
  isActive: boolean;
  createdAt?: string;
}
