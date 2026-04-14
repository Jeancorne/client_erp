import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuItemActionService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/menu-item-action`;

  async create(coreMenuItemId: string, coreActionId: string): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, { coreMenuItemId, coreActionId }));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
