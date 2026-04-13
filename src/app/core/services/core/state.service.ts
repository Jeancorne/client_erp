import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { State } from '../../models/core/state/state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/state`;

  async getAll(): Promise<State[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  async getByCountry(countryId: string): Promise<State[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/country/${countryId}`));
    return response.succeeded ? response.data : [];
  }

  async create(state: State): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, state));
  }

  async update(id: string, state: State): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, state));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
