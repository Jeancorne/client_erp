export interface Tax {
  id: string;
  coreCompanyId: string;
  coreCompanyName?: string;
  name: string;
  coreTaxTypeId: string;
  coreTaxTypeName?: string;
  calculationType: 'PERC' | 'FIXED';
  ratePercent: number;
  fixedAmount: number;
  minBaseAmount: number;
  minBaseUvt: number;
  accAccountIdSales?: string | null;
  accAccountIdPurch?: string | null;
  coreCountryId?: string | null;
  coreStateId?: string | null;
  coreCityId?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface TaxResponse {
  succeeded: boolean;
  message: string | null;
  errors: string[] | null;
  data: Tax[];
  traceId: string;
}
