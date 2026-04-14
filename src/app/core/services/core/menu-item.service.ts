import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuItem } from '../../models/core/menu/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/menu-item`;

  async getByMenu(menuId: string): Promise<MenuItem[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/menu/${menuId}`));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<MenuItem | null> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    return response.succeeded ? response.data : null;
  }

  async create(data: Partial<MenuItem>): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<MenuItem>): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, data));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
