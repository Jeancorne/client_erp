import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tax } from '../../models/core/tax/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tax`;

  async getAll(): Promise<Tax[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  async create(tax: Partial<Tax>): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, tax));
  }

  async update(id: string, tax: Partial<Tax>): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, tax));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
