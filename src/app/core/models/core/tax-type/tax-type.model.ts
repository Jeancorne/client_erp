export interface TaxType {
  id: string;
  name: string;
  code: string;
  isRetention: boolean;
  isActive: boolean;
  createdAt?: string;
}
