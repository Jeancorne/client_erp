export interface PartnerContact {
  id?: string;
  corePartnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  isBillingContact: boolean;
  isActive: boolean;
}
