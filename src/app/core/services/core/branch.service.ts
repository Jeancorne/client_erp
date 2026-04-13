import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Branch } from '../../models/core/branch/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/branch`;

  async getAll(): Promise<Branch[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  async getLookupByCompany(companyId: string): Promise<any[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/lookup/company/${companyId}`));
    return response.succeeded ? response.data : [];
  }

  async create(branch: Branch): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.apiUrl, branch));
    return response;
  }

  async update(id: string, branch: Branch): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, branch));
    return response;
  }

  async delete(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    return response;
  }
}
