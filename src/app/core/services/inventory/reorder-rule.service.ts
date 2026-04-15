import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { ReorderRule } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class ReorderRuleService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiInventory}/reorder-rules`;

  getReorderRules(productId: string): Observable<ApiResponse<ReorderRule[]>> {
    return this.http.get<ApiResponse<ReorderRule[]>>(`${this.apiUrl}/product/${productId}`);
  }

  createReorderRule(rule: Partial<ReorderRule>): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(this.apiUrl, rule);
  }

  updateReorderRule(id: string, rule: Partial<ReorderRule>): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, rule);
  }

  deleteReorderRule(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
