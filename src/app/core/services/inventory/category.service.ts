import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { CategoryLookup } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiInventory}/categories`;

  getCategoriesLookup(companyId: string): Observable<ApiResponse<CategoryLookup[]>> {
    return this.http.get<ApiResponse<CategoryLookup[]>>(`${this.apiUrl}/lookup`, {
      params: { companyId }
    });
  }
}
