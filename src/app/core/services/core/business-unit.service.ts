import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BusinessUnit } from '../../models/core/business-unit.models';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/business-unit`;

  async getAll(): Promise<BusinessUnit[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  async create(unit: BusinessUnit): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.apiUrl, unit));
    return response;
  }

  async update(id: string, unit: BusinessUnit): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, unit));
    return response;
  }

  async delete(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    return response;
  }
}
