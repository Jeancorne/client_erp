import { CompanyFiscalResponsibility } from '../core/fiscal-responsibility/fiscal-responsibility.model';

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
  fiscalResponsibilities?: CompanyFiscalResponsibility[];
  fiscalResponsibilityIds?: string[];
}
