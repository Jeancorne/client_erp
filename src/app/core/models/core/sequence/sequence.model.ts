export type ResetType = 'DAILY' | 'MONTHLY' | 'YEARLY' | 'NONE';
export type SequenceStatus = | 'DRAFT' | 'ACTIVE' | 'DEPLETED' | 'EXPIRED' | 'CLOSED';

export interface Sequence {
  id: string;
  coreCompanyId: string;
  coreCompanyName?: string;
  documentCode: string;
  name: string;
  prefix: string;
  suffix?: string;
  padding: number;
  nextNumber: number;
  rangeFrom: number;
  rangeTo: number;
  validFrom?: string | null;
  validTo?: string | null;
  resetType: ResetType;
  resetMonth?: number | null;
  resetDay?: number | null;
  lastResetAt?: string | null;
  status: SequenceStatus;
  isActive: boolean;
  coreBranchId?: string | null;
  coreBranchName?: string | null;
  createdAt?: string;
}
