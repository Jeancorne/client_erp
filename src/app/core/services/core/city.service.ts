import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { City } from '../../models/core/city/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/city`;

  async getAll(): Promise<City[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  async getByState(stateId: string): Promise<City[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/state/${stateId}`));
    return response.succeeded ? response.data : [];
  }

  async create(city: City): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, city));
  }

  async update(id: string, city: City): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, city));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
