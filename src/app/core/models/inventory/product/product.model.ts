export interface Product {
  id: string;
  coreCompanyId: string;
  coreCompanyName?: string;
  name: string;
  defaultCode: string;
  barcode: string;
  productType: 'STOR' | 'CONS' | 'SERV';
  invCategoryId: string;
  invUomId: string;
  invUomIdPurchase: string | null;
  invUomIdSale: string | null;
  salePrice: number;
  standardPrice: number;
  purchaseCostAvg: number;
  costMethod: 'AVG' | 'FIFO' | 'STD';
  weight: number;
  volume: number;
  imageUrl: string | null;
  isActive: boolean;
}
