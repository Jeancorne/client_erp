export interface ReorderRule {
  id: string;
  coreCompanyId: string;
  invProductId: string;
  invLocationId: string;
  minQuantity: number;
  maxQuantity: number;
  multipleQuantity: number;
}
