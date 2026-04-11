export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface FiscalResponsibility {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

// Representa el objeto relacional que viene del backend
export interface CompanyFiscalResponsibility {
  id: string;
  coreFiscalResponsibilityId: string;
  code: string;
  name: string;
}

export interface Company {
  id?: string;
  coreCompanyIdParent: string | null;
  coreCurrencyId: string | null;
  name: string;
  nitTaxId: string | null;
  isBillingContact: boolean;
  personType: string | null;
  dianCiiuCode: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  isMaster: boolean;
  isActive: boolean;
  fiscalResponsibilities?: CompanyFiscalResponsibility[]; // Nueva estructura del GET
  fiscalResponsibilityIds?: string[]; // Estructura para el POST/PUT
}
