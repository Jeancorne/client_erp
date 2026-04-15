import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { UomLookup } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class UomService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiInventory}/uoms`;

  getUomsLookup(): Observable<ApiResponse<UomLookup[]>> {
    return this.http.get<ApiResponse<UomLookup[]>>(`${this.apiUrl}/lookup`);
  }
}
