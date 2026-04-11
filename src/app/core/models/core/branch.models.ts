export interface Branch {
  id?: string;
  coreCompanyId: string;
  companyName?: string;
  name: string;
  address?: string | null;
  coreCityId: string | null;
  cityName?: string;
  phone?: string | null;
  defaultAccAnalyticAccountId?: string | null;
  isActive: boolean;
  createdAt?: string;
}
