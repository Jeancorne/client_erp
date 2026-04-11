import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { City } from '../../models/core/location.models';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/city`;

  async getByState(stateId: string): Promise<City[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/state/${stateId}`));
    return response.succeeded ? response.data : [];
  }
}
