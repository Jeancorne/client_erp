import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserCompanyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user-company`;

  async getUsersByCompany(companyId: string): Promise<any[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/company/${companyId}`));
    return response.succeeded ? response.data : [];
  }
}
