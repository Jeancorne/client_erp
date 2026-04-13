export interface PartnerAddress {
  id?: string;
  corePartnerId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  coreCityId: string | null;
  cityName?: string; 
  coreStateId?: string | null;
  coreCountryId?: string | null;
  zipCode?: string;
  addressType: string;
  isActive: boolean;
}
