export interface FiscalResponsibility {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface CompanyFiscalResponsibility {
  coreCompanyId: string;
  coreFiscalResponsibilityId: string;
  name?: string;
  code?: string;
}
