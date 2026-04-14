import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FiscalResponsibility } from '../../models/core/fiscal-responsibility/fiscal-responsibility.model';

@Injectable({
  providedIn: 'root'
})
export class FiscalResponsibilityService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/fiscal-responsibility`;

  async getAll(): Promise<FiscalResponsibility[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<FiscalResponsibility>): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<FiscalResponsibility>): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, data));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
