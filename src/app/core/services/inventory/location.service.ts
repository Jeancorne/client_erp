import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/shared/api-response.model';
import { LocationLookup } from '../../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiInventory}/locations`;

  getLocationsLookup(companyId: string): Observable<ApiResponse<LocationLookup[]>> {
    return this.http.get<ApiResponse<LocationLookup[]>>(`${this.apiUrl}/lookup`, {
      params: { companyId }
    });
  }
}
