import { PartnerFiscalResponsibility } from './partner-fiscal-responsibility.model';

export interface Partner {
  id?: string;
  coreCompanyId: string;
  parentPartnerId: string | null;
  partnerFullName: string;
  coreIdentificationTypeId: string | null;
  nitTaxId: string | null;
  personType: string | null;
  dianCiiuCode: string | null;
  partnerType: string;
  creditLimit: number;
  creditUsed?: number;
  creditUsedOrders?: number;
  paymentTermsDays?: number;
  isBlocked?: boolean;
  isActive: boolean;
  accAccountIdReceivable?: string | null;
  accAccountIdPayable?: string | null;
  defaultCurrencyId: string | null;
  createdAt?: Date;
  companyName?: string;
  
  // Para envío y recepción de responsabilidades fiscales (IDs)
  fiscalResponsibilities?: string[] | any;
  partnerFiscalResponsibilities?: PartnerFiscalResponsibility[];
}
