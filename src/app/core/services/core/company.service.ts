import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Company } from '../../models/company/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/company`;

  async getAll(): Promise<Company[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getLookup(): Promise<any[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/lookup`));
    return response.succeeded ? response.data : [];
  }

  async create(company: Company): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.apiUrl, company));
    return response;
  }

  async update(id: string, company: Company): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, company));
    return response;
  }

  async delete(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    return response;
  }
}
