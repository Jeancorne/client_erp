import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FiscalResponsibility } from '../../models/company.models';

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
}
