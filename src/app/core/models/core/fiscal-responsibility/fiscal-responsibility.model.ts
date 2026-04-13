export interface FiscalResponsibility {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface CompanyFiscalResponsibility {
  id: string;
  coreFiscalResponsibilityId: string;
  code: string;
  name: string;
}
