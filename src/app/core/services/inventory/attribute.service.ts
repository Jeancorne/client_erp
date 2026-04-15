import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { AttributeLookup, AttributeValueLookup } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiInventory;

  getAttributesLookup(companyId: string): Observable<ApiResponse<AttributeLookup[]>> {
    return this.http.get<ApiResponse<AttributeLookup[]>>(`${this.apiUrl}/attributes/lookup`, {
      params: { companyId }
    });
  }

  getAttributeValues(attributeId: string): Observable<ApiResponse<AttributeValueLookup[]>> {
    return this.http.get<ApiResponse<AttributeValueLookup[]>>(`${this.apiUrl}/attribute-values/attribute/${attributeId}`);
  }
}
