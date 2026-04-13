import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentificationTypeService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/identification-type`;

  async getAll(): Promise<any[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : response; // Handle cases where data might be the top level array
  }
}
