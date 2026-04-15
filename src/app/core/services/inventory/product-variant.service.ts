import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { ProductVariant } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class ProductVariantService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiInventory}/product`;

  getProductVariants(productId: string): Observable<ApiResponse<ProductVariant[]>> {
    return this.http.get<ApiResponse<ProductVariant[]>>(`${this.apiUrl}/${productId}/variants`);
  }

  createProductVariant(variant: Partial<ProductVariant>): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/variants`, variant);
  }

  updateProductVariant(id: string, variant: Partial<ProductVariant>): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/variants/${id}`, variant);
  }

  deleteProductVariant(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/variants/${id}`);
  }
}
