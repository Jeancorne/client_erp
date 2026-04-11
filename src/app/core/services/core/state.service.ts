import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { State } from '../../models/core/location.models';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/state`;

  async getByCountry(countryId: string): Promise<State[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/country/${countryId}`));
    return response.succeeded ? response.data : [];
  }
}
